const ws = require("ws");
const port = process.env.PORT || 3000;

const socket = new ws.Server({ port });
console.log(`Server listening on port: ${port}`);

socket.on("connection", (sock) => {
  sock.send("Hi client! You are now connected to me!");

  sock.on("message", (message) => {
    console.log(`New message from client: ${message}`);
    const serverCurrentTime = new Date()
    const serverCurrentTimeFormatted = serverCurrentTime.toLocaleTimeString()
    console.log(serverCurrentTimeFormatted)
    sock.send(JSON.stringify({
      msg: `Echoing back the client message: ${message}`,
      user: process.env.COMPUTERNAME,
      serverTime: serverCurrentTimeFormatted
    }));
  });
});

socket.on("close", () => {
  console.log("Closing connection from the server.");
  socket.close();
});
