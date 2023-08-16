import React from "react";
import { Link } from "react-router-dom";
import { uid } from "react-uid";

import "./styles.css";

class MoviePoster extends React.Component {
  state = {
    movie: this.props.movie,
    height: this.props.height || 500,
  };

  renderPoster = () => {
    if (this.props.movie) {
      return (
        <Link to={`/movie/${this.props.movie._id}`} key={uid(this.props.movie)}>
          <img
            className="movie"
            src={this.props.movie.Image}
            alt={this.props.movie.Name}
            //   onClick={() => (window.location.href = `/movie/${this.state.movie.Id}`)}
            height={this.state.height}
          />
        </Link>
      );
    }
  };

  render() {
    return <div>{this.renderPoster()}</div>;
  }
}

export default MoviePoster;
