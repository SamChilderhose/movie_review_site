const mongoose = require("mongoose");
/*
{
        Title: "Great!",
        Text: "This movie was great",
        CreatedBy: "Adam Jones",
        CreatedAt: new Date(2020, 5, 1),
        Image: "phil_dunphy.jpg",
        Liked: true,
        Rating: 4,
        NumberOfLikes: 87,
      }, */
const Review = mongoose.model("Review", {
  Movie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Rating: {
    type: Number,
    required: true,
  },
  NumberOfLikes: {
    type: Number,
    default: 0,
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  CreatedAt: {
    type: Date,
    required: true,
  },
});

module.exports = { Review };
