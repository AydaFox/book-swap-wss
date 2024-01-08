const { WebSocketServer } = require("ws");
const server = require("http").createServer();
const db = require("./db/connection");
const { postMessage } = require("./controllers/messages.controllers");

const wss = new WebSocketServer({ server });

const webSockets = {};

wss.on("connection", (ws, request) => {
  let userID = request.url.slice(1).split("%20").join(" ");
  if (webSockets[userID]) {
    console.log(userID + " already connected");
    userID = "unauthorised";
    ws.terminate();
  } else {
    webSockets[userID] = ws;
  }

  console.log("connected: " + userID);
  console.log("concurrent users: ", Object.keys(webSockets));

  ws.on("error", console.error);

  ws.on("message", (data) => {
    postMessage(data)
      .then((sentMessage) => {
        const receiver = sentMessage.between.filter((user) => {
          return user !== sentMessage.from;
        })[0];
        const toUserWebSocket = webSockets[receiver];
        if (toUserWebSocket) {
          toUserWebSocket.send(JSON.stringify(sentMessage));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ws.send("you are connected, " + userID);

  ws.on("close", () => {
    delete webSockets[userID];

    console.log(userID + " disconnected");
    console.log("concurrent users: ", Object.keys(webSockets));
  });
});

server.listen(9090, () => {
  console.log("listening on port 9090");
});
