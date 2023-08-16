const mongoose = require("mongoose");
/*
{
        Id: 1,
        Name: "The Avengers",
        Image: "theavengers.jpg",
        Description:
          "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
        ReleaseDate: new Date(2012, 5, 4),
        Director: "Joss Whedon",
        Stars: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
        Genre: "Action, Adventure, Sci-Fi",
        Rating: 4,
      },
*/
const Movie = mongoose.model("Movie", {
  Name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Image: {
    type: String,
  },
  ReleaseDate: {
    type: Date,
    required: true,
  },
  Director: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Stars: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Genre: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  Rating: {
    type: Number,
    default: 0,
  },
  Trending: {
    type: Boolean,
    default: false,
  },
  Likes: {
    type: Number,
    default: 0,
  },
});

module.exports = { Movie };
