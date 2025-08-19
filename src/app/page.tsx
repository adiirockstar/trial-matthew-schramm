"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { ChatWindow } from "@/components/ChatWindow";
import { Composer } from "@/components/Composer";
import { SampleQuestions } from "@/components/SampleQuestions";
import { SidebarPanel } from "@/components/SidebarPanel";
import { Message, Mode } from "@/lib/constants";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode>("Interview");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  
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

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [],
      mode: selectedMode
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate streaming response
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
    
    // Simulate streaming
    let currentText = "";
    const fullResponse = `This is a simulated response in ${selectedMode} mode. Backend integration needed for real responses.`;
    const startTime = Date.now();
    
    const streamInterval = setInterval(() => {
      if (currentText.length < fullResponse.length) {
        currentText += fullResponse[currentText.length];
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, text: currentText, tokens: currentText.length, latency: Date.now() - startTime }
            : msg
        ));
      } else {
        clearInterval(streamInterval);
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, isStreaming: false, text: currentText }
            : msg
        ));
        setIsStreaming(false);
        setCurrentStreamingId(null);
      }
    }, 50);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleQuestionInsert = (question: string) => {
    // Focus composer and insert text
    if (composerRef.current) {
      const textarea = composerRef.current.querySelector('textarea') as HTMLTextAreaElement;
      const input = composerRef.current.querySelector('input') as HTMLInputElement;
      
      if (textarea) {
        textarea.focus();
        textarea.value = question;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (input) {
        input.focus();
        input.value = question;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    // Clear chat when mode changes
    setMessages([]);
  };

  const handleRetryMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.role === "assistant") {
      // Remove the failed message and retry
      setMessages(prev => prev.filter(m => m.id !== messageId));
      // Find the user message that triggered this response
      const userMessageIndex = messages.findIndex(m => m.id === messageId) - 1;
      if (userMessageIndex >= 0) {
        const userMessage = messages[userMessageIndex];
        if (userMessage.role === "user") {
          handleSendMessage(userMessage.text);
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

  const handleStarterPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto flex-1 grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_340px] lg:gap-6">
          {/* Left Column - Chat Area */}
          <div className="flex flex-col rounded-2xl border bg-card">
            <div className="p-4 border-b">
              <ModeSwitcher onModeChange={handleModeChange} initialMode={selectedMode} />
            </div>
            
            <div className="flex-1 min-h-0">
              <ChatWindow 
                messages={messages} 
                selectedMode={selectedMode}
                onRetryMessage={handleRetryMessage}
                onDeleteMessage={handleDeleteMessage}
                onStopStreaming={handleStopStreaming}
                onStarterPrompt={handleStarterPrompt}
              />
            </div>
            
            <div ref={composerRef}>
              <Composer 
                onSendMessage={handleSendMessage} 
                disabled={isStreaming}
                placeholder={`Ask me anything in ${selectedMode} mode...`}
              />
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            <SampleQuestions 
              questions={sampleQuestions} 
              onQuestionClick={handleQuestionClick}
              onQuestionInsert={handleQuestionInsert}
              onModeChange={handleModeChange}
              selectedMode={selectedMode}
            />
            <SidebarPanel />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
