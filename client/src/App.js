import React from "react";

import { Route, Switch, BrowserRouter } from "react-router-dom";
import "./App.css";

import Home from "./react-components/Home";
import Search from "./react-components/Search";
import Movie from "./react-components/Movie";
import UserProfile from "./react-components/UserProfile";
import Navbar from "./react-components/Navbar";
// import Message from "./react-components/Message";
import Messages from "./react-components/Messages";
import AdminDashboard from "./react-components/AdminDashboard";
import AddMovie from "./react-components/AddMovie";
import EditMovie from "./react-components/EditMovie";
import AddTicket from "./react-components/AddTicket";
import EditTrending from "./react-components/EditTrending";
import SignOutPage from "./react-components/SignOutPage";
import Footer from "./react-components/Footer";
import { Alert } from "@material-ui/lab";
import { Snackbar, Backdrop, CircularProgress } from "@material-ui/core";
import axios from "axios";

class App extends React.Component {
  state = {
    loading: false,
    openSnackbarMessage: false,
    snackbarMessage: "",
    snackbarSeverity: "",
    currentUser: null,
    currentUserImage: null,
    movies: [],
    latestReviews: [],
    //   {
    //     Id: 1,
    //     Name: "The Avengers",
    //     Image: "theavengers.jpg",
    //     Description:
    //       "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    //     ReleaseDate: new Date(2012, 5, 4),
    //     Director: "Joss Whedon",
    //     Stars: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
    //     Genre: "Action, Adventure, Sci-Fi",
    //     Rating: 4,
    //   },
    //   {
    //     Id: 2,
    //     Name: "Avengers: Age of Ultron",
    //     Image: "avengers-age-of-ultron.jpeg",
    //     Description:
    //       "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.",
    //     ReleaseDate: new Date(2015, 5, 1),
    //     Director: "Joss Whedon",
    //     Stars: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
    //     Genre: "Action, Adventure, Sci-Fi",
    //     Rating: 3.5,
    //   },
    //   {
    //     Id: 3,
    //     Name: "Avengers: Infinity War",
    //     Image: "avengers-infinity-war.jpg",
    //     Description:
    //       "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
    //     ReleaseDate: new Date(2018, 4, 27),
    //     Director: "Anthony Russo, Joe Russo",
    //     Stars: "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo",
    //     Genre: "Action, Adventure, Sci-Fi",
    //     Rating: 4,
    //   },
    //   {
    //     Id: 4,
    //     Name: "Avengers: Endgame",
    //     Image: "avengers-endgame.jpg",
    //     Description:
    //       "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    //     ReleaseDate: new Date(2019, 4, 26),
    //     Director: "Anthony Russo, Joe Russo",
    //     Stars: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
    //     Genre: "Action, Adventure, Sci-Fi",
    //     Rating: 4,
    //   },
    //   {
    //     Id: 5,
    //     Name: "Iron Man",
    //     Image: "iron-man.jpg",
    //     Description:
    //       "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    //     ReleaseDate: new Date(2008, 5, 2),
    //     Director: "Jon Favreau",
    //     Stars: "Robert Downey Jr., Gwyneth Paltrow, Terrence Howard",
    //     Genre: "Action, Adventure, Sci-Fi",
    //     Rating: 4,
    //   },
    //   {
    //     Id: 6,
    //     Name: "Iron Man 2",
    //     Image: "iron-man-2.jpg",
    //     Description:
    //       "With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man with ties to his father's legacy.",
    //     ReleaseDate: new Date(2010, 5, 7),
    //     Director: "Jon Favreau",
    //     Stars: "Robert Downey Jr., Mickey Rourke, Gwyneth Paltrow",
    //     Genre: "Action, Adventure, Sci-Fi",
    //     Rating: 3.5,
    //   },
    //   {
    //     Id: 7,
    //     Name: "Iron Man 3",
    //     Image: "iron-man-3.jpg",
    //     Description:
    //       "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    //     ReleaseDate: new Date(2008, 5, 2),
    //     Director: "Jon Favreau",
    //     Rating: 3,
    //   },
    // ],
    friends: [
      {
        Name: "Phil Dunphy",
        Image: "phil_dunphy.jpg",
      },
      {
        Name: "Claire Dunphy",
        Image: "claire_dunphy.jpg",
      },
    ],
    users: [
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
      {
        Username: "user2",
        Password: "user2",
        Name: "Claire Dunphy",
        Image: "claire_dunphy.jpg",
        FavouriteMovie: "The Avengers",
        FavouriteGenre: "Action",
        NumberOfReviews: 10,
        ListOfNotifications: [],
        IsAdmin: false,
        Followers: [],
        Following: [],
        LatestReview: {
          MovieName: "Iron Man",
          Title: "Hated it",
          Review: "I hated it",
          ReviewDate: new Date(2020, 5, 7),
          Rating: 1,
        },
      },
      {
        Username: "user3",
        Password: "user3",
        Name: "John Smith",
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
          Title: "Loved it",
          Review: "I loved it",
          ReviewDate: new Date(2020, 5, 7),
          Rating: 4.5,
        },
      },
      {
        Username: "user4",
        Password: "user4",
        Name: "Jane Doe",
        Image: "claire_dunphy.jpg",
        FavouriteMovie: "The Avengers",
        FavouriteGenre: "Action",
        NumberOfReviews: 10,
        ListOfNotifications: [],
        IsAdmin: false,
        Followers: [],
        Following: [],
        LatestReview: {
          MovieName: "Avengers: Endgame",
          Title: "Great!",
          Review: "Truly a great movie",
          ReviewDate: new Date(2020, 5, 7),
          Rating: 4.5,
        },
      },
      {
        Username: "admin",
        Password: "admin",
        Name: "Tony Stark",
        Image: "phil_dunphy.jpg",
        FavouriteMovie: "The Avengers",
        FavouriteGenre: "Action",
        NumberOfReviews: 10,
        ListOfNotifications: [],
        IsAdmin: true,
        Followers: [],
        Following: [],
        LatestReview: {
          MovieName: "Iron Man 2",
          Title: "It was okay",
          Review: "It was alright I guess",
          ReviewDate: new Date(2020, 5, 7),
          Rating: 3,
        },
      },
    ],
    trendings: [
      //   {
      //     Id: 1,
      //     Name: "The Avengers",
      //     Image: "theavengers.jpg",
      //     Description:
      //       "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
      //     ReleaseDate: new Date(2012, 5, 4),
      //     Director: "Joss Whedon",
      //     Stars: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
      //     Genre: "Action, Adventure, Sci-Fi",
      //     Rating: 4,
      //   },
      //   {
      //     Id: 2,
      //     Name: "Avengers: Age of Ultron",
      //     Image: "avengers-age-of-ultron.jpeg",
      //     Description:
      //       "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong and it's up to Earth's mightiest heroes to stop the villainous Ultron from enacting his terrible plan.",
      //     ReleaseDate: new Date(2015, 5, 1),
      //     Director: "Joss Whedon",
      //     Stars: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
      //     Genre: "Action, Adventure, Sci-Fi",
      //     Rating: 3.5,
      //   },
      //   {
      //     Id: 3,
      //     Name: "Avengers: Infinity War",
      //     Image: "avengers-infinity-war.jpg",
      //     Description:
      //       "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
      //     ReleaseDate: new Date(2018, 4, 27),
      //     Director: "Anthony Russo, Joe Russo",
      //     Stars: "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo",
      //     Genre: "Action, Adventure, Sci-Fi",
      //     Rating: 4,
      //   },
      //   {
      //     Id: 4,
      //     Name: "Avengers: Endgame",
      //     Image: "avengers-endgame.jpg",
      //     Description:
      //       "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      //     ReleaseDate: new Date(2019, 4, 26),
      //     Director: "Anthony Russo, Joe Russo",
      //     Stars: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
      //     Genre: "Action, Adventure, Sci-Fi",
      //     Rating: 4,
      //   },
      //   {
      //     Id: 5,
      //     Name: "Iron Man",
      //     Image: "iron-man.jpg",
      //     Description:
      //       "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
      //     ReleaseDate: new Date(2008, 5, 2),
      //     Director: "Jon Favreau",
      //     Stars: "Robert Downey Jr., Gwyneth Paltrow, Terrence Howard",
      //     Genre: "Action, Adventure, Sci-Fi",
      //     Rating: 4,
      //   },
    ],
  };

  componentDidMount() {
    // Get all movies
    axios
      .get("/api/movies")
      .then((res) => {
        // console.log(res.data);
        this.setState({
          movies: res.data.movies,
          trendings: this.generateTrendings(res.data.movies),
        });
      })
      .catch((error) => {
        console.error("error", error);
      });

    // Check to see if user is still logged in
    axios
      .get("/api/users/login")
      .then((res) => {
        // console.log("logged in?", res.data);
        if (res.data !== "") {
          // Yes they are still logged in
          this.setState({
            currentUser: res.data,
          });
          // Get user image
          this.getUserImage();
        }
      })
      .catch((error) => {
        console.error("error", error);
      });

    // get all users
    axios
      .get("/api/users")
      .then((res) => {
        // console.log(res.data);
        this.setState({
          users: res.data.users,
        });
      })
      .catch((error) => {
        console.error("error", error);
      });

    // Get latest reviews for home page
    this.getLatestReviews();
  }

  getLatestReviews = () => {
    axios
      .get("/api/reviews/latest/6")
      .then((res) => {
        // console.log(res.data);
        this.setState({
          latestReviews: res.data,
        });
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  // getUserImage = () => {
  //   if (
  //     this.state.currentUser !== null &&
  //     this.state.currentUser.Image !== null
  //   ) {
  //     axios
  //       .get("/api/images/" + this.state.currentUser.Image)
  //       .then((res) => {
  //         // console.log(res.data);
  //         this.setState({
  //           currentUserImage: res.data.ImageUrl,
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("error", error);
  //       });
  //   } else {
  //     // Otherwise display default avatar
  //     this.setState({
  //       currentUserImage: require(`./images/avatar.png`).default,
  //     });
  //   }
  // };

  getUpdatedCurrentUser = () => {
    if (this.state.currentUser !== null) {
      axios
        .get("/api/users/" + this.state.currentUser._id)
        .then((res) => {
          // console.log("updated user", res.data);
          this.setState({
            currentUser: res.data,
          });
        })
        .catch((error) => {
          console.error("error", error);
        });
    }
  };

  handleSearch = (searchInput) => {
    let newMovieList = this.state.movies.filter((movie) =>
      movie.Name.toLowerCase().includes(searchInput)
    );
    return newMovieList;
  };

  generateTrendings = (movieList) => {
    const trendingMovies = [];
    movieList.forEach((movie) => {
      if (movie.Trending) {
        trendingMovies.push(movie);
      }
    });

    return trendingMovies;
  };

  handleLikeButtonClick = (
    review,
    reviewComponent,
    userLiked,
    homeComponent = null
  ) => {
    // Update review and user in db
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Review Updated</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Review was not updated</p>
      </div>
    );
    this.setState({ loading: true }, () => {
      axios
        .put("/api/reviews/" + review._id + "/" + this.state.currentUser._id, {
          liked: userLiked,
        })
        .then((res) => {
          // console.log("like button res.data", res.data);
          this.getUpdatedCurrentUser();
          this.componentDidMount();
          if (homeComponent !== null) {
            homeComponent.componentDidMount();
          }
          reviewComponent.setState({
            liked: userLiked,
          });
          // reviewComponent.loadData();

          this.setState({
            loading: false,
          });

          // Open success message
          this.handleOpenSnackbarMessage("success", successMessage);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
          });
          this.handleOpenSnackbarMessage("error", errorMessage);
        });
    });
  };

  handleDeleteButtonClick = (review) => {
    // Remove review from db
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Review Deleted</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Review was not deleted</p>
      </div>
    );
    this.setState({ loading: true }, () => {
      axios
        .delete("/api/reviews/" + review._id, review)
        .then((res) => {
          // console.log("res.data", res.data);

          this.setState({
            loading: false,
          });
          this.getUpdatedCurrentUser();
          // Open success message
          this.handleOpenSnackbarMessage("success", successMessage);

          this.componentDidMount();
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
          });
          this.handleOpenSnackbarMessage("error", errorMessage);
        });
    });
  };

  // --------------- Feedback messages ---------------
  handleOpenSnackbarMessage = (severity, message) => {
    this.setState({
      snackbarSeverity: severity,
      snackbarMessage: message,
      openSnackbarMessage: true,
    });
  };

  handleCloseSnackbarMessage = () => {
    this.setState({
      openSnackbarMessage: false,
    });
  };

  // getOneMovie = (id) => {
  //   // let newMovieList = this.state.movies.filter((movie) => movie._id === id);
  //   // return newMovieList[0];
  //   axios
  //     .get("/api/movies/" + id)
  //     .then((res) => {
  //       // console.log(res.data);
  //       this.setState(
  //         {
  //           movies: res.data.movies,
  //         },
  //         function () {
  //           console.log(this.state.movies);
  //         }
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("error", error);
  //     });
  // };

  render() {
    return (
      <div>
        <Backdrop open={this.state.loading} style={{ zIndex: "1500" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <BrowserRouter>
          <Switch>
            {" "}
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <Home
                    // movies={this.state.movies}
                    // users={this.state.users}
                    // currentUser={this.state.currentUser}
                    state={this.state}
                    appState={this}
                    parentCallback={(user) => {
                      this.setState({ currentUser: user });
                      // console.log(this.state.currentUser);
                    }}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/search"
              render={(props) => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <Search
                    appState={this}
                    movies={this.state.movies}
                    users={this.state.users}
                    {...props}
                  />
                </div>
              )}
            />
            <Route
              path="/movie/:id"
              render={(props) => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <Movie
                    {...props}
                    movies={this.state.movies}
                    appState={this}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/userprofile/:id"
              render={(props) => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <UserProfile 
                    {...props} 
                    loggedInUser={this.state.currentUser}
                    appState={this}
                   />
                </div>
              )}
            />
            <Route
              exact
              path="/messages"
              render={() => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <Messages
                    currentUser={this.state.currentUser}
                    friends={this.state.friends}
                    appState={this}
                  />
                </div>
              )}
            />
            <Route
              path="/adminDashboard"
              render={() => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <AdminDashboard appState={this}/>
                </div>
              )}
            />
            <Route
              path="/editMovie"
              render={() => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <EditMovie movies={this.state.movies} appState={this}/>
                </div>
              )}
            />
            <Route
              path="/addMovie"
              render={() => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <AddMovie appState={this}/>
                </div>
              )}
            />
            <Route
              path="/addTicket"
              render={(props) => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <AddTicket appState={this} currentUser={this.state.currentUser} />
                </div>
              )}
            />
            <Route
              path="/editTrending"
              render={(props) => (
                <div>
                  <Navbar
                    currentUser={this.state.currentUser}
                    appState={this}
                  />
                  <EditTrending
                    movies={this.state.movies}
                    trendingMovies={this.state.trendings}
                    UserProfile={this.state.users[4]}
                    appState={this}
                  />
                </div>
              )}
            />
            <Route
              path="/signout"
              render={() => (
                <SignOutPage
                  parentCallback={() => this.setState({ currentUser: null })}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
        <div>
          <Snackbar
            open={this.state.openSnackbarMessage}
            autoHideDuration={4000}
            onClose={this.handleCloseSnackbarMessage}
          >
            <Alert
              onClose={this.handleCloseSnackbarMessage}
              severity={this.state.snackbarSeverity}
            >
              {this.state.snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
