"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { ChatWindow } from "@/components/ChatWindow";
import { Composer } from "@/components/Composer";
import { SampleQuestions } from "@/components/SampleQuestions";
import { SidebarPanel } from "@/components/SidebarPanel";
import { Message, Mode } from "@/lib/constants";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode>("Interview");
  const [sampleQuestions] = useState<string[]>([
    "What kind of engineer are you?",
    "What are your strongest technical skills?",
    "What project are you most proud of and why?",
    "What do you value in a team or company culture?",
    "How do you approach learning or debugging something new?",
    "What's your experience with modern web technologies?",
    "How do you handle technical challenges and setbacks?"
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };
    setMessages(prev => [...prev, newMessage]);
    
    // TODO: Add backend integration here to get assistant response
    // For now, just echo back a placeholder response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        text: `This is a placeholder response in ${selectedMode} mode. Backend integration needed.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: []
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
    // TODO: Add logic to handle mode changes (e.g., clear chat, change AI behavior, etc.)
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto grid h-[calc(100vh-4rem)] grid-cols-1 gap-6 p-4 lg:grid-cols-[1fr_340px]">
          {/* Left Column - Chat Area */}
          <div className="flex flex-col rounded-2xl border bg-card">
            <div className="p-4 border-b">
              <ModeSwitcher onModeChange={handleModeChange} initialMode={selectedMode} />
            </div>
            
            <div className="flex-1 min-h-0">
              <ChatWindow messages={messages} />
            </div>
            
            <Composer onSendMessage={handleSendMessage} />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <SampleQuestions questions={sampleQuestions} onQuestionClick={handleQuestionClick} />
            <SidebarPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
