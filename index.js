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

wss.on("connection", (ws, request, client) => {
  console.log("client is connected");

  ws.on("error", console.error);

  ws.on("message", (data) => {
    console.log("received: %s", data);
    postMessage(data).then((sentMessage) => {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(sentMessage));
        }
      });
    });
  });

  ws.send("you are connected");

  ws.on("close", () => {
    console.log("client disconnected");
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
