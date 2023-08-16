import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";
import "./styles.css";
import { Link } from "react-router-dom";
import axios from "axios";

class ProfileSideDisplay extends Component {
  state = {
    userProfile: this.props.userProfile,
    profileEdits: this.props.profileEdits,
    userId: this.props.userId,
    show: false,
    following: false,
    followBtnText: "Follow",
    numFollowers: this.props.userProfile.followers.length,
    numFollowing: this.props.userProfile.following.length,
    imageToUpload: null,
    currentUser: null,
    currentProfileImage: null,
    createdByUserImage: null,
    loggedInUser: this.props.loggedInUser,
  };

  createEditForm = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmitEdit}>
          <div>
            <label htmlFor="imageToUpload">Profile Picture:</label>
            <input
              type="file"
              id="imageToUpload"
              name="imageToUpload"
              accept="image/*"
              onChange={this.onFileInputChange}
            />
          </div>
          <label>
            {"Name: "}
            <input
              id="editName"
              type="text"
              placeholder={this.state.userProfile.name}
              onChange={this.handleProfileChange}
            />

            <br />
            {"Favourite Genre: "}
            <input
              id="editFavouriteGenre"
              type="text"
              placeholder={this.state.userProfile.favouriteGenre}
              onChange={this.handleProfileChange}
            />
            <br />
            {"Favourite Movie: "}
            <input
              id="editFavouriteMovie"
              type="text"
              placeholder={this.state.userProfile.favouriteMovie}
              onChange={this.handleProfileChange}
            />
          </label>

          <input className="followBtn" type="submit" value="Submit" />
        </form>
      </div>
    );
  };

  checkIsFollowing = () => {
    for (let i = 0; i < this.props.userProfile.followers.length; i++) {
      if (this.props.userProfile.followers === this.props.loggedInUser._id) {
        this.state.following = true;
      }
    }
  };

  followUser = (event) => {
    this.checkIsFollowing();
    let items = this.props.userProfile;
    let traits = this.props.loggedInUser;
    if (!this.state.following) {
      this.setState({
        numFollowers: this.state.userProfile.followers.length + 1,
        followBtnText: "Unfollow",
      });
      items = this.state.userProfile;
      items.followers.push({
        userId: this.props.loggedInUser._id,
        profileIcon: this.props.loggedInUser.Image,
        name: this.props.loggedInUser.Username,
      });

      this.setState({
        userProfile: items,
      });

      axios
        .patch("/api/users/" + this.props.userId, this.state.userProfile)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((error) => {
          console.error("error", error);
        });

      traits = this.state.loggedInUser;
      traits.Following.push({
        userId: this.props.userProfile.userId,
        profileIcon: this.props.userProfile.image,
        name: this.props.userProfile.name,
      });
      console.log("traits.Following");
      console.log(traits.Following);

      this.setState({
        loggedInUser: traits,
      });

      console.log("/api/users/" + this.props.loggedInUser._id);
      let temp = {
        name: this.state.loggedInUser.Username,
        favouriteMovie: this.state.loggedInUser.FavouriteMovie,
        favouriteGenre: this.state.loggedInUser.FavouriteGenre,
        followers: this.state.loggedInUser.Followers,
        following: this.state.loggedInUser.Following,
      };
      axios
        .patch("/api/users/" + this.props.loggedInUser._id, temp)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((error) => {
          console.error("error", error);
        });

      console.log("Inside not following. The userProfile is:");
      console.log(this.state.userProfile.followers);
      console.log("Inside not following. The loggedInUser is:");
      console.log(this.state.loggedInUser.Following);
    } else {
      items = this.state.userProfile;

      for (let i = 0; i < this.state.userProfile.followers.length; i++) {
        if (
          this.state.userProfile.followers[i].userId ===
          this.props.loggedInUser._id
        ) {
          items.followers.splice(i);
        }
      }

      this.setState({
        numFollowers: this.state.userProfile.followers.length - 1,
        followBtnText: "Follow",
        userProfile: items,
      });

      axios
        .patch("/api/users/" + this.props.userId, this.state.userProfile)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((error) => {
          console.error("error", error);
        });

      traits = this.state.loggedInUser;

      for (let i = 0; i < this.state.loggedInUser.Following.length; i++) {
        if (this.state.loggedInUser.Following[i].userId === this.state.userId) {
          traits.Following.splice(i);
        }
      }

      this.setState({
        loggedInUser: traits,
      });

      let temp = {
        name: this.state.loggedInUser.Username,
        favouriteMovie: this.state.loggedInUser.FavouriteMovie,
        favouriteGenre: this.state.loggedInUser.FavouriteGenre,
        followers: this.state.loggedInUser.Followers,
        following: this.state.loggedInUser.Following,
      };

      axios
        .patch("/api/users/" + this.state.loggedInUser._id, temp)
        .then((res) => {
          // console.log(res.data);
        })
        .catch((error) => {
          console.error("error", error);
        });

      console.log("Inside not following. The userProfile is:");
      console.log(this.state.userProfile.followers);
    }
    this.setState({
      following: !this.state.following,
    });
  };

  showPopUp = (event) => {
    this.setState({
      show: true,
    });
  };

  closePopUp = (event) => {
    this.state.imageToUpload = null;
    this.setState({
      show: false,
    });
  };

  handleProfileChange = (event) => {
    let items = this.state.profileEdits;

    if (event.target.id === "editName") {
      items.name = event.target.value;
    } else if (event.target.id === "editAge") {
      items.age = event.target.value;
    } else if (event.target.id === "editFavouriteMovie") {
      items.favouriteMovie = event.target.value;
    } else if (event.target.id === "editFavouriteGenre") {
      items.favouriteGenre = event.target.value;
    }

    this.setState({
      profileEdits: items,
    });
  };

  handleSubmitEdit = (event) => {
    event.preventDefault();
    // this.closePopUp();

    let items = this.state.userProfile;

    if (this.state.profileEdits.name !== "") {
      items.name = this.state.profileEdits.name;
    }
    if (this.state.profileEdits.age !== "") {
      items.age = this.state.profileEdits.age;
    }
    if (this.state.profileEdits.favouriteMovie !== "") {
      items.favouriteMovie = this.state.profileEdits.favouriteMovie;
    }
    if (this.state.profileEdits.favouriteGenre !== "") {
      items.favouriteGenre = this.state.profileEdits.favouriteGenre;
    }

    this.setState({
      userProfile: items,
    });

    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Account Updated</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Account was not updated</p>
      </div>
    );

    // If user selected image
    if (this.state.imageToUpload !== null) {
      let form = new FormData();
      form.append("file", this.state.imageToUpload);
      // console.log(this.state.imageToUpload);
      this.props.appState.setState({ loading: true }, () => {
        axios
          .post("/api/images", form)
          .then((res) => {
            console.log(res.data);
            this.props.userProfile.profileIcon = res.data.ImageUrl;

            console.log("About to patch user: /api/users/" + this.props.userId);
            axios
              .patch("/api/users/" + this.props.userId, this.props.userProfile)
              .then((res) => {
                // console.log(res.data);
                this.props.appState.setState({
                  loading: false,
                });

                // Open success message
                this.props.appState.handleOpenSnackbarMessage(
                  "success",
                  successMessage
                );
              })
              .catch((error) => {
                console.error("error", error);
                this.props.appState.setState({
                  loading: false,
                });
                this.props.appState.handleOpenSnackbarMessage(
                  "error",
                  errorMessage
                );
              });
          })
          .catch((error) => {
            console.error("error", error);
            this.props.appState.setState({
              loading: false,
            });
            this.props.appState.handleOpenSnackbarMessage(
              "error",
              errorMessage
            );
          });
      });
    } else {
      console.log("About to patch user: /api/users/" + this.props.userId);
      this.props.appState.setState({ loading: true }, () => {
        axios
          .patch("/api/users/" + this.props.userId, this.props.userProfile)
          .then((res) => {
            // console.log(res.data);
            this.props.appState.setState({
              loading: false,
            });

            // Open success message
            this.props.appState.handleOpenSnackbarMessage(
              "success",
              successMessage
            );
          })
          .catch((error) => {
            console.error("error", error);
            this.props.appState.setState({
              loading: false,
            });
            this.props.appState.handleOpenSnackbarMessage(
              "error",
              errorMessage
            );
          });
      });
    }
  };

  displayEditableBtn = () => {
    if (this.props.loggedInUser !== null) {
      if (
        this.props.loggedInUser.IsAdmin ||
        String(this.props.loggedInUser._id) ===
          String(this.props.userProfile.userId)
      ) {
        return (
          <Button
            className="editProfileBtn profileBtn"
            onClick={this.showPopUp}
          >
            Edit Profile
          </Button>
        );
      } else {
        return <div> </div>;
      }
    }
  };

  displayFollowBtn = () => {
    if (this.props.loggedInUser !== null) {
      if (
        String(this.props.loggedInUser._id) !==
          String(this.props.userProfile.userId) &&
        String(this.props.userProfile.userId) !== ""
      ) {
        return (
          <Button className="profileBtn followBtn" onClick={this.followUser}>
            {" "}
            {this.state.followBtnText}{" "}
          </Button>
        );
      }
    }
  };

  displayTicketBtn = () => {
    if (this.props.loggedInUser !== null) {
      if (!this.props.loggedInUser.IsAdmin) {
        return (
          <Link to={"/addTicket"}>
            <Button className="profileBtn"> Ticket </Button>
          </Link>
        );
      }
    }
  };

  onFileInputChange = (event) => {
    const value = event.target.files[0];
    console.log(event);
    const name = event.target.name;
    console.log("value", value);
    console.log("name", name);
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div className="profileContainer">
        <img
          id="mainProfileIcon"
          src={
            this.state.userProfile.profileIcon
              ? this.state.userProfile.profileIcon
              : require(`../../images/avatar.png`).default
          }
        />
        <h2 className="centerText"> {this.state.userProfile.name} </h2>
        {this.displayFollowBtn()}

        <div className="profileInfoText">
          <br />
          Following: {this.state.userProfile.following.length} <br />
          Followers: {this.state.userProfile.followers.length} <br />
          Favourite Genre: {this.state.userProfile.favouriteGenre} <br />
          Number of Reviews: {this.state.userProfile.numberOfReviews} <br />
          Favourite Movie: {this.state.userProfile.favouriteMovie} <br />
          <br />
          <div>
            {this.displayEditableBtn()}

            <Modal
              data-backdrop="true"
              open={this.state.show}
              onClose={this.closePopUp}
            >
              <div className="modalContainer">
                <h2>Edit Profile</h2>
                <br />
                {this.createEditForm()}
                <Button
                  className="modalCloseBtn profileBtn"
                  onClick={this.closePopUp}
                >
                  {" "}
                  close{" "}
                </Button>
              </div>
            </Modal>

            {this.displayTicketBtn()}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileSideDisplay;
