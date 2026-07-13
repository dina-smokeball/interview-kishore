"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";

interface SourceListItem {
  id: string;
  matterId: string;
  title: string;
  preview: string;
}

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const [sources, setSources] = useState<SourceListItem[]>([]);
  const [userName, setUserName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/sources")
      .then((r) => r.json())
      .then((d) => {
        setSources(d.sources);
        setUserName(d.user.name);
      });
  }, []);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function submit() {
    if (!input.trim()) return;
    sendMessage({ text: input }, { body: { sourceIds: selected } });
    setInput("");
  }

  return (
    <main
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: 24,
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: 24,
      }}
    >
      <aside>
        <h3>Knowledge sources</h3>
        <p style={{ fontSize: 12, color: "#666" }}>Signed in as {userName}</p>
        {sources.map((s) => (
          <label key={s.id} style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />{" "}
            {s.title}
            {/* one-line preview of the source contents */}
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              {s.preview}
            </div>
            {/* TODO (feature): let the user open this source to read its full text */}
          </label>
        ))}
      </aside>

      <section>
        <h2 style={{ marginTop: 0 }}>Ask the documents</h2>
        <div
          style={{
            minHeight: 300,
            border: "1px solid #e3e3e3",
            borderRadius: 8,
            padding: 12,
            background: "#fff",
          }}
        >
          {messages.map((m, i) => (
            <div key={i} style={{ margin: "10px 0" }}>
              <strong>{m.role === "user" ? "You" : "Assistant"}:</strong>{" "}
              {m.parts.map((part, j) =>
                part.type === "text" ? <span key={j}>{part.text}</span> : null,
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Ask a question..."
            style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <button onClick={submit} style={{ padding: "10px 16px", borderRadius: 6 }}>
            Send
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#999" }}>status: {status}</p>
      </section>
    </main>
  );
}
