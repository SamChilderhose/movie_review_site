// Conversation routes
const log = console.log;

// express
const express = require("express");
const router = express.Router(); // Express Router

// to validate object IDs
const { ObjectID } = require("mongodb");
const { Conversation } = require("../models/conversation");
const { Message } = require("../models/message");

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

/*** Conversation API routes ****************/
// a GET route to get one conversation
router.get(
  "/api/conversations/:conversationId",
  mongoChecker,
  async (req, res) => {
    const conversationId = req.params.conversationId;

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(conversationId)) {
      res.status(404).send(); // if invalid id, definitely can't find resource, 404.
      return; // so that we don't run the rest of the handler.
    }
    // Get the conversations
    try {
      const conversation = await Conversation.findOne({ _id: conversationId });
      res.send(conversation);
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// a GET route to get all conversations for user
router.get(
  "/api/conversations/user/:userId",
  mongoChecker,
  async (req, res) => {
    const userId = req.params.userId;

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(userId)) {
      res.status(404).send(); // if invalid id, definitely can't find resource, 404.
      return; // so that we don't run the rest of the handler.
    }
    // Get the conversations
    try {
      const conversations = await Conversation.find({ "Users._id": userId });
      res.send(conversations);
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Set up a POST route to create a conversation
router.post("/api/conversations", mongoChecker, async (req, res) => {
  // Create a new conversation
  const conversation = new Conversation({
    Users: req.body.Users,
    CreatedAt: new Date(),
  });

  try {
    // Save the conversation
    const newConversation = await conversation.save();
    res.send(newConversation);
  } catch (error) {
    if (isMongoError(error)) {
      // check for if mongo server suddenly disconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      log(error);
      res.status(400).send("Bad Request");
    }
  }
});

// Set up a POST route to add a message to a conversation
router.post(
  "/api/conversations/:conversationId",
  mongoChecker,
  async (req, res) => {
    const conversationId = req.params.conversationId;

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(conversationId)) {
      res.status(404).send(); // if invalid id, definitely can't find resource, 404.
      return; // so that we don't run the rest of the handler.
    }
    // Create a new message
    const message = new Message({
      Text: req.body.Text,
      CreatedBy: req.body.CreatedBy,
      CreatedAt: new Date(),
    });

    // Find the conversation to add the message to
    let conversation = await Conversation.findOne({ _id: conversationId });
    conversation = conversation._doc;
    conversation.Messages.push(message);

    try {
      // Save the message
      const newMessage = await message.save();
      // Save the conversation
      const newConversation = await Conversation.findOneAndReplace(
        { _id: conversationId },
        conversation,
        {
          new: true,
        }
      );
      if (!newConversation) {
        res.status(404).send("Could not find conversation");
      }
      res.send(newConversation);
    } catch (error) {
      if (isMongoError(error)) {
        // check for if mongo server suddenly disconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        log(error);
        res.status(400).send("Bad Request");
      }
    }
  }
);

// export the router
module.exports = router;
