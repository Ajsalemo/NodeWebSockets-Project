const ws = require("ws");
const port = process.env.PORT || 3000;

const socket = new ws.Server({ port });
console.log(`Server listening on port: ${port}`);

socket.on("connection", (sock) => {
  const initialMsgMetaData = {
    serverMsg: "Hi client! You are now connected to me!",
    serverUser: process.env.COMPUTERNAME,
  };
  sock.send(JSON.stringify(initialMsgMetaData));

  sock.on("message", (message) => {
    const serverCurrentTime = new Date();
    const serverCurrentTimeFormatted = serverCurrentTime.toLocaleTimeString();
    console.log(`New message from client: ${message}`);
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
