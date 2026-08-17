"use client";

import * as React from "react";
import { askDemuseAIAction, type AIChatMessage } from "@/actions/ai.actions";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/Button";
import { RobotIcon } from "@/components/ui/RobotIcon";
import {
  Send,
  Trash2,
  User,
  AlertTriangle,
  Lightbulb,
  X,
} from "reicon-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  timetableId?: string;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  userName = "bạn",
  timetableId,
}: AIAssistantModalProps) {
  const { language } = useLanguage();
  const isVi = language === "vi";

  const initialGreeting: AIChatMessage = {
    role: "assistant",
    content: isVi
      ? `Xin chào ${userName}! Mình là Trợ lý AI Demuse (chạy trên Groq Llama 3.1 siêu tốc). Mình đã kết nối với toàn bộ lịch tuần của bạn. Bạn muốn hỏi gì hôm nay?`
      : `Hello ${userName}! I'm Demuse AI (powered by ultra-fast Groq Llama 3.1). How can I assist with your weekly schedule and tasks?`,
  };

  const [messages, setMessages] = React.useState<AIChatMessage[]>([initialGreeting]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isLoading]);

  const quickPrompts = isVi
    ? [
        "Hôm nay mình có những lịch gì?",
        "Ngày nào trong tuần mình có nhiều thời gian rảnh nhất?",
        "Kiểm tra xem mình có bị trùng lịch học hay ca làm không?",
      ]
    : [
        "What is my schedule for today?",
        "Which day this week do I have the most free time?",
        "Do I have any potential schedule clashes?",
      ];

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMsg: AIChatMessage = { role: "user", content: promptText };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await askDemuseAIAction(updatedMessages, timetableId);
      if (res.success && res.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.message },
        ]);
      } else {
        setErrorMessage(
          res.error || (isVi ? "Không thể nhận phản hồi từ AI." : "Failed to get AI response.")
        );
      }
    } catch {
      setErrorMessage(
        isVi
          ? "Đã xảy ra lỗi kết nối với Groq AI. Vui lòng thử lại sau giây lát."
          : "An error occurred connecting to Groq AI."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1c1917]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#ded7c8] shadow-2xl overflow-hidden z-10 flex flex-col h-[600px] max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#f0eae1] bg-[#faf7f2]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <RobotIcon className="h-8 w-8" size={32} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-semibold text-[#1c1917]">
                  {isVi ? "Trợ Lý AI Demuse" : "Demuse AI Assistant"}
                </h3>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Groq Llama 3.1
                </span>
              </div>
              <p className="text-[11px] text-[#78716c]">
                {isVi ? "Hỏi đáp lịch trình & phân tích kế hoạch tuần" : "Instant schedule insights & planning"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMessages([initialGreeting]);
                setErrorMessage(null);
              }}
              className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 shrink-0">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-semibold">{isVi ? "Thông báo từ Groq AI:" : "Groq AI Notice:"}</p>
              <p className="mt-0.5 opacity-90 truncate">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";

            return (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                {isAssistant && (
                  <RobotIcon className="h-7 w-7 mt-0.5" size={28} />
                )}

                <div
                  className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isAssistant
                      ? "bg-[#faf7f2] border border-[#e8e1d5] text-[#1c1917] shadow-2xs"
                      : "bg-[#1c1917] text-white shadow-xs"
                  }`}
                >
                  {msg.content}
                </div>

                {!isAssistant && (
                  <div className="h-7 w-7 rounded-full bg-[#1c1917] text-white flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5 shadow-2xs">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start items-center animate-pulse">
              <RobotIcon className="h-7 w-7" size={28} />
              <div className="rounded-2xl px-3.5 py-2 bg-[#faf7f2] border border-[#e8e1d5] text-xs text-[#78716c] flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#854d0e] animate-bounce" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#854d0e] animate-bounce [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#854d0e] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">{isVi ? "Demuse AI đang trả lời..." : "AI is thinking..."}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3.5 py-2 bg-[#faf7f2]/60 border-t border-[#f0eae1] flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar shrink-0">
          <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-medium bg-white hover:bg-[#ede8dc] text-[#57534e] hover:text-[#1c1917] border border-[#ded7c8] px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-[#ded7c8] bg-white flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isVi
                ? "Hỏi Demuse AI về lịch học, giờ rảnh, ca làm..."
                : "Ask Demuse AI about your classes, free time, shifts..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-[#faf7f2] border border-[#ded7c8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:bg-white focus:border-[#1c1917] focus:outline-none transition-all"
            autoComplete="off"
            spellCheck={false}
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="gap-1.5 px-3.5 h-9 shadow-2xs text-xs"
          >
            <span>{isVi ? "Gửi" : "Send"}</span>
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
}
