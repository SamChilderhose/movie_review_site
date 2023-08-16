// Review routes
const log = console.log;

// express
const express = require("express");
const router = express.Router(); // Express Router

// to validate object IDs
const { ObjectID } = require("mongodb");

// import the review mongoose model
const { Review } = require("../models/review");
const { User } = require("../models/user");
const { Movie } = require("../models/movie");

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

/*** Review API routes ****************/
// a GET route to get all reviews
router.get("/api/reviews", mongoChecker, async (req, res) => {
  // Get the reviews
  try {
    const reviews = await Review.find();
    res.send({ reviews });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// a GET route to get reviews by movie id
router.get("/api/reviews/:movieId", mongoChecker, async (req, res) => {
  const movieId = req.params.movieId;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(movieId)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const reviews = await Review.find({ Movie: movieId });
    if (!reviews) {
      res.status(404).send("Resource not found"); // could not find reviews
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({reviews})
      res.send(reviews);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a GET route to get the latest numberOfReviews reviews
router.get(
  "/api/reviews/latest/:numberOfReviews",
  mongoChecker,
  async (req, res) => {
    const numberOfReviews = req.params.numberOfReviews;

    try {
      const reviews = await Review.find();
      // Sort array by CreatedAt date
      reviews.sort((a, b) => a.CreatedAt - b.CreatedAt);

      if (!reviews) {
        res.status(404).send("Resource not found"); // could not find reviews
      } else {
        // Send the number of reviews
        res.send(reviews.slice(0, numberOfReviews));
      }
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error"); // server error
    }
  }
);

// a GET route to get the latest review by user id
router.get(
  "/api/reviews/latest/user/:userId",
  mongoChecker,
  async (req, res) => {
    const userId = req.params.userId;

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(userId)) {
      res.status(404).send(); // if invalid id, definitely can't find resource, 404.
      return; // so that we don't run the rest of the handler.
    }

    // If id valid, findById
    try {
      const reviews = await Review.findOne({ CreatedBy: userId });

      if (!reviews) {
        res.status(404).send("Resource not found"); // could not find reviews
      } else {
        /// sometimes we might wrap returned object in another object:
        //res.send({reviews})
        res.send(reviews);
      }
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error"); // server error
    }
  }
);


// Set up a POST route to create a review of your web app
router.post("/api/reviews", mongoChecker, async (req, res) => {
  // log(req.body)

  // Create a new review
  const review = new Review({
    Movie: req.body.Movie,
    Title: req.body.Title,
    Text: req.body.Text,
    Rating: req.body.Rating,
    NumberOfLikes: req.body.NumberOfLikes,
    CreatedBy: req.body.CreatedBy,
    CreatedAt: req.body.CreatedAt,
  });

  // Update ReviewedMovies for user
  if (req.body.CreatedBy !== null) {
    let user = await User.find({ _id: req.body.CreatedBy });
    user = user[0]._doc;
    user.ReviewedMovies.push(req.body.Movie);
    const newUser = await User.findOneAndReplace({ _id: user._id }, user, {
      new: true,
    });
    if (!newUser) {
      res.status(404).send("Could not find user");
    }
  }

  try {
    // Save the review
    const newReview = await review.save();

    // Update Rating on Movie
    await updateMovieRating(req.body.Movie);

    res.send(newReview);
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

async function updateMovieRating(movieId) {
  // Get reviews of this movie and calculate Rating
  const reviews = await Review.find({ Movie: movieId });
  let rating = 0;
  if (reviews.length > 0) {
    rating =
      reviews.reduce(function (sum, value) {
        return sum + value.Rating;
      }, 0) / reviews.length;
  }

  // Find movie and about its Rating
  let movie = await Movie.findOne({ _id: movieId });
  movie = movie._doc;
  movie.Rating = rating;
  const newMovie = await Movie.findOneAndReplace({ _id: movieId }, movie, {
    new: true,
  });
}

// a DELETE route to delete review by id
router.delete("/api/reviews/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Validate id
  if (!ObjectID.isValid(id)) {
    res.status(404).send("Resource not found");
    return;
  }
  // Delete a review by their id
  try {
    const review = await Review.findOneAndRemove({ _id: id });
    // Update ReviewedMovies for user
    if (review.CreatedBy !== null) {
      let user = await User.find({ _id: review.CreatedBy });
      user = user[0]._doc;
      const updatedReviews = user.ReviewedMovies.filter(
        (m) => m != review.Movie
      );
      user.ReviewedMovies = updatedReviews;
      const newUser = await User.findOneAndReplace({ _id: user._id }, user, {
        new: true,
      });
      // Update the movie rating
      await updateMovieRating(review.Movie);

      if (!newUser) {
        res.status(404).send("Could not find user");
      }
    }

    if (!review) {
      res.status(404).send("Could not find review");
    } else {
      res.send(review);
    }
  } catch (error) {
    log(error);
    res.status(500).send(); // server error, could not delete.
  }
});

// a PUT route to update number of likes
// { liked: bool }
// If liked == true, the user liked the review, other user unliked  it
router.put(
  "/api/reviews/:review_id/:user_id",
  mongoChecker,
  async (req, res) => {
    const review_id = req.params.review_id;
    const user_id = req.params.user_id;

    // Validate ids
    if (!ObjectID.isValid(review_id) || !ObjectID.isValid(user_id)) {
      res.status(404).send("Resource not found");
      return;
    }
    try {
      // Find a review by their id and increase likes
      let review = await Review.find({ _id: review_id });
      review = review[0]._doc;
      if (req.body.liked) {
        review.NumberOfLikes += 1;
      } else {
        review.NumberOfLikes -= 1;
      }

      // Find user and add to their LikedReviews
      let user = await User.find({ _id: user_id });
      user = user[0]._doc;
      if (req.body.liked) {
        user.LikedReviews.push(review_id);
      } else {
        user.LikedReviews = user.LikedReviews.filter((rev) => rev != review_id);
      }

      // Find and replace review and user
      const newReview = await Review.findOneAndReplace(
        { _id: review_id },
        review,
        {
          new: true,
        }
      );

      if (!newReview) {
        res.status(404).send("Could not find review");
      }

      const newUser = await User.findOneAndReplace({ _id: user._id }, user, {
        new: true,
      });

      if (!newUser) {
        res.status(404).send("Could not find user");
      }
      res.send("review and user updated");
    } catch (error) {
      log(error);
      res.status(500).send(); // server error, could not delete.
    }
  }
);

// export the router
module.exports = router;
