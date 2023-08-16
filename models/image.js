const mongoose = require("mongoose");

const Image = mongoose.model("Image", {
  ImageId: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: true,
  },
});

module.exports = { Image };
