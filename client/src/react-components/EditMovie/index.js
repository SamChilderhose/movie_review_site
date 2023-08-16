import { Button } from "@material-ui/core";
import React, { Fragment } from "react";
import "./styles.css";
import TextField from "@material-ui/core/TextField";
import { uid } from "react-uid";

import { Link } from "react-router-dom";
import axios from "axios";

class EditMovie extends React.Component {
  state = {
    userProfile: {},
    imageToUpload: null,
    movie: {
      _id: null,
      Name: "",
      Image: "",
      Description: "",
      ReleaseDate: null,
      Director: "",
      Stars: "",
      Genre: "",
    },
    searchInput: "",
    searchResults: [],
  };

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    let newMovie = this.state.movie;
    newMovie[nam] = val;
    this.setState({ movie: newMovie });
  };

  handleImgChange = (event) => {
    let val = event.target.files[0];
    let newImg = this.state.imageToUpload;
    newImg = val;
    this.setState({ imageToUpload: newImg });
  };

  handleSubmit() {
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Movie Entry Updated</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Movie Updating Failed</p>
      </div>
    );
    let form = new FormData();
    form.append("file", this.state.imageToUpload);
    // console.log(this.state.imageToUpload);
    if (this.state.imageToUpload) {
      axios
        .post("/api/images", form)
        .then((res) => {
          let newMovie = this.state.movie;
          newMovie.Image = res.data.ImageUrl;
          this.setState({ movie: newMovie });
          console.log("Updated Image:", this.state.movie);
          axios
            .patch("/api/movies/" + this.state.movie._id, this.state.movie)
            .then((res) => {
              console.log("Updated", res.data);
              this.setState({
                movie: res.data,
              });
              this.props.appState.handleOpenSnackbarMessage(
                "success",
                successMessage
              );
              const empty = {
                _id: null,
                Name: "",
                Image: "",
                Description: "",
                ReleaseDate: null,
                Director: "",
                Stars: "",
                Genre: "",
              };
              this.setState({
                movie: empty,
              });
              console.log("emtpying this.state.movie:", this.state.movie);
            })
            .catch((error) => {
              console.error("error", error);
              this.props.appState.handleOpenSnackbarMessage(
                "error",
                errorMessage
              );
            });
        })
        .catch((error) => {
          console.error("error", error);
          this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        });
    } else {
      axios
        .patch("/api/movies/" + this.state.movie._id, this.state.movie)
        .then((res) => {
          console.log("updated", res.data);
          const empty = {
            _id: null,
            Name: "",
            Image: "",
            Description: "",
            ReleaseDate: null,
            Director: "",
            Stars: "",
            Genre: "",
          };
          this.setState({
            movie: empty,
          });
          console.log("emtpying this.state.movie:", this.state.movie);
          this.props.appState.handleOpenSnackbarMessage(
            "success",
            successMessage
          );
        })
        .catch((error) => {
          console.error("error", error);
          this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        });
    }
  }

  handleCancel = () => {
    console.log("Cancelling");
  };

  onSearchInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    this.setState({
      searchInput: value,
    });
  };

  filterMovieList = () => {
    console.log("this.state.searchInput", this.state.searchInput);
    let newMovieList = this.props.movies.filter((movie) =>
      movie.Name.toLowerCase().includes(this.state.searchInput)
    );
    this.setState({
      searchResults: newMovieList,
      noOfPages: Math.ceil(newMovieList.length / this.state.itemsPerPage),
    });
  };

  handleEdit = (result) => {
    console.log(result);
    result.ReleaseDate = result.ReleaseDate.split("T")[0];
    this.setState({
      movie: result,
    });
  };

  render() {
    return (
      <Fragment>
        <div className="centerDiv">
          <form className="center">
            <h1 id="title">Search Movie Title Here</h1>
            <div className="search-container">
              <TextField
                variant="outlined"
                name="searchInput"
                defaultValue={this.state.searchInput}
                label="search"
                className="search-input"
                margin="normal"
                onChange={this.onSearchInputChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={this.filterMovieList}
              >
                search
              </Button>

              <br />
            </div>
          </form>
          <div>
            {this.state.searchResults.map((result) => (
              <div key={uid(result)}>
                {result.Name}
                <Button color="primary" onClick={() => this.handleEdit(result)}>
                  Edit
                </Button>
              </div>
            ))}
          </div>

          <form>
            <br />
            <br />
            <h1> Editing a Movie </h1>
            <br />
            <p> Movie Title </p>
            <input
              type="text"
              name="Name"
              id="titleInput"
              defaultValue={this.state.movie.Name}
              onChange={this.handleChange}
            />
            <br />
            <br />

            <p> Description </p>
            <textarea
              name="Description"
              id="DescriptionInput"
              className="textBox"
              rows="6"
              cols="80"
              defaultValue={this.state.movie.Description}
              onChange={this.handleChange}
            ></textarea>
            <br />
            <br />

            <p> Release Date </p>
            <input
              type="date"
              name="ReleaseDate"
              id="ReleaseInput"
              defaultValue={this.state.movie.ReleaseDate}
              onChange={this.handleChange}
            />
            <br />
            <br />

            <p> Genre </p>
            <input
              type="tetxt"
              name="Gener"
              id="GenerInput"
              defaultValue={this.state.movie.Genre}
              onChange={this.handleChange}
            />
            <br />
            <br />

            <p> Director(s) </p>
            <input
              type="tetxt"
              name="Director"
              id="ReleaseInput"
              defaultValue={this.state.movie.Director}
              onChange={this.handleChange}
            />
            <br />
            <br />

            <p> Stars </p>
            <input
              type="tetxt"
              name="Stars"
              id="StarsInput"
              defaultValue={this.state.movie.Stars}
              onChange={this.handleChange}
            />
            <br />
            <br />

            <p> Upload Poster </p>
            <input
              type="file"
              name="Image"
              id="imgInput"
              defaultValue={this.state.movie.Image}
              onChange={this.handleImgChange}
            />
            <br />
            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleSubmit()}
            >
              {" "}
              Update{" "}
            </Button>
            <div class="divider"></div>
            <Link to={"./../AdminDashboard"}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.handleCancel()}
              >
                {" "}
                Cancel{" "}
              </Button>
            </Link>

            <br />
            <br />
            <br />
            <br />
            <br />
          </form>
        </div>
      </Fragment>
    );
  }
}

export default EditMovie;
