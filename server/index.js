const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const {Server} = require("socket.io");
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static("documents"));

const io = new Server(server, {
  cors: {origin: "*", methods: ["GET", "POST"]},
});

let rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({roomId, username}) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {content: "", users: []};
    if (!rooms[roomId].users.some((u) => u.id === socket.id)) {
      rooms[roomId].users.push({id: socket.id, username});
    }

    socket.emit("load-content", rooms[roomId].content);
    io.to(roomId).emit(
      "room-users",
      rooms[roomId].users.map((u) => u.username)
    );
  });

  socket.on("send-changes", (delta) => {
    for (const roomId in rooms) {
      if (rooms[roomId].users.some((u) => u.id === socket.id)) {
        socket.to(roomId).emit("receive-changes", delta);
      }
    }
  });

  socket.on("save-doc", (content) => {
    for (const roomId in rooms) {
      if (rooms[roomId].users.some((u) => u.id === socket.id)) {
        rooms[roomId].content = content;
        fs.writeFileSync(
          `./documents/${roomId}.json`,
          JSON.stringify({content})
        );
      }
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const user = room.users.find((u) => u.id === socket.id);
      if (user) {
        room.users = room.users.filter((u) => u.id !== socket.id);
        io.to(roomId).emit(
          "room-users",
          room.users.map((u) => u.username)
        );
      }
    }
  });
});

server.listen(4000, () => console.log("Server listening on port 4000"));
