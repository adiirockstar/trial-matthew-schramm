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
const EMB_MODEL = "text-embedding-3-small"; // Changed to match ingest script
const TOP_K = 5;
const RELEVANCE_THRESHOLD = 0.2; // Lowered from 0.7 to be more permissive

export async function POST(req: NextRequest) {
  try {
    const { message, mode = "interview" } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    // Check if message is just a greeting/small talk that doesn't need sources
    const isGreeting = /^(hey|hi|hello|good morning|good afternoon|good evening|how are you|what's up|sup|yo)$/i.test(message.trim());
    
    if (isGreeting) {
      // For greetings, just respond conversationally without sources
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
      const chat = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: "You are Matthew's Codex, a helpful AI assistant. Respond warmly and conversationally to greetings." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const answer = chat.choices[0]?.message?.content ?? "";
      return NextResponse.json({ answer, sources: [] });
    }

    // 1) Embed question
    console.log(`🔍 Embedding query: "${message}"`);
    const emb = new OpenAIEmbeddings({ model: EMB_MODEL });
    const qVec = await emb.embedQuery(message);

    // 2) Retrieve from Pinecone
    console.log(`🌲 Querying Pinecone with topK=${TOP_K}...`);
    const results = await pineIndex.query({
      vector: qVec,
      topK: TOP_K,
      includeMetadata: true,
    });
    const matches = results.matches ?? [];
    
    console.log(`📊 Found ${matches.length} matches:`);
    matches.forEach((m, i) => {
      const score = m.score || 0;
      const title = (m.metadata as DocumentMetadata)?.title || 'Unknown';
      console.log(`  ${i + 1}. Score: ${score.toFixed(3)}, Title: ${title}`);
    });

    // Only proceed with document context if we have relevant matches
    if (matches.length === 0 || matches.every(m => (m.score || 0) < RELEVANCE_THRESHOLD)) {
      console.log(`⚠️ No relevant documents found (threshold: ${RELEVANCE_THRESHOLD})`);
      // No relevant documents found, respond without sources
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
      const chat = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: "You are Matthew's Codex, a helpful AI assistant. If you can't find relevant information in the provided context, respond helpfully without making up information." },
          { role: "user", content: message }
        ],
        temperature: 0.3,
        max_tokens: 400,
      });

      const answer = chat.choices[0]?.message?.content ?? "";
      return NextResponse.json({ answer, sources: [] });
    }

    // 3) Build context
    const context = matches.map((m, i) => {
      const md = (m.metadata || {}) as DocumentMetadata;
      const title = md.title ?? md.file ?? `Doc ${i + 1}`;
      const src = md.source ?? "Doc";
      const file = md.file ?? "";
      const text = md.text ?? "";
      return `# Source ${i + 1}: ${title}\n[${src}] ${file}\n${text}`;
    }).join("\n\n");

    console.log(`📚 Building context from ${matches.length} relevant sources`);

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

    console.log(`✅ Response generated with ${sources.length} sources`);
    return NextResponse.json({ answer, sources });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "chat_error", detail: String(e) }, { status: 500 });
  }
}
