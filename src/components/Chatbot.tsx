import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ExternalLink } from "lucide-react";
import bzmLogo from "/bzm.png";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Assalammualaikum! Aku Boba 🤖, asisten digital SMK TI Bazma. Ada yang bisa aku bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const text = customMessage || input;
    if (!text.trim()) return;

    setShowQuickQuestions(false);

    const userMessage = { from: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        message: text,
        history: messages,
      });

      const data = res.data;
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "Boba lagi error nih 😅" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Server error 😔 Coba lagi ya!" },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowQuickQuestions(true), 600);
    }
  };

  const handleOpen = () => {
    setShowButton(false);
    setTimeout(() => setIsOpen(true), 80);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setShowButton(true), 200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      <AnimatePresence>
        {showButton && !isOpen && (
          <motion.button
            key="chat-bubble"
            onClick={handleOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-box"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 40,
              transition: { duration: 0.18 },
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-96 h-[550px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <img
                  src={bzmLogo}
                  alt="Boba Logo"
                  className="w-10 h-10 rounded-full bg-white p-1"
                />
                <h1 className="text-lg font-semibold">Boba (Bot Bazma)</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.open("/ai", "_blank")}
                  className="hover:text-gray-200 transition"
                  title="Buka halaman Boba"
                >
                  <ExternalLink size={20} />
                </button>
                <button
                  onClick={handleClose}
                  className="hover:text-gray-200 transition"
                  title="Tutup"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <img
                      src={bzmLogo}
                      alt="logo"
                      className="w-10 h-10 mr-2 self-end mt-5"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.from === "bot" && (
                      <p className="text-xs font-semibold mb-1">Boba</p>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <img src={bzmLogo} alt="loading" className="w-10 h-10" />
                  <div className="flex gap-1 mt-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions */}
            <AnimatePresence>
              {showQuickQuestions && (
                <motion.div
                  key="quick-questions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-end gap-2 px-3 py-2 border-t border-gray-200 bg-white/70 backdrop-blur-sm"
                >
                  {[
                    "Sekolah apa ini?",
                   
                    "Teknis perpulangan bagaimana?",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-sm border border-gray-300 px-3 py-1 rounded-full hover:bg-blue-100 transition whitespace-nowrap"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 bg-white flex items-center gap-2 border-t">
              <input
                type="text"
                value={input}
                placeholder="Tanya seputar sekolah.."
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Kirim
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
