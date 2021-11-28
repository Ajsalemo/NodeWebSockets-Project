const ws = require("ws");
const port = process.env.PORT || 3000;

const socket = new ws.Server({ port });
console.log(`Server listening on port: ${port}`);

socket.on("connection", (socket) => {
  socket.send("Hi client! You are now connected to me!");

  socket.on("message", (message) => {
    console.log(`New message from client: ${message}`);
  });

  socket.on("close", (socket) => {
    console.log(socket);
    console.log("Closing connection from the server.");
  });
});
