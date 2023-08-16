// User routes
const log = console.log;

// express
const express = require("express");
const router = express.Router(); // Express Router

// to validate object IDs
const { ObjectID } = require("mongodb");

// import the user mongoose model
const { User } = require("../models/user");

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate, sessionChecker } = require("./helpers/authentication");

/*** User API routes ****************/

// a GET route to determine if user is an admin (authorized)
router.get("/api/users/admin/auth", (req, res) => {
  if (!req.session.user) {
    res.status(400).send("user is not logged in");
  } else if (req.session.user.IsAdmin) {
    res.status(200).send("user authorized");
  } else {
    res.status(401).send("unauthorized");
  }
});

// a GET route to get all users
router.get("/api/users", mongoChecker, async (req, res) => {
  // Get the users
  try {
    const users = await User.find();
    // res.send(users) // just the array
    res.send({ users }); // can wrap users in object if want to add more properties
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// a route to check if user is logged in
router.get("/api/users/login", mongoChecker, async (req, res) => {
  if (req.session.user) {
    const user = await User.findOne({ _id: req.session.user._id });
    res.send(user);
  } else {
    res.send(null);
  }
});

// A route to logout a user
router.get("/api/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send("logged out");
    }
  });
});

// a GET route to get user by id
router.get("/api/users/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send("Resource not found"); // could not find this user
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({user})
      res.send(user);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a GET route to get user by id
router.get("/api/users/:id/following", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    let followers = [];
    const user = await User.findOne({ _id: id });
    for (const u of user.Following) {
      const follower = await User.findOne({ _id: u.userId });
      followers.push(follower);
    }
    if (!user) {
      res.status(404).send("Resource not found"); // could not find this user
    } else {
      res.send(followers);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a GET route to get user by username and (hashed) password
router.get("/api/users/:username/:password", mongoChecker, async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;

  // log(username, password)

  try {
    const user = await User.findByUsernamePassword(username, password);
    res.send(user);
  } catch (error) {
    log(error);
    res.status(401).send("Wrong Username or Password");
  }
});

// Set up a POST route to create a user of your web app
router.post("/api/users", mongoChecker, async (req, res) => {
  // log(req.body)

  // Create a new user
  const user = new User({
    Username: req.body.Username,
    Password: req.body.Password,
    FavouriteMovie: req.body.FavouriteMovie,
    FavouriteGenre: req.body.FavouriteGenre,
    IsAdmin: req.body.IsAdmin,
    Followers: [],
    Following: [],
    ReviewedMovies: [],
    LikedMovies: [],
    LikedReviews: [],
    Image: null,
  });

  try {
    // Save the user
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the user.
    }
  }
});

router.put("/api/users/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send("Resource not found");
    return; // so that we don't run the rest of the handler.
  }

  // Replace the user by their id using req.body
  try {
    const user = await User.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    log(error); // log server error to the console, not to the client.
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      res.status(400).send("Bad Request"); // bad request for changing the user.
    }
  }
});

//Updates the user attributes
router.patch("/api/users/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send("Resource not found");
    return;
  }

  try {
    let user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).send("Resource not found"); // could not find this user
    } else {
      user.FavouriteMovie = req.body.favouriteMovie;
      user.FavouriteGenre = req.body.favouriteGenre;
      user.Username = req.body.name;
      user.Followers = req.body.followers;
      user.Following = req.body.following;
      user.Image = req.body.profileIcon;
      user.save();
      res.send(user);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// A route to login and create a session
router.post("/api/users/login", mongoChecker, async (req, res) => {
  const username = req.body.Username;
  const password = req.body.Password;

  try {
    // Use the static method on the User model to find a user
    // by their email and password.
    const user = await User.findByUsernamePassword(username, password);
    if (!user) {
      res.status(400).send("Bad Request");
    } else {
      // Add the user's id and username to the session.
      // We can check later if the session exists to ensure we are logged in.
      req.session.user = user;
      res.send(user);
    }
  } catch (error) {
    // redirect to login if can't login for any reason
    if (isMongoError(error)) {
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request");
    }
  }
});

// export the router
module.exports = router;
