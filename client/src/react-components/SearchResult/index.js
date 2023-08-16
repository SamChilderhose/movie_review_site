import React, { Component } from "react";
import { Rating } from "@material-ui/lab";
import "./styles.css";
import { toDateString } from "../../actions/app-actions";

class SearchResult extends Component {
  state = {};

  render() {
    return (
      <div className="container">
        <img
          className="movie-image"
          src={this.props.movie.Image}
          // src={require(`../../images/${this.props.movie.Image}`).default}
          alt={this.props.movie.Name}
        />
        <div className="movie-info-container">
          <div>
            <h2 className="inline-block">{this.props.movie.Name}</h2>
            <Rating
              className="inline-block"
              defaultValue={this.props.movie.Rating}
              precision={0.5}
              readOnly
            />
          </div>
          <div className="movie-info">
            <p className="movie-info-text bold">Release Date: </p>
            <p className="movie-info-text">
              {toDateString(new Date(this.props.movie.ReleaseDate))}
            </p>
          </div>
          <div className="movie-info">
            <p className="movie-info-text bold">Director(s): </p>
            <p className="movie-info-text">{this.props.movie.Director}</p>
          </div>
          <p className="description-title bold">Description:</p>
          <p className="description">{this.props.movie.Description}</p>
        </div>
      </div>
    );
  }
}

export default SearchResult;
