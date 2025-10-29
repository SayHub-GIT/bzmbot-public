import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import bzmLogo from "/bzm.png";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Assalammualaikum, Hai! Aku Boba 🤖, ada yang bisa dibantu?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // kirim ke backend (otomatis proxy ke http://localhost:5000/api/chat)
     const res = await axios.post("/api/chat", {
  message: input,
  history: messages, // kirim percakapan sebelumnya
});

      // ambil data dari backend
      const data = res.data;

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "Boba lagi error nih 😅" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Server error bro 😔" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-blue-600 text-white">
        <img src={bzmLogo} alt="Boba Logo" className="w-17 h-8 rounded-full bg-white p-1" />
        <h1 className="text-lg font-semibold">Boba (Bot Bazma)</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            {msg.from === "bot" && (
              <img src={bzmLogo} alt="logo" className="w-17 h-8 mr-2 self-end mt-5" />
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                msg.from === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.from === "bot" && <p className="text-xs font-semibold mb-1">Boba</p>}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2">
            <img src={bzmLogo} alt="loading" className="w-17 h-8" />
            <div className="flex gap-1 mt-1">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          placeholder="Tanya seputar sekolah.."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
