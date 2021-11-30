const ws = require("ws");
const port = process.env.PORT || 3000;

const socket = new ws.Server({ port });
console.log(`Server listening on port: ${port}`);

socket.on("connection", (sock) => {
  sock.send("Hi client! You are now connected to me!");

  sock.on("message", (message) => {
    console.log(`New message from client: ${message}`);
    sock.send(`Echoing back the client message: ${message}`);
  });
});

socket.on("close", () => {
  console.log("Closing connection from the server.");
  socket.close();
});
