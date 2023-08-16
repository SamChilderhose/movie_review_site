"use strict";

const express = require("express");
const app = express();

const path = require("path");

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// import the mongoose models
const { User } = require("./models/user");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

/// Middleware for creating sessions and session cookies.
// A session is created on every request, but whether or not it is saved depends on the option flags provided.
app.use(
  session({
    secret: "our hardcoded secret", // later we will define the session secret as an environment variable for production. for now, we'll just hardcode it.
    cookie: {
      // the session cookie sent, containing the session id.
      expires: 86400000, // 24 hour expiry
      httpOnly: true, // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
    },

    // Session saving options
    saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
    resave: false, // don't resave an session that hasn't been modified.
  })
);

/** Import the various routes **/
// User and login routes
app.use(require("./routes/users"));
app.use(require("./routes/movies"));
app.use(require("./routes/reviews"));
app.use(require("./routes/images"));
app.use(require("./routes/conversations"));
app.use(require("./routes/tickets"));

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  const goodPageRoutes = [
    "/",
    "/search",
    "/userprofile",
    "/messages",
    "/adminDashboard",
    "/AddMovie",
    "/EditMovie",
    "/EditTrending",
    "/addTicket",
  ];
  if (!goodPageRoutes.includes(req.url)) {
    // if url not in expected page routes, set status to 404.
    res.status(404);
  }

  // send index.html
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
