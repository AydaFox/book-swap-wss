const { WebSocket, WebSocketServer } = require("ws");
const server = require("http").createServer();
const mongoose = require("mongoose");
const Message = require("./db/schema/message-schema");
const db = require("./db/connection");
const { postMessage } = require("./controllers/messages.controllers");

const wss = new WebSocketServer({ server });

// const onSocketError = (err) => {
//   console.error(err);
// };

const webSockets = {};

wss.on("connection", (ws, request, client) => {

  const userID = request.url.slice(1).split("%20").join(" ");
  webSockets[userID] = ws;

  console.log('connected: ' + userID)

  ws.on("error", console.error);

  ws.on("message", (data) => {

    console.log("received: %s", data);
    postMessage(data).then((sentMessage) => {
      const receiver = sentMessage.between.filter((user) => {
        return user !== sentMessage.from;
      })[0];
      const toUserWebSocket = webSockets[receiver];
      if (toUserWebSocket) {
        toUserWebSocket.send(JSON.stringify(sentMessage));
      }
    });
  });

  ws.send("you are connected, " + userID);

  ws.on("close", () => {
    delete webSockets[userID];
    console.log(userID + " disconnected");
  });
});

// server.on("upgrade", (request, socket, head) => {
//   socket.on("error", onSocketError);

//   // This function is not defined on purpose. Implement it with your own logic.

//   authenticate(request, (err, client) => {
//     console.log(client);
//     if (err || !client) {
//       socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
//       socket.destroy();
//       return;
//     }
//   });

//   socket.removeListener("error", onSocketError);

//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit("connection", ws, request, client);
//   });
// });

server.listen(9090, () => {
  console.log("listening on port 9090");
});
