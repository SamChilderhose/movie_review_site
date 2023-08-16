// Movie routes
const log = console.log;
var request = require("request");
const axios = require("axios");
// express
const express = require("express");
const router = express.Router(); // Express Router

// to validate object IDs
const { ObjectID } = require("mongodb");

// import the user mongoose model
const { Movie } = require("../models/movie");

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

/*** Movie API routes ****************/
// a GET route to get all movies
router.get("/api/movies", mongoChecker, async (req, res) => {
  // Get the movies
  try {
    const movies = await Movie.find();
    res.send({ movies });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// a GET route to get movie by id
router.get("/api/movies/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const movie = await Movie.findOne({ _id: id });
    if (!movie) {
      res.status(404).send("Resource not found"); // could not find this movie
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({movie})
      res.send(movie);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// Set up a POST route to create a movie of your web app
router.post("/api/movies", mongoChecker, async (req, res) => {
  // Create a new movie
  const movie = new Movie({
    Name: req.body.Name,
    Description: req.body.Description,
    Image: req.body.Image,
    ReleaseDate: req.body.ReleaseDate,
    Director: req.body.Director,
    Stars: req.body.Stars,
    Genre: req.body.Genre,
    Rating: req.body.Rating,
    Trending: req.body.Trending,
    Likes: 0,
  });

  try {
    // Save the movie
    const newMovie = await movie.save();
    res.send(newMovie);
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

// Script for adding movies from omdbapi
router.get("/api/movies/script/:query", mongoChecker, async (req, res) => {
  const query = req.params.query;
  const url = "http://www.omdbapi.com/?apikey=9e3ccdf9&s=" + query;
  try {
    let movies = [];
    // Get list of movies with search query
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const jsonBody = JSON.parse(body);

        // Get details for every movie that was returned and add to db
        for (const m of jsonBody.Search) {
          request(
            "http://www.omdbapi.com/?apikey=9e3ccdf9&i=" + m.imdbID,
            function (error2, response2, body2) {
              if (!error2 && response2.statusCode == 200) {
                movies.push(body2);
                jsonMovie = JSON.parse(body2);
                console.log(jsonMovie);
                const newMovie = {
                  Name: jsonMovie.Title,
                  Description: jsonMovie.Plot,
                  Image: jsonMovie.Poster,
                  ReleaseDate: new Date(jsonMovie.Released),
                  Director: jsonMovie.Director,
                  Stars: jsonMovie.Actors,
                  Genre: jsonMovie.Genre,
                  Rating: 0,
                  Trending: false,
                };

                //Add movie to db
                axios
                  .post("http://localhost:5000/api/movies", newMovie)
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((error) => {
                    console.error("error", error);
                  });
              }
            }
          );
        }
        res.send("success");
      }
    });
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a PATCH route to update movie's major fields by id
router.patch("/api/movies/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    console.log("j=Idnotvalid")
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const movie = await Movie.findOneAndUpdate({ _id: id },
                                               {$set:{Name: req.body.Name, Image: req.body.Image, Description: req.body.Description, ReleaseDate: req.body.ReleaseDate,
                                                      Director: req.body.Director, Stars: req.body.Stars, Genre: req.body.Genre}}, 
                                               {new: true, useFindAndModify: false});
    if (!movie) {
      res.status(404).send("Resource not found"); // could not find this movie
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({movie})
      res.send(movie);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a PATCH route to update make a movie un-trending by id
router.patch("/api/movienotrend/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    console.log("Idnotvalid")
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const movie = await Movie.findOneAndUpdate({ _id: id },
                                               {$set:{Trending:false}}, 
                                               {new: true, useFindAndModify: false});
    if (!movie) {
      res.status(404).send("Resource not found"); // could not find this movie
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({movie})
      res.send(movie);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// a PATCH route to update make a movie trending by id
router.patch("/api/movietrend/:id", mongoChecker, async (req, res) => {
  const id = req.params.id;

  // Good practise: Validate id immediately.
  if (!ObjectID.isValid(id)) {
    console.log("Idnotvalid")
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  // If id valid, findById
  try {
    const movie = await Movie.findOneAndUpdate({ _id: id },
                                               {$set:{Trending:true}}, 
                                               {new: true, useFindAndModify: false});
    if (!movie) {
      res.status(404).send("Resource not found"); // could not find this movie
    } else {
      /// sometimes we might wrap returned object in another object:
      //res.send({movie})
      res.send(movie);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

// export the router
module.exports = router;
