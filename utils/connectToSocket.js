io.on("connection", (socket) => {
    // The below function is for one to one chat
    socket.on("setup", (userData, cb) => {
      socket.join(userData);
      cb({
        status: "success",
      });
    });
  
    // The below function is for group chat
    socket.on("join room", (room) => {
      socket.join(room);
      console.log(room);
    });
  
    socket.on("typing", (room) => {
      socket.to("Faizan room").emit("typing");
    });
  
    socket.on("stop typing", (room) => {
      socket.to("Faizan room").emit("stop typing");
    });
  
    socket.on("send message", (newMessage) => {
      socket.to("Faizan room").emit("message received", newMessage);
    });
  });