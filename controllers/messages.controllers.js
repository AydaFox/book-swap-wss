const { insertMessage } = require("../models/messages.models");

exports.postMessage = (data) => {
  const message = {
    between: ["Sarah Blue", "David Black"].sort(),
    from: "Sarah Blue",
    timestamp: new Date().toISOString(),
    body: data,
  };

  return insertMessage(message)
};
