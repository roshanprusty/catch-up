/**
 * The `handleEvents` function handles various socket events for a real-time communication application.
 * @param io - The `io` parameter is an instance of the Socket.IO server. It allows you to interact
 * with the server and handle events related to socket connections and communication.
 */
const handleEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("connected successfully " + socket.id);

    socket.on("joinRoom", (roomName) => {
      let rooms = io.sockets.adapter.rooms;
      let room = rooms.get(roomName);
      if (room === undefined) {
        socket.join(roomName);
        socket.emit("createdRoom");
      } else if (room.size == 1) {
        socket.join(roomName);
        socket.emit("roomJoined");
      } else {
        socket.emit("full");
      }
      console.log(rooms);
    });

    socket.on("iceCandidates", (candidate, roomName) => {
      socket.broadcast.to(roomName).emit("candidate", candidate);
    });
    socket.on("sendDetails", (roomName, data) => {
      console.log(data.username);
      socket.broadcast.to(roomName).emit("sendDetails", data.username);
    });

    socket.on("offer", (offer, roomName) => {
      socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (ans, roomName) => {
      socket.broadcast.to(roomName).emit("answer", ans);
    });

    socket.on("ready", (roomName) => {
      socket.broadcast.to(roomName).emit("ready");
    });
    socket.on("leave", function (roomName) {
      socket.leave(roomName);
      socket.broadcast.to(roomName).emit("leave");
      console.log("leave event fired");
    });
  });
};
module.exports = handleEvents;
