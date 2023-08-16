const mongoose = require("mongoose");
/*
{
    From: {
        Name: "John Smith",
        Image: "phil_dunphy.jpg",
    },
    Message: "Hey",
    Sent: new Date(),
}
*/
const Message = mongoose.model("Message", {
  Text: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: true,
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = { Message };
