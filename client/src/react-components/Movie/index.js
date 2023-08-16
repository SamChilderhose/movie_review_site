import React, { Component } from "react";
import {
  Button,
  Modal,
  TextField,
  Card,
  CardActions,
  CardContent,
} from "@material-ui/core";
import { Pagination, Rating } from "@material-ui/lab";
import Review from "../Review";
import { uid } from "react-uid";
import "./styles.css";
import { toDateString } from "../../actions/app-actions";
import axios from "axios";

class Movie extends Component {
  state = {
    openSuccessMessage: false,
    reviewSubmitted: false,
    reviewRatingInput: 0,
    addReviewModalOpen: false,
    reviewInput: "",
    reviewTitleInput: "",
    itemsPerPage: 5,
    page: 1,
    noOfPages: 0,
    // movie: null,
    movie: {
      Name: "The Avengers",
      Image: "theavengers.jpg",
      Description:
        "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
      ReleaseDate: new Date(2012, 5, 4),
      Director: "Joss Whedon",
      Stars: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
      Genre: "Action, Adventure, Sci-Fi",
      Rating: 4,
      NumberOfLikes: 100,
    },
    reviews: [],
  };

  componentDidMount() {
    this.props.appState.getUpdatedCurrentUser();
    let movieId = this.props.match.params.id;

    // Get movie by id
    axios
      .get("/api/movies/" + movieId)
      .then((res) => {
        // console.log("movie", res.data);
        this.setState({
          movie: res.data,
        });
      })
      .catch((error) => {
        console.error("error", error);
      });

    // Get the reviews for this movie
    axios
      .get("/api/reviews/" + movieId)
      .then((res) => {
        // console.log("reviews", res.data);
        this.setState({
          reviews: res.data,
          noOfPages: Math.ceil(res.data.length / this.state.itemsPerPage),
        });
      })
      .catch((err) => {
        console.log("Could not retrieve reviews");
      });
  }

  // Pagination
  handlePageChange = (event, value) => {
    this.setState({
      page: value,
    });
  };

  // If Like button clicked, change to Unlike button and viceversa
  handleLikeButtonClick = (review, reviewComponent, liked) => {
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
    this.props.appState.setState({ loading: true }, () => {
      axios
        .put(
          "/api/reviews/" +
            review._id +
            "/" +
            this.props.appState.state.currentUser._id,
          { liked: liked }
        )
        .then((res) => {
          console.log("res.data", res.data);

          this.props.appState.setState({
            loading: false,
          });

          // Open success message
          this.props.appState.handleOpenSnackbarMessage(
            "success",
            successMessage
          );
          this.props.appState.componentDidMount();
          this.componentDidMount();
        })
        .catch((err) => {
          console.log(err);
          this.props.appState.setState({
            loading: false,
          });
          this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        });
    });
  };

  // If Delete button clicked, remove it from review
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
    this.props.appState.setState({ loading: true }, () => {
      axios
        .delete("/api/reviews/" + review._id, review)
        .then((res) => {
          console.log("res.data", res.data);

          this.props.appState.setState({
            loading: false,
          });
          this.props.appState.getUpdatedCurrentUser();
          this.props.appState.getLatestReviews();
          // Open success message
          this.props.appState.handleOpenSnackbarMessage(
            "success",
            successMessage
          );
          this.setState({
            reviewSubmitted: false,
          });
          this.componentDidMount();
        })
        .catch((err) => {
          console.log(err);
          this.props.appState.setState({
            loading: false,
          });
          this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        });
    });
  };

  // ---- Functions for Add Review Modal ----
  // Open modal
  handleAddReviewOpen = () => {
    this.setState({
      addReviewModalOpen: true,
    });
  };

  // Close modal
  handleAddReviewClose = () => {
    this.setState({
      addReviewModalOpen: false,
      addReviewButtonClicked: false,
    });
  };

  // Handle on change
  onReviewInputChange = (event) => {
    let value = event.target.value;
    const name = event.target.name;
    if (name === "reviewRatingInput") {
      value = Number(value);
    }
    this.setState({
      [name]: value,
    });
  };

  // Helper text to show user length of review
  addReviewHelperText = () => {
    if (this.state.reviewInput.length > 180) {
      return (
        <div className="review-helper-text red">
          Max length of 180 characters
        </div>
      );
    }
    return (
      <div className="review-helper-text">
        {this.state.reviewInput.length}/180 characters
      </div>
    );
  };

  // Submit review
  handleReviewSubmitted = () => {
    this.handleAddReviewClose();
    const newReview = {
      Movie: this.state.movie._id,
      Title: this.state.reviewTitleInput,
      Text: this.state.reviewInput,
      Rating: this.state.reviewRatingInput,
      CreatedBy: this.props.appState.state.currentUser
        ? this.props.appState.state.currentUser._id
        : null,
      CreatedAt: new Date(),
    };

    // Add review to db
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Review Submitted</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Review was not added</p>
      </div>
    );

    this.props.appState.setState({ loading: true }, () => {
      axios
        .post("/api/reviews/", newReview)
        .then((res) => {
          console.log(res.data);
          this.componentDidMount();
          this.props.appState.handleOpenSnackbarMessage(
            "success",
            successMessage
          );
          this.props.appState.setState({
            loading: false,
          });
          this.props.appState.getLatestReviews();
          this.setState({
            reviewSubmitted: true,
          });
        })
        .catch((err) => {
          this.props.appState.setState({
            loading: false,
          });
          console.log(err);
          this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        });
    });
  };

  // Render Add Review Button for users who are signed in and who have not reviewed this movie
  // If current user has reviewd this move, show Review Added
  renderAddReviewButton = () => {
    // Only loggined in cusers can add a review
    if (this.props.appState.state.currentUser !== null) {
      // Check to see if current user has reviewed this movie already
      if (
        this.state.movie !== null &&
        (this.props.appState.state.currentUser.ReviewedMovies.includes(
          this.state.movie._id
        ) ||
          this.state.reviewSubmitted)
      ) {
        return (
          <Button
            className="review-submitted-button"
            variant="contained"
            disabled
          >
            Review Added
          </Button>
        );
      }

      return (
        <Button
          onClick={this.handleAddReviewOpen}
          className="add-review-button"
          variant="contained"
          color="primary"
        >
          Add Review
        </Button>
      );
    }
  };

  render() {
    return (
      <div className="movie-view-wrapper">
        <div className="float-right">{this.renderAddReviewButton()}</div>
        <div className="movie-information-container">
          <img
            className="movie-poster"
            src={this.state.movie.Image}
            alt={this.state.movie.Name}
          />
          <div className="movie-information">
            <Rating
              className="inline-block"
              value={this.state.movie.Rating}
              precision={0.5}
              readOnly
              size="large"
            />
            <h2>{this.state.movie.Name}</h2>
            <p className="inline-block">
              {toDateString(new Date(this.state.movie.ReleaseDate))}
            </p>
            <p className="inline-block">{this.state.movie.Genre}</p>
            <p>Stars: {this.state.movie.Stars}</p>
            <p>Director(s): {this.state.movie.Director}</p>
            <p className="movie-description">{this.state.movie.Description}</p>
          </div>
        </div>

        <div className="reviews-container">
          <h4>Reviews</h4>
          {this.state.reviews
            .slice(
              (this.state.page - 1) * this.state.itemsPerPage,
              this.state.page * this.state.itemsPerPage
            )
            .map((review) => (
              <Review
                key={uid(review)}
                review={review}
                handleLikeButtonClick={this.handleLikeButtonClick}
                handleDeleteButtonClick={this.handleDeleteButtonClick}
                currentUser={this.props.appState.state.currentUser}
                appState={this.props.appState}
              />
            ))}
        </div>
        <div>
          <Pagination
            count={this.state.noOfPages}
            page={this.state.page}
            onChange={this.handlePageChange}
            defaultPage={1}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </div>
        <div>
          <Modal
            open={this.state.addReviewModalOpen}
            onClose={this.handleAddReviewClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="add-review-modal"
          >
            <Card className="add-review-content">
              {/* {this.handleModalBodyChange()}
               */}
              <div>
                <CardContent className="add-review-paper">
                  <p className="add-review-modal-title">
                    Review: {this.state.movie.Name}
                  </p>
                  <div className="add-review-title-input-container">
                    <Rating
                      name="reviewRatingInput"
                      className="add-review-rating"
                      value={this.state.reviewRatingInput}
                      precision={0.5}
                      size="large"
                      onChange={this.onReviewInputChange}
                    />
                  </div>
                  <div className="add-review-title-input-container">
                    <TextField
                      name="reviewTitleInput"
                      variant="outlined"
                      defaultValue={this.state.reviewTitleInput}
                      label="Title"
                      className="add-review-title-input"
                      onChange={this.onReviewInputChange}
                    />
                  </div>
                  <div className="add-review-input-container">
                    <TextField
                      style={{ marginTop: "40px" }}
                      multiline
                      variant="outlined"
                      rows={12}
                      name="reviewInput"
                      defaultValue={this.state.reviewInput}
                      placeholder="Please write your review here"
                      className="add-review-input"
                      onChange={this.onReviewInputChange}
                    />
                  </div>
                  {this.addReviewHelperText()}
                </CardContent>
                <CardActions className="add-review-actions-container">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      this.state.reviewTitleInput.length === 0 ||
                      this.state.reviewInput.length === 0 ||
                      this.state.reviewInput.length > 180 ||
                      this.state.reviewRatingInput === 0
                    }
                    className="submit-review-button"
                    onClick={() => this.handleReviewSubmitted()}
                  >
                    Submit Review
                  </Button>
                </CardActions>
              </div>
            </Card>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Movie;
