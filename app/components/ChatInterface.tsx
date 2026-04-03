"use client";

import { useState, useRef, useEffect } from "react";
import { logout } from "@/app/actions/auth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  initialMessages: Message[];
  userName: string;
  planTier: string;
  monthlyChatsUsed: number;
}

export default function ChatInterface({ initialMessages, userName, planTier, monthlyChatsUsed }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [chatLimitReached, setChatLimitReached] = useState(
    planTier === "free" && monthlyChatsUsed >= 5
  );
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    }
    setUpgradeLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (response.status === 403) {
        const data = await response.json();
        if (data.error === "chat_limit_reached") {
          setChatLimitReached(true);
          setMessages((prev) => prev.slice(0, -1));
          setIsLoading(false);
          return;
        }
      }

      if (!response.ok) throw new Error("Request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              fullText += parsed.text;
              setStreamingText(fullText);
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullText },
      ]);
      setStreamingText("");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm so sorry, something went wrong. Please try again — I'm here for you.",
        },
      ]);
      setStreamingText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-900 tracking-tight">
              Shared Leash
            </h1>
            <p className="text-sm text-amber-700">
              A gentle space to grieve and remember
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-amber-700 hidden sm:block">
              Hello, {userName}
            </span>
            <a
              href="/account"
              className="text-xs text-amber-600 hover:text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-1.5 transition-colors"
            >
              Account
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs text-amber-600 hover:text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-1.5 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col gap-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-16 gap-6">
            <div className="text-7xl">🐶🐱🐰🐦</div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-amber-900">
                You are not alone in this
              </h2>
              <p className="text-amber-800 max-w-md leading-relaxed">
                Losing a beloved companion is one of the deepest losses we
                carry. This is a safe, gentle space where you can share your
                grief, your memories, and your love.
              </p>
              <p className="text-amber-600 text-sm italic">
                Take your time. I&apos;m here to listen.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "I just lost my pet…",
                "I want to share a memory",
                "I'm struggling with the grief",
                "Tell me how to cope",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  className="px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm transition-colors cursor-pointer border border-amber-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-xl flex-shrink-0 mt-1">
                🐾
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-amber-600 text-white rounded-tr-sm"
                  : "bg-white text-amber-950 rounded-tl-sm border border-amber-100"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.content.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {streamingText && (
          <div className="flex gap-3 flex-row">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-xl flex-shrink-0 mt-1">
              🐾
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-white text-amber-950 shadow-sm border border-amber-100">
              {streamingText.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  {j < streamingText.split("\n").length - 1 && <br />}
                </span>
              ))}
              <span className="inline-block w-1.5 h-4 bg-amber-400 ml-0.5 animate-pulse rounded-sm align-text-bottom" />
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {isLoading && !streamingText && (
          <div className="flex gap-3 flex-row">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-xl flex-shrink-0">
              🐾
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-amber-100 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Chat limit message */}
        {chatLimitReached && (
          <div className="flex gap-3 flex-row">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-xl flex-shrink-0 mt-1">
              🐾
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed bg-amber-50 text-amber-900 shadow-sm border border-amber-200">
              <p>
                You&apos;ve used your 5 free conversations this month. Shared
                Leash Premium gives you unlimited support, whenever you need
                it — including full memory of your pet&apos;s name and story
                across every session.
              </p>
              <p className="mt-3">
                <button
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="text-amber-700 hover:text-amber-900 font-medium underline underline-offset-2 transition-colors"
                >
                  {upgradeLoading ? "Loading…" : "Upgrade now"}
                </button>
                <span className="text-amber-600">
                  {" "}— your grief doesn&apos;t have a monthly limit.
                </span>
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-amber-100 shadow-lg sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Share what's in your heart… (Enter to send, Shift+Enter for new line)"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50 leading-relaxed max-h-40 overflow-y-auto"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0 shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 rotate-90"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-amber-400 mt-2">
            A safe space powered by compassionate AI • Not a substitute for professional grief counseling
          </p>
        </div>
      </div>
    </div>
  );
}
