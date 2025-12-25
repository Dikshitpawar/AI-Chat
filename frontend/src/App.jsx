import { useEffect, useState } from "react";
import socket from "./socket";
import "./index.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
  });

    socket.on("ai-response", (res) => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.aiResponse }
      ]);
    });

    return () => {
      socket.off("ai-response");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: message }
    ]);

    socket.emit("message", message);
    setMessage("");
  };

  return (
    <div className="wrapper">
    <div className="chat-container">
      <div className="chat-header">AI Chat</div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
    </div>
  );
}

export default App;
