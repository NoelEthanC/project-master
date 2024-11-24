const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from "public" directory
app.use(express.static("public"));

// Listen for client connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for "message" event
  //   socket.on("message", (msg) => {
  //     console.log("Message received:", msg);
  //     // Broadcast message to all clients
  //     io.emit("message", msg);
  //   });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  let nickname = `User_${socket.id.slice(0, 4)}`;

  socket.on("set-nickname", (newNickname) => {
    nickname = newNickname;
  });

  socket.on("message", (msg) => {
    io.emit("message", `${nickname}: ${msg}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
