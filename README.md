# Movie Review Site

https://dry-hamlet-56958.herokuapp.com/

# Quick Movie Reviews

This is a website where users can read and write quick movie reviews. Reviews cannot exceed the length of 180 characters.
Users can follow their favourite reviewers and also message friends.

Admins can add and edit movies, edit the trending movie list on the home page, and review tickets that users create.

# Features:

Search: search through movies and users

Movie: view reviews and add a review (Admins can delete any review)

Messages: view and create messages (can view when signed in)

Profile: view recent reviews, view and edit account details, add a ticket (can view when signed in)

Admin

AdminDashboard: view tickets, add/edit movies, edit trending movie list

User Credentials:

username: user
password: user

username: user2
password: user2


Admin Credentials:

username: admin
password: admin


# Overview of Routes
USER ROUTES

get("/api/users/admin/auth")
Checks if session user is an admin. Sends 401 if not authorized or 400 if session user does not exist

.get("/api/users")
Get all users

get("/api/users/login")
Check if user is logged in. Sends user if true, otherwise null

get("/api/users/logout")
Logs out user

get("/api/users/:id")
Expects an id. Returns a user

get("/api/users/:id/following")
Expects an id. Returns a list of users that the user follows. This is used for the friends dropdown in messages

get("/api/users/:username/:password")
Expects a username and password. Sends the user with this username and password if it exists, and the appropriate code otherwise.

post("/api/users")
Creates a user. Returns the user
Expects:
{
    Username: req.body.Username,
    Password: req.body.Password,
    FavouriteMovie: req.body.FavouriteMovie,
    FavouriteGenre: req.body.FavouriteGenre,
    IsAdmin: req.body.IsAdmin,
}

put("/api/users/:id")
Updates user. Expects an id and a user json. Returns updated user

post("/api/users/login")
Logs in and creates a session. Sends user object

patch("/api/users/:id")
Updates the changes to the user made from their profile page. Sends user
Expects:
{
    FavouriteMovie = req.body.favouriteMovie
    FavouriteGenre = req.body.favouriteGenre
    Username = req.body.name
    Followers = req.body.followers
    Following = req.body.following
    Image = req.body.profileIcon
}


MOVIE ROUTES

get("/api/movies")
Gets all movies

get("/api/movies/:id")
Expects an id. Returns one movie with that id

post("/api/movies")
Creates a movie. Expects:
{
    Name: req.body.Name,
    Description: req.body.Description,
    Image: req.body.Image,
    ReleaseDate: req.body.ReleaseDate,
    Director: req.body.Director,
    Stars: req.body.Stars,
    Genre: req.body.Genre,
    Rating: req.body.Rating,
    Trending: req.body.Trending,
}

patch("/api/movies/:id")
Updates a movie's major information fields: Name, Image, Description, ReleaseDate, Director, Stars, Genre. Expects:
{
    Name: req.body.Name,
    Description: req.body.Description,
    Image: req.body.Image,
    ReleaseDate: req.body.ReleaseDate,
    Director: req.body.Director,
    Stars: req.body.Stars,
    Genre: req.body.Genre,
}

patch("/api/movienotrend/:id")
Updates a movie's Trending field to false.

patch("/api/movietrend/:id")
Updates a movie's Trending field to true.


IMAGE ROUTES

get("/api/images/:id")
Gets one movie with that id

post("/api/images")
Creates an image. Expects a file

get("/api/images")
Gets all images

delete("/api/images/:imageId")
Deletes an image. Expects an id


REVIEW ROUTES

get("/api/reviews")
Gets all reviews

get("/api/reviews/:movieId")
Gets all reviews for movie with id movieId

get("/api/reviews/latest/:numberOfReviews")
Returns the latest numberOfReviews reviews. Expects a number in the route

get("/api/reviews/latest/user/:userId")
Gets the latest review for user with id userId

post("/api/reviews")
Creates a review. Updates ReviewedMovies field for the user who created it. Sends the new review. Expects:
{
    Movie: req.body.Movie,
    Title: req.body.Title,
    Text: req.body.Text,
    Rating: req.body.Rating,
    NumberOfLikes: req.body.NumberOfLikes,
    CreatedBy: req.body.CreatedBy,
    CreatedAt: req.body.CreatedAt,
}

delete("/api/reviews/:id")
Deletes a review. Expects id. Sends deleted review

put("/api/reviews/:review_id/:user_id")
Updates the likes on the review. It also updates the LikedReviews field for user. Expects {liked: bool} to know whether to increase like or remove like


CONVERSATION ROUTES

get("/api/conversations/:conversationId")
Gets one conversation

get("/api/conversations/user/:userId")
Gets all conversations for user

post("/api/conversations")
Creates a new conversation. Expects: { Users: req.body.Users, }. Users is a list of two users involved in the conversation

post("/api/conversations/:conversationId")
Adds a message to a converasation with id conversationID. Expects {Text: req.body.Text, CreatedBy: req.body.CreatedBy}


TICKETS ROUTES

post("/api/ticket")
Creates a issue ticket. Expects:
{
    Title: req.body.title,
    Author: req.body.author,
    Content: req.body.content,
    Status: "ongoing",
    Posttime: req.body.posttime,
}

get("/api/alltickets")
Gets all tickets

get("/api/ongoingtickets")
Gets all tickets whose status is "ongoing"

patch("/api/ticket/:id")
Updates a ticket's status to "solved", will find the required ticket by id.
