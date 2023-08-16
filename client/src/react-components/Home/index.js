import React from "react";
import { Redirect } from "react-router-dom";
import { GridList, GridListTile } from "@material-ui/core";
import SignInPage from "../SignInPage";
import MoviePoster from "../MoviePoster";
import { uid } from "react-uid";
import Review from "../Review";
import Carousel from "react-grid-carousel";
import "./styles.css";

class Home extends React.Component {
  state = {
    signInVisible: false,
    searched: false,
    searchText: "",
    openSuccessMessage: false,
    currentUser: this.props.appState.state.currentUser,
    items: this.props.appState.state.trendings,
  };

  responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  search = () => {
    return (
      <Redirect
        to={{
          pathname: "search",
          state: { searchInput: this.state.searchText },
        }}
      />
    );
  };

  toggleSignInPage = () => {
    this.setState({ signInVisible: !this.state.signInVisible });
  };

  renderWelcome = () => {
    if (this.props.appState.state.currentUser) {
      return <div>Hi, {this.props.appState.state.currentUser.Username}!</div>;
    }
    return "";
  };

  renderTrendingMovies = () => {
    if (this.props.appState.state.movies.length !== 0) {
      return (
        <tr>
          <td>
            <MoviePoster movie={this.props.appState.state.trendings[0]} />
          </td>
          <td>
            <MoviePoster movie={this.props.appState.state.trendings[1]} />
          </td>
          <td>
            <MoviePoster movie={this.props.appState.state.trendings[2]} />
          </td>
          <td>
            <MoviePoster movie={this.props.appState.state.trendings[3]} />
          </td>
          <td>
            <MoviePoster movie={this.props.appState.state.trendings[4]} />
          </td>
        </tr>
      );
    }
  };

  render() {
    return (
      <div>
        {
          /*this.state.signInVisible ? <SignInPage users={this.state.users} currentUser={this.state.currentUser} toggle={this.toggleSignInPage} parentCallback={this.setUser} /> : null*/
          this.state.signInVisible ? (
            <SignInPage
              currentUser={this.props.state.currentUser}
              users={this.props.state.users}
              toggle={this.toggleSignInPage}
              parentCallback={(user) => this.props.parentCallback(user)}
              appState={this.props.appState}
            />
          ) : null
        }
        <div className="home-text">
          <div className="quote-text">
            Where you can read and write quick movie reviews
          </div>
          <div className="hi-text">{this.renderWelcome()}</div>
        </div>
        <div className="main-content"></div>
        {this.state.searched ? (
          <Redirect
            to={{
              pathname: "/search",
              state: { searchInput: this.state.searchText },
            }}
          />
        ) : (
          ""
        )}
        <div className="trending-movies-title">Trending Movies</div>
        <div className="home-movie-container">
          <Carousel cols={5} rows={1} gap={5} loop autoplay={3000} showDots>
            {this.props.appState.state.trendings.map((movie) => (
              <Carousel.Item key={uid(movie)}>
                <MoviePoster movie={movie} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="recent-reviews-title">Recent Reviews</div>
        <div>
          <GridList cellHeight={160} cols={3}>
            {this.props.appState.state.latestReviews.map((review) => (
              <GridListTile
                key={uid(review)}
                cols={review.cols || 1}
                style={{ height: "unset" }}
              >
                <Review
                  key={uid(review)}
                  review={review}
                  appState={this.props.appState}
                  home={true}
                  handleLikeButtonClick={
                    this.props.appState.handleLikeButtonClick
                  }
                  handleDeleteButtonClick={
                    this.props.appState.handleDeleteButtonClick
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <div className="buffer"></div>
      </div>
    );
  }
}

export default Home;
