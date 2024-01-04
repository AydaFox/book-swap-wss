const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  between: {
    type: Array,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Message", messagesSchema);
