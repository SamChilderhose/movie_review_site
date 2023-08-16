import React, { Component } from "react";
import SearchResult from "../SearchResult";
import UserResult from "../UserResult";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";
import { Link } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { uid } from "react-uid";
import "./styles.css";

class Search extends Component {
  state = {
    toggle: "movies",
    movieItemsPerPage: 5,
    moviePage: 1,
    movieNoOfPages: 0,
    userItemsPerPage: 5,
    userPage: 1,
    userNoOfPages: 0,
    searchInput: "",
    movies: this.props.movies,
    searchResults: [],
    userSearchResults: [],
  };

  handleMoviePageChange = (event, value) => {
    this.setState({
      moviePage: value,
    });
  };

  handleUserPageChange = (event, value) => {
    this.setState({
      userPage: value,
    });
  };

  onSearchInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    this.setState({
      searchInput: value,
    });
  };

  filterLists = () => {
    // let newMovieList = this.state.movies.filter((movie) =>
    //   movie.Name.toLowerCase().includes(this.state.searchInput)
    // );
    let newMovieList = this.props.appState.handleSearch(this.state.searchInput);
    // console.log("newMovieList", newMovieList);
    let newUserList = this.props.users.filter((user) =>
      user.Username.toLowerCase().includes(this.state.searchInput)
    );
    this.setState({
      searchResults: newMovieList,
      movieNoOfPages: Math.ceil(
        newMovieList.length / this.state.movieItemsPerPage
      ),
      userSearchResults: newUserList,
      userNoOfPages: Math.ceil(
        newUserList.length / this.state.userItemsPerPage
      ),
    });
  };

  handleToggleButton = () => {
    let newToggle = "users";
    if (this.state.toggle === "users") {
      newToggle = "movies";
    }
    this.setState({
      toggle: newToggle,
    });
  };

  renderSearchResults = () => {
    if (this.state.toggle === "movies") {
      return (
        <div>
          {this.state.searchResults
            .slice(
              (this.state.moviePage - 1) * this.state.movieItemsPerPage,
              this.state.moviePage * this.state.movieItemsPerPage
            )
            .map((movie) => (
              <Link to={`/movie/${movie._id}`} key={uid(movie)}>
                <SearchResult key={uid(movie)} movie={movie} />
              </Link>
            ))}
        </div>
      );
    }
    return (
      <div>
        {this.state.userSearchResults
          .slice(
            (this.state.userPage - 1) * this.state.userItemsPerPage,
            this.state.userPage * this.state.userItemsPerPage
          )
          .map((user) => (
            <UserResult key={uid(user)} user={user} />
          ))}
      </div>
    );
  };

  renderPagination = () => {
    if (this.state.toggle === "movies") {
      return (
        <div>
          <Pagination
            className="results-pagination"
            count={this.state.movieNoOfPages}
            page={this.state.moviePage}
            onChange={this.handleMoviePageChange}
            defaultPage={1}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </div>
      );
    }
    return (
      <div>
        <Pagination
          className="results-pagination"
          count={this.state.userNoOfPages}
          page={this.state.userPage}
          onChange={this.handleUserPageChange}
          defaultPage={1}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </div>
    );
  };

  renderResultsLength = () => {
    if (this.state.toggle === "movies") {
      return this.state.searchResults.length;
    }
    return this.state.userSearchResults.length;
  };

  render() {
    return (
      <div className="search-wrapper">
        <div className="search-container">
          <TextField
            id="outlined-basic"
            variant="outlined"
            name="searchInput"
            defaultValue={this.state.searchInput}
            label="search"
            className="search-input"
            margin="normal"
            onChange={this.onSearchInputChange}
            onKeyDown={(e) => {if(e.keyCode == 13) { this.filterLists() } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.filterLists()}
          >
            search
          </Button>
        </div>
        <div className="movie-list">
          <div>
            <h2 className="results-title">
              Results ({this.renderResultsLength()})
            </h2>

            <ToggleButtonGroup
              value={this.state.toggle}
              exclusive
              onChange={this.handleToggleButton}
              className="search-toggle-buttons"
            >
              <ToggleButton value="movies">Movies</ToggleButton>
              <ToggleButton value="users">Users</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="search-results-container">
            {this.renderSearchResults()}
          </div>
        </div>
        <div>{this.renderPagination()}</div>
        <div className="buffer"></div>
      </div>
    );
  }
}

export default Search;
