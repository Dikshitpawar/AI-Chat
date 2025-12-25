import { io } from "socket.io-client";

const socket = io("https://ai-chat-backend-f6gr.onrender.com", {
  transports: ["websocket"]
});

export default socket;
