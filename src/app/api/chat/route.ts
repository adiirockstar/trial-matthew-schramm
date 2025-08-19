import { NextRequest, NextResponse } from "next/server";
import { pineIndex } from "@/lib/pine";
import { systemBase, modePreambles } from "@/lib/prompt";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";

interface DocumentMetadata {
  title?: string;
  source?: string;
  file?: string;
  text?: string;
}

const CHAT_MODEL = "gpt-4o-mini";
const EMB_MODEL = "text-embedding-ada-002"; // Changed to match 1536 dimensions
const TOP_K = 5;

export async function POST(req: NextRequest) {
  try {
    const { message, mode = "interview" } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    // 1) Embed question
    const emb = new OpenAIEmbeddings({ model: EMB_MODEL });
    const qVec = await emb.embedQuery(message);

    // 2) Retrieve from Pinecone
    const results = await pineIndex.query({
      vector: qVec,
      topK: TOP_K,
      includeMetadata: true,
    });
    const matches = results.matches ?? [];

    // 3) Build context
    const context = matches.map((m, i) => {
      const md = (m.metadata || {}) as DocumentMetadata;
      const title = md.title ?? md.file ?? `Doc ${i + 1}`;
      const src = md.source ?? "Doc";
      const file = md.file ?? "";
      const text = md.text ?? "";
      return `# Source ${i + 1}: ${title}\n[${src}] ${file}\n${text}`;
    }).join("\n\n");

    // 4) Prompt
    const system = `${systemBase}\n${modePreambles[mode] ?? ""}`.trim();
    const user = `Question:\n${message}\n\nContext:\n${context}\n\nInstructions:\n- Use only the context provided.\n- If info is missing, state what is missing.\n- End your reply with: "Sources: <titles>"`;

    // 5) Call model
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const chat = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.3,
      max_tokens: 600,
    });

    const answer = chat.choices[0]?.message?.content ?? "";
    const sources = matches.map(m => {
      const md = (m.metadata || {}) as DocumentMetadata;
      return md.title ?? md.file ?? "Doc";
    });

    return NextResponse.json({ answer, sources });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "chat_error", detail: String(e) }, { status: 500 });
  }
}
