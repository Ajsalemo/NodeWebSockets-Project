const ws = require("ws");
const port = process.env.PORT || 3000;

const socket = new ws.Server({ port });
console.log(`Server listening on port: ${port}`);

socket.on("connection", (sock) => {
  sock.send("Hi client! You are now connected to me!");

  sock.on("message", (message) => {
    console.log(`New message from client: ${message}`);
    const serverCurrentTime = new Date(Date.now() + 1000);
    const serverCurrentTimeFormatted = serverCurrentTime.toLocaleTimeString();
    const serverMetaData = {
      serverMsg: `Echoing back the client message: ${message}`,
      serverUser: process.env.COMPUTERNAME,
      serverTime: serverCurrentTimeFormatted,
    };
    sock.send(JSON.stringify(serverMetaData));
  });
});

socket.on("close", () => {
  console.log("Closing connection from the server.");
  socket.close();
});
