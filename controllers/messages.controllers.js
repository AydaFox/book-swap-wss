const { insertMessage } = require("../models/messages.models");

exports.postMessage = (data) => {
  const message = JSON.parse(data);

  message.timestamp = new Date().toISOString();
  message.between.sort();

  return insertMessage(message);
};
