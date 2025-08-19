import { Mode } from "./constants";

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface ChatRequest {
  message: string;
  mode: string;
}

export class ChatService {
  private static instance: ChatService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/api' 
      : 'http://localhost:3000/api';
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(message: string, mode: Mode): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode: this.modeToApiFormat(mode)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  // Convert mode names to API format
  private modeToApiFormat(mode: Mode): string {
    const modeMap: Record<Mode, string> = {
      "Interview": "interview",
      "Story": "story", 
      "TL;DR": "tldr",
      "Humble Brag": "humblebrag"
    };
    return modeMap[mode];
  }
}
