import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { DeleteOutline } from "@material-ui/icons";
import { Rating, ToggleButton } from "@material-ui/lab";
import "./styles.css";
import { toDateString } from "../../actions/app-actions";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Link } from "react-router-dom";
import axios from "axios";

class Review extends Component {
  state = {
    review: this.props.review,
    createdByUser: null,
    createdByUserImage: null,
    movie: null,
    // liked: false,
    liked:
      this.props.appState.state.currentUser !== null
        ? this.props.appState.state.currentUser.LikedReviews.includes(
            this.props.review._id
          )
        : false,
  };

  componentDidMount() {
    if (this.state.review.CreatedBy) {
      // Get User who created the review

      axios
        .get("/api/users/" + this.state.review.CreatedBy)
        .then((res) => {
          // console.log("createdByUser", res.data);
          this.setState({
            createdByUser: res.data,
          });

        })
        .catch((err) => {
          console.log("Could not retrieve user");
        });
    }

    // Get movie
    axios
      .get("/api/movies/" + this.state.review.Movie)
      .then((res) => {
        this.setState({
          movie: res.data,
        });
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  renderDeleteButton = () => {
    let isAdmin = false;
    if (this.props.appState.state.currentUser !== null) {
      isAdmin = this.props.appState.state.currentUser.IsAdmin;

      if (
        this.state.review.CreatedBy ===
          this.props.appState.state.currentUser._id ||
        isAdmin
      ) {
        return (
          <Button
            onClick={() =>
              this.props.handleDeleteButtonClick(this.props.review)
            }
            className="delete-button"
          >
            <DeleteOutline />
          </Button>
        );
      }
    }
  };

  renderUserProfile = () => {
    if (this.state.createdByUser !== null) {
      return (
        <Link to={`/userprofile/${this.state.review.CreatedBy}`}>
          <div className="image-container">
            <img
              className="profile-image"
              src={
                this.state.createdByUser.Image !== null
                  ? this.state.createdByUser.Image
                  : require(`../../images/avatar.png`).default
              }
              alt={this.state.createdByUser.Username}
            />
            <div className="created-by">
              {this.state.createdByUser.Username}
            </div>
            <div className="created-by">
              on {toDateString(new Date(this.state.review.CreatedAt))}
            </div>
          </div>
        </Link>
      );
    }

    return (
      <div className="image-container">
        <img
          className="profile-image"
          src={require(`../../images/avatar.png`).default}
          alt={this.state.review.CreatedBy}
        />
        <div className="created-by"> Anonymous </div>
        <div className="created-by">
          on {toDateString(new Date(this.state.review.CreatedAt))}
        </div>
      </div>
    );
  };

  loadData = () => {
    this.componentDidMount();
  };

  renderLikeButton = () => {
    if (this.props.appState.state.currentUser !== null) {
      return (
        <ToggleButton
          className="like-button"
          selected={this.userLikedMovie()}
          onChange={() => {
            this.props.handleLikeButtonClick(
              this.props.review,
              this,
              !this.userLikedMovie()
            );
          }}
        >
          <FavoriteIcon />
        </ToggleButton>
      );
    }
  };

  // Render movie title if used on homepage
  // Because if they are on the Movie page, they already see the title
  renderMovieTitle = () => {
    if (this.props.home && this.state.movie !== null) {
      return (
        <Link to={`/movie/${this.state.movie._id}`}>
          <div>{this.state.movie !== null ? this.state.movie.Name : ""}</div>
        </Link>
      );
    }
  };

  userLikedMovie = () => {
    if (this.props.appState.state.currentUser !== null) {
      return this.props.appState.state.currentUser.LikedReviews.includes(
        this.props.review._id
      );
    }
    return false;
  };

  render() {
    return (
      <div className="review-wrapper">
        <div className="review-buttons-container">
          {this.renderLikeButton()}
          {this.renderDeleteButton()}
        </div>
        <p className="number-of-likes">
          {this.state.review.NumberOfLikes} likes
        </p>
        <div className="review-container">
          {this.renderUserProfile()}
          <div className="review">
            {this.renderMovieTitle()}
            <Rating
              className="inline-block"
              defaultValue={this.state.review.Rating}
              precision={0.5}
              readOnly
            />
            <div className="review-title">{this.state.review.Title}</div>
            <div className="review-text">{this.state.review.Text}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Review;
