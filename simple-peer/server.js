const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  const { id } = socket;

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.to(room).emit("joined-room", { peerId: id });
  });

  socket.on("signal", ({ peerId, data }) => {
    io.to(peerId).emit("signal", { peerId: id, data });
  });

  socket.on("disconnect", () => {
    io.emit("peer-disconnected", id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
