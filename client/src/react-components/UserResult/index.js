import React, { Component } from "react";
import { Rating } from "@material-ui/lab";
import { toDateString } from "../../actions/app-actions";
import "./styles.css";
import { Link } from "react-router-dom";
import axios from "axios";

class UserResult extends Component {
  state = {
    image: require(`../../images/avatar.png`).default,
    latestReview: null,
    movie: null,
  };

  componentDidMount() {
    if (this.props.user.Image !== null) {
      // Get user image is not null, get it
      axios
        .get("/api/images/" + this.props.user.Image)
        .then((res) => {
          console.log(res.data);
          this.setState({
            image: res.data.ImageUrl,
          });
        })
        .catch((error) => {
          console.error("error", error);
        });
    }

    // Get latest review for user
    axios
      .get("/api/reviews/latest/user/" + this.props.user._id)
      .then((res) => {
        console.log(res.data);
        this.setState({
          latestReview: res.data,
        });

        // Get the movie name
        axios.get("/api/movies/" + res.data.Movie).then((res) => {
          console.log(res.data);
          this.setState({
            movie: res.data,
          });
        });
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  renderLatestReview = () => {
    if (this.state.latestReview) {
      return (
        <div className="user-info-review">
          <p className="bold inline-block">{this.state.latestReview.Title}</p>
          <Rating
            className="inline-block"
            defaultValue={this.state.latestReview.Rating}
            precision={0.5}
            readOnly
            size="small"
          />

          <p className="user-review-text italic">
            {this.state.latestReview.Text}
          </p>
          <p className="user-info-text small-font">
            {" "}
            {this.state.movie !== null ? this.state.movie.Name : ""} on{" "}
            {toDateString(new Date(this.state.latestReview.CreatedAt))}
          </p>
        </div>
      );
    }
    return (
      <div className="user-info-review">
        <p>Hasn't made a review yet</p>
      </div>
    );
  };

  render() {
    return (
      <div className="container">
        <Link to={`/userprofile/` + this.props.user._id}>
          <img
            className="user-result-image"
            src={this.state.image}
            alt={this.props.user.Username}
          />
        </Link>
        <div className="user-info-container">
          <h2>{this.props.user.Username}</h2>
          {this.renderLatestReview()}
        </div>
      </div>
    );
  }
}

export default UserResult;
