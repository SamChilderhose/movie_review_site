// Review routes
const log = console.log;

// express
const express = require("express");
const router = express.Router(); // Express Router

// to validate object IDs
const { ObjectID } = require("mongodb");

// import the review mongoose model
const { Image } = require("../models/image");

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

require("dotenv").config();
// multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

// cloudinary: configure using credentials found on your Cloudinary Dashboard
// sign up for a free account here: https://cloudinary.com/users/register/free
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/*********************************************************/

// a GET route to get reviews by movie id
router.get("/api/images/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const img = await Image.findOne({ _id: id });
    if (!img) {
      res.status(404).send("Resource not found"); // could not find reviews
    } else {
      res.send(img);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a POST route to *create* an image
router.post("/api/images", multipartMiddleware, (req, res) => {
  // Use uploader.upload API to upload image to cloudinary server.
  console.log("req.files", req.files);
  cloudinary.uploader.upload(
    req.files.file.path, // req.files contains uploaded files
    function (result) {
      // Create a new image using the Image mongoose model
      var img = new Image({
        ImageId: result.public_id, // image id on cloudinary server
        ImageUrl: result.url, // image url on cloudinary server
        CreatedAt: new Date(),
      });

      // Save image to the database
      img.save().then(
        (saveRes) => {
          res.send(saveRes);
        },
        (error) => {
          res.status(400).send(error); // 400 for bad request
        }
      );
    }
  );
});

// a GET route to get all images
router.get("/api/images", (req, res) => {
  Image.find().then(
    (images) => {
      res.send({ images }); // can wrap in object if want to add more properties
    },
    (error) => {
      res.status(500).send(error); // server error
    }
  );
});

/// a DELETE route to remove an image by its id.
router.delete("/api/images/:imageId", (req, res) => {
  const imageId = req.params.imageId;

  // Delete an image by its id (NOT the database ID, but its id on the cloudinary server)
  // on the cloudinary server
  cloudinary.uploader.destroy(imageId, function (result) {
    // Delete the image from the database
    Image.findOneAndRemove({ image_id: imageId })
      .then((img) => {
        if (!img) {
          res.status(404).send();
        } else {
          res.send(img);
        }
      })
      .catch((error) => {
        res.status(500).send(); // server error, could not delete.
      });
  });
});
// export the router
module.exports = router;
