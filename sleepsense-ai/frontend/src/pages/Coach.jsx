import React, { useState } from "react";
import api from "../api/client";

const suggestions = [
  "Why am I not getting enough deep sleep?",
  "How can I sleep faster?",
  "What foods improve sleep?",
  "Is my stress affecting sleep?",
  "Why do I wake up at 3 AM?",
];

export default function Coach() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I'm your AI sleep coach. Ask me anything about your sleep." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (question) => {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/sleep/coach", { question });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-dusk-100 mb-8">AI Sleep Coach</h1>

      <div className="card p-6 h-[420px] overflow-y-auto flex flex-col gap-4 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
              m.role === "user"
                ? "bg-moon-400 text-midnight-950 self-end rounded-br-sm"
                : "bg-midnight-800 text-dusk-200 self-start rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-dusk-400 text-sm">Thinking...</div>}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((s) => (
          <button key={s} onClick={() => send(s)} className="text-xs btn-secondary py-1.5 px-3">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-3"
      >
        <input
          className="input-field flex-1"
          placeholder="Ask about your sleep..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
