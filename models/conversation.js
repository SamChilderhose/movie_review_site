const mongoose = require("mongoose");

const Conversation = mongoose.model("Conversation", {
  Users: {
    type: Array,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: true,
  },
  Messages: {
    type: Array,
    default: [],
  },
});

module.exports = { Conversation };
