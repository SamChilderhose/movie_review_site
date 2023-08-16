import React, { Component } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

class ReviewsDisplay extends Component {
  state = {
    currUserName: this.props.currUser.name,
    loggedInUser: this.props.loggedInUser,
    userId: this.props.userId,
    userReviews: this.props.userReviews,
    recentBtnClass: "sortSelectionBtn sortSelectionBtnActive",
    ratingBtnClass: "sortSelectionBtn",
    popularBtnClass: "sortSelectionBtn",
  };

  createReviewCard = (index) => {
    const film = this.props.userReviews[index];
    return (
      <div>
        <div className="reviewCardContainer">
          <Link to={"/movie/" + this.props.userReviews[index].movieId}>
            <img
              className="reviewMoviePoster"
              src={this.props.userReviews[index].moviePoster}
              alt=""
            />
          </Link>
        </div>

        <div className="reviewCard">
          <button
            className={film.liked ? "likedBtn" : "likeBtn"}
            id={film.movieId}
            onClick={this.clickLike}
          >
            ❤
          </button>
          <h3 className="reviewTitleText"> {film.title} </h3>
          <Link
            to={"/userprofile/" + this.props.userId}
            className="reviewAuthorText"
          >
            by {this.props.userReviews[0].createdBy}
          </Link>
          <br />
          {this.generateStarRating(film)}
          <span className="likeCounter"> {film.numLikes} Likes </span>
          <p> {film.text} </p>
        </div>
      </div>
    );
  };

  clickSortBtn = (event) => {
    if (event.target.id === "recent") {
      this.sortReviewsRecent();
      this.setState({
        recentBtnClass: "sortSelectionBtn sortSelectionBtnActive",
        ratingBtnClass: "sortSelectionBtn",
        popularBtnClass: "sortSelectionBtn",
      });
    } else if (event.target.id === "byPopular") {
      this.sortReviewsPopular();
      this.setState({
        recentBtnClass: "sortSelectionBtn",
        ratingBtnClass: "sortSelectionBtn",
        popularBtnClass: "sortSelectionBtn sortSelectionBtnActive",
      });
    } else {
      this.sortReviewsRating();
      this.setState({
        recentBtnClass: "sortSelectionBtn",
        ratingBtnClass: "sortSelectionBtn sortSelectionBtnActive",
        popularBtnClass: "sortSelectionBtn",
      });
    }
  };

  sortReviewsRecent = () => {
    let tempArr = this.props.userReviews;
    let len = this.props.userReviews.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1; j++) {
        if (
          tempArr[j].createdAt.getTime() > tempArr[j + 1].createdAt.getTime()
        ) {
          let tmp = tempArr[j];
          tempArr[j] = tempArr[j + 1];
          tempArr[j + 1] = tmp;
        }
      }
    }
    this.setState({
      userReviews: tempArr,
    });
  };

  sortReviewsRating = () => {
    let tempArr = this.props.userReviews;
    let len = this.props.userReviews.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1; j++) {
        if (tempArr[j].rating < tempArr[j + 1].rating) {
          let tmp = tempArr[j];
          tempArr[j] = tempArr[j + 1];
          tempArr[j + 1] = tmp;
        }
      }
    }
    this.setState({
      userReviews: tempArr,
    });
  };

  sortReviewsPopular = () => {
    console.log("Sorting likes");
    let tempArr = this.props.userReviews;
    let len = this.props.userReviews.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - 1; j++) {
        if (tempArr[j].numLikes < tempArr[j + 1].numLikes) {
          let tmp = tempArr[j];
          tempArr[j] = tempArr[j + 1];
          tempArr[j + 1] = tmp;
        }
      }
    }
    this.setState({
      userReviews: tempArr,
    });
  };

  generateStarRating = (review) => {
    let result = "";
    const rating = review.rating;
    const hollowStars = 5 - rating;

    for (let i = 0; i < rating; i++) {
      result = result.concat("★");
    }
    for (let j = 0; j < hollowStars; j++) {
      result = result.concat("☆");
    }

    return <p className="starRating"> {result} </p>;
  };

  /** ClickLike should call on a function in the server to change
   *the number of likes in the Review */
  clickLike = (event) => {
    let items = this.props.userReviews;

    for (let i = 0; i < items.length; i++) {
      if (items[i].movieId === Number(event.target.id)) {
        let item = this.props.userReviews[i];
        item.liked = !item.liked;

        if (item.liked) {
          item.numLikes += 1;
        } else {
          item.numLikes -= 1;
        }
        items[i] = item;
      }
    }

    this.setState({
      userReviews: items,
    });
  };

  displayReviews = () => {
    const reviewCards = [];
    for (let i = 0; i < this.props.userReviews.length; i++) {
      reviewCards.push(this.createReviewCard(i));
    }
    return <div id=""> {reviewCards} </div>;
  };

  render() {
    return (
      <div className="recentReviewsContainer">
        <div className="sortSelectionContainer">
          <h2 className="currentSortSelection">
            {" "}
            {this.props.currUser.name}'s Reviews{" "}
          </h2>

          <button
            id="byPopular"
            className={this.state.popularBtnClass}
            onClick={this.clickSortBtn}
          >
            {" "}
            Number of Likes{" "}
          </button>
          <button
            id="byRating"
            className={this.state.ratingBtnClass}
            onClick={this.clickSortBtn}
          >
            {" "}
            By Rating{" "}
          </button>
          <button
            id="recent"
            className={this.state.recentBtnClass}
            onClick={this.clickSortBtn}
          >
            {" "}
            Recent{" "}
          </button>
        </div>

        {this.displayReviews()}

        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default ReviewsDisplay;
