const Message = require("../db/schema/message-schema");

exports.insertMessage = (message) => {
  const messageToSave = new Message(message);
 return messageToSave.save().then((sentMessage) => {
return sentMessage  });
};
