// User routes
const log = console.log;

// express
const express = require("express");
const router = express.Router(); // Express Router

// to validate object IDs
const { ObjectID } = require("mongodb");

// import the ticket mongoose model
const { Ticket } = require("../models/ticket");

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

/*** User API routes ****************/

// Set up a POST route to create a ticket of your web app
router.post("/api/ticket", mongoChecker, async (req, res) => {
  // Create a new ticket
  const ticket = new Ticket({
    Title: req.body.title,
    Author: req.body.author,
    Content: req.body.content,
    Status: "ongoing",
    Posttime: req.body.posttime,
  });

  try {
    // Save the user
    const newTicket = await ticket.save();
    res.send(newTicket);
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request"); // bad request for changing the student.
    }
  }
});


// a GET route to get all tickets
router.get("/api/alltickets", mongoChecker, async (req, res) => {
  // Get the users
  try {
    const tickets = await Ticket.find();
    // res.send(users) // just the array
    res.send({ tickets }); // can wrap users in object if want to add more properties
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// a GET route to get all ongoing tickets
router.get("/api/ongoingtickets", mongoChecker, async (req, res) => {
  // Get the tickets who have status ongoing
  try {
    const tickets = await Ticket.find({Status : "ongoing"});
    // res.send(users) // just the array
    res.send( tickets ); // can wrap users in object if want to add more properties
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// a PATCH route to update one ticket's status to solved given author and time
router.patch("/api/ticket/:id", mongoChecker, async (req, res) => {
  
  const id =  req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: id },
      { $set: { Status: "solved" }},
      {new: true, useFindAndModify: false});
    if (!ticket) {
      res.status(404).send("Resource not found"); // could not find this user
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({user})
      res.send(ticket);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});


// export the router
module.exports = router;
