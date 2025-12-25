require('dotenv').config();
const app = require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./service/ai.service')

const httpServer = createServer(app);
const io = new Server(httpServer , {
    cors : {
    origin : "http://localhost:5173"
  }
});


const chatHistory = []

io.on("connection",  (socket) => {
  console.log("A user connected")
    socket.on('disconnet' , ()=>{
        console.log("A user disconnected")
    })


    socket.on('message' , async (data)=>{
        console.log("Question=======>" , data);

        chatHistory.push({
            role:"user",
            parts:[{text:data}]
        })

        const aiResponse = await generateResponse(chatHistory);

        console.log("Answer======>" , aiResponse);

        chatHistory.push({
            role:"model",
            parts:[{text:aiResponse}]
        })

        socket.emit('ai-response' , {aiResponse});
        
    })

});


httpServer.listen(3000 , ()=>{
    console.log("Server is running...");
})