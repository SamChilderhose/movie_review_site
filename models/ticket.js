const mongoose = require("mongoose");
/*
ticket: {
      title: "",
      author: "",
      content: "",
      status: "",
      posttime: null,
    },*/

const Ticket = mongoose.model("Ticket", {
  Title: {
    type: String,
    required: true,
    minlength: 1,
  },
  Author: {
    type: String,
    required: true,
  },
  Content: {
    type: String,
    required: true,
    minlength: 1,
  },
  Status: {
    type: String,
    required: true,
  },
  Posttime: {
    type: Date,
    required: true
  },
});

module.exports = { Ticket };