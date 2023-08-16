/* User model */
"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/*
{
        Username: "user",
        Password: "user",
        Name: "Phil Dunphy",
        Image: "phil_dunphy.jpg",
        FavouriteMovie: "The Avengers",
        FavouriteGenre: "Action",
        NumberOfReviews: 10,
        ListOfNotifications: [],
        IsAdmin: false,
        Followers: [],
        Following: [],
        LatestReview: {
          MovieName: "The Avengers",
          Title: "Meh",
          Review: "They could have done better",
          ReviewDate: new Date(2020, 5, 7),
          Rating: 2,
        },
      },
*/
// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
    minlength: 4,
  },
  FavouriteMovie: {
    type: String,
    minlength: 1,
    trim: true,
    default: null,
  },
  FavouriteGenre: {
    type: String,
    minlength: 1,
    trim: true,
    default: null,
  },
  IsAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  Followers: {
    type: Array,
    default: [],
  },
  Following: {
    type: Array,
    default: [],
  },
  ReviewedMovies: {
    type: Array,
    default: [],
  },
  LikedMovies: {
    type: Array,
    default: [],
  },
  LikedReviews: {
    type: Array,
    default: [],
  },
  Image: {
    type: String,
    default: null,
  },
  Name: {
    type: String,
    minlength: 1,
    trim: true,
    default: null,
  },
});

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre("save", function (next) {
  const user = this; // binds this to User document instance

  // checks to ensure we don't hash password more than once
  if (user.isModified("Password")) {
    // generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.Password, salt, (err, hash) => {
        user.Password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByUsernamePassword = function (username, password) {
  const User = this; // binds this to the User model

  // First find the user by their username
  return User.findOne({ Username: username }).then((user) => {
    if (!user) {
      return Promise.reject(); // a rejected promise
    }
    // if the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.Password, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// make a model using the User schema
const User = mongoose.model("User", UserSchema);
module.exports = { User };
