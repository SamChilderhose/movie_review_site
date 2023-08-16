import React, { Component } from "react";
import "./styles.css";
import SideDetailsCard from "./sideDetailsCard";
import ReviewsDisplay from "./reviewsDisplay";
import ProfileSideDisplay from "./profileSideDisplay";
import SeeMoreModal from "./seeMoreModal";
import axios from "axios";

class UserProfile extends Component {
  /* All of the userProfile and Movie Review info would be pulled from the webserver*/
  state = {
    profileEdits: {
      name: "",
      favouriteMovie: "",
      favouriteGenre: "",
    },
    userId: this.props.match.params.id,
    loggedInUser: this.props.appState.state.currentUser,
    // currUser: {
    //   Username: "Phil",
    //   FavouriteMovie: null,
    //   FavouriteGenre: null, 
    //   IsAdmin: true,
    //   Followers: [],
    //   Following: [],
    //   ReviewedMovies: [],
    //   LikedMovies: [],
    //   LikedReviews: [],
    //   Image: "",
    //   Name: null,
    //   Passwork: "",
    // },
    showEditProfile: false,
    userProfile: {
      name: "",
      profileIcon: "",
      favouriteMovie: "",
      favouriteGenre: "",
      isAdmin: false,
      moviesWatched: 0,
      numberOfReviews: 0,
      userId: "",
      notifications: [],
      followers: [
      ],
      following: [],
      recommendedReviewers: [],
    },
    userReviews: [],
  };

  componentDidMount() {
    console.log("Firing componentDidMount")
    this.props.appState.getUpdatedCurrentUser();
    this.setState({
      loggedInUser: this.props.appState.state.currentUser
    })

    let profileId = this.props.match.params.id;
    let items = this.state.userProfile
    let reviewsArr = []
    let allReviews = []
    let movieToAdd = {
        title: "",
        text: "",
        createdBy: "",
        createdAt: new Date(2020, 6, 3),
        image: "phil_dunphy.jpg",
        liked: false,
        numLikes: 0,
        rating: 1,
        movieId: 1,
        moviePoster: "theavengers.jpg",
    }
    axios
      .get("/api/users/" + profileId)
      .then((res) => {
        items.name = res.data.Username
        items.userId = profileId
        items.profileIcon = res.data.Image
        items.favouriteMovie = res.data.FavouriteMovie
        items.favouriteGenre = res.data.FavouriteGenre
        items.followers = res.data.Followers
        items.following = res.data.Following
        items.isAdmin = res.data.IsAdmin
        items.numberOfReviews = res.data.ReviewedMovies.length
        movieToAdd.createdBy = res.data.Username

        for (let i = 0; i < res.data.ReviewedMovies.length; i++) {
        
        reviewsArr.push({
          title: movieToAdd.title,
          text: movieToAdd.text,
          createdBy: movieToAdd.createdBy,
          createdAt: movieToAdd.createdAt,
          image: movieToAdd.image,
          liked: movieToAdd.liked,
          numLikes: movieToAdd.numLikes,
          rating: movieToAdd.rating,
          movieId:  res.data.ReviewedMovies[i],
          moviePoster: movieToAdd.moviePoster,
        })
        // let moviePosterToGet = res.data.ReviewedMovies[i].Movie
         axios
          .get("/api/reviews/" + res.data.ReviewedMovies[i])
          .then((res) => {
            console.log("Inside Movie")
            allReviews = res.data.filter( function(review) { return review.CreatedBy == profileId} )
            reviewsArr[i].title = allReviews[0].Title
            reviewsArr[i].text = allReviews[0].Text
            reviewsArr[i].numLikes = allReviews[0].NumberOfLikes
            reviewsArr[i].createdAt = new Date(allReviews[0].CreatedAt)
            reviewsArr[i].rating = Math.round(allReviews[0].Rating)
            
            axios
              .get("/api/movies/" + allReviews[0].Movie)
              .then((res) => {
                console.log("Inside Move thing")
                reviewsArr[i].moviePoster = res.data.Image

                this.setState({
                  userReviews: reviewsArr
                })

              })
              .catch((error) => {
                console.error("error", error);
              });


          })
          .catch((error) => {
            console.error("error", error);
          });

      }


        this.setState({
          currentProfileImage: res.data,
          userProfile: items,
        });
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  render() {
    return (
      <div>
        <div className="profileSideBarContainer">
          {/*Profile Info */}
          <ProfileSideDisplay
            appState={this.props.appState}
            userProfile={this.state.userProfile}
            profileEdits={this.state.profileEdits}
            userId={this.state.userId}
            loggedInUser={this.state.loggedInUser}
          />

          {/* Following/Followers */}
          <div className="followSideBarContainer">
            <h2 className="centerText"> Following </h2>

            <div>
              <SideDetailsCard
                list={this.state.userProfile.following}
                showAll={false}
              />
              <SeeMoreModal
                list={this.state.userProfile.following}
                modalName={"Following"}
              />
            </div>
          </div>

          <div className="followSideBarContainer">
            <h2 className="centerText"> Followers </h2>

            <div>
              <SideDetailsCard
                list={this.state.userProfile.followers}
                showAll={false}
              />
              <SeeMoreModal
                list={this.state.userProfile.followers}
                modalName={"Followers"}
              />
            </div>
          </div>

          {/* Recommended Reviewers */}
          
        </div>

        <br />
        <br />
        <br />
        <div className="recentReviewsContainer">
          <ReviewsDisplay
            currUser={this.state.userProfile}
            userReviews={this.state.userReviews}
            userId={this.state.userId}
            loggedInUser={this.state.loggedInUser}
          />
        </div>
      </div>
    );
  }
}

export default UserProfile;
