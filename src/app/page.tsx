"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { ChatWindow } from "@/components/ChatWindow";
import { Composer } from "@/components/Composer";
import { SampleQuestions } from "@/components/SampleQuestions";
import { SelfReflectionQuestions } from "@/components/SelfReflectionQuestions";
import { SidebarPanel } from "@/components/SidebarPanel";
import { Message, Mode } from "@/lib/constants";
import { ChatService } from "@/lib/chat-service";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode>("Interview");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  const [insertedQuestion, setInsertedQuestion] = useState<string>("");
  const composerRef = useRef<HTMLDivElement>(null);
  const chatService = ChatService.getInstance();
  
  const [sampleQuestions] = useState<string[]>([
    "What kind of engineer are you?",
    "What are your strongest technical skills?",
    "What project are you most proud of and why?",
    "What do you value in a team or company culture?",
    "How do you approach learning or debugging something new?",
    "What's your experience with modern web technologies?",
    "How do you handle technical challenges and setbacks?"
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [],
      mode: selectedMode
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Clear the inserted question value
    setInsertedQuestion("");
    
    // Create assistant message placeholder
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      text: "",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [],
      mode: selectedMode,
      isStreaming: true,
      tokens: 0,
      latency: 0
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsStreaming(true);
    setCurrentStreamingId(assistantMessageId);
    
    try {
      const startTime = Date.now();
      
      // Call the chat API
      const response = await chatService.sendMessage(text, selectedMode);
      
      // Update the assistant message with the real response
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              text: response.answer, 
              sources: response.sources,
              isStreaming: false,
              tokens: response.answer.length,
              latency: Date.now() - startTime
            }
          : msg
      ));
      
    } catch (error) {
      // Handle error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              error: error instanceof Error ? error.message : 'Unknown error',
              isStreaming: false
            }
          : msg
      ));
    } finally {
      setIsStreaming(false);
      setCurrentStreamingId(null);
    }
  };

  const handleQuestionClick = async (question: string) => {
    await handleSendMessage(question);
  };

  const handleQuestionInsert = (question: string) => {
    // Set the inserted question value for the composer
    setInsertedQuestion(question);
  };

  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    // Clear chat when mode changes
    setMessages([]);
  };

  const handleRetryMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.role === "assistant") {
      // Remove the failed message and retry
      setMessages(prev => prev.filter(m => m.id !== messageId));
      // Find the user message that triggered this response
      const userMessageIndex = messages.findIndex(m => m.id === messageId) - 1;
      if (userMessageIndex >= 0) {
        const userMessage = messages[userMessageIndex];
        if (userMessage.role === "user") {
          await handleSendMessage(userMessage.text);
        }
      }
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const handleStopStreaming = (messageId: string) => {
    if (messageId === currentStreamingId) {
      setIsStreaming(false);
      setCurrentStreamingId(null);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
    }
  };

  const handleStarterPrompt = async (prompt: string) => {
    await handleSendMessage(prompt);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto flex-1 grid grid-cols-1 gap-2 sm:gap-3 p-2 sm:p-3 lg:grid-cols-[1fr_340px] lg:gap-6 lg:p-4">
          {/* Left Column - Chat Area */}
          <div 
            className="flex flex-col rounded-2xl border bg-card order-2 lg:order-1 chat-container" 
            style={{ 
              height: 'calc(100vh - 12rem)',
              minHeight: '1300px'
            }}
          >
            <div className="p-2 sm:p-3 lg:p-4 border-b flex-shrink-0">
              <ModeSwitcher onModeChange={handleModeChange} initialMode={selectedMode} />
            </div>
            
            <div className="chat-messages-container flex-1 min-h-0">
              <ChatWindow 
                messages={messages} 
                selectedMode={selectedMode}
                onRetryMessage={handleRetryMessage}
                onDeleteMessage={handleDeleteMessage}
                onStopStreaming={handleStopStreaming}
                onStarterPrompt={handleStarterPrompt}
              />
            </div>
            
            <div ref={composerRef} className="flex-shrink-0">
              <Composer 
                onSendMessage={handleSendMessage} 
                disabled={isStreaming}
                isLoading={isStreaming}
                placeholder={`Ask me anything in ${selectedMode} mode...`}
                value={insertedQuestion}
              />
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-6 order-1 lg:order-2">
            {selectedMode === "Self-Reflection" ? (
              <SelfReflectionQuestions 
                onQuestionClick={handleQuestionClick}
                onQuestionInsert={handleQuestionInsert}
              />
            ) : (
              <SampleQuestions 
                questions={sampleQuestions} 
                onQuestionClick={handleQuestionClick}
                onQuestionInsert={handleQuestionInsert}
                onModeChange={handleModeChange}
                selectedMode={selectedMode}
              />
            )}
            <SidebarPanel />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
