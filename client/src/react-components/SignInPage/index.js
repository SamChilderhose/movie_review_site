import React from "react";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";

import "./styles.css";

// const bcrypt = require("bcryptjs");

class SignInPage extends React.Component {
  state = {
    // currentUser: this.props.currentUser,
    // users: this.props.users,
    username: "",
    password: "",
    userNotFound: false,
  };

  authenticate = () => {
    const body = {
      Username: this.state.username,
      Password: this.state.password,
    };
    axios
      // .get(`/api/users/${this.state.username}/${this.state.password}`)
      .post(`/api/users/login`, body)
      .then((res) => {
        this.props.closeModal();
        this.props.appState.setState({
          currentUser: res.data,
        });
      })
      .catch((error) => {
        // alert user that sign in failed
        console.log(error);
        this.setState({
          userNotFound: true,
        });
      });
  };

  renderHelpTexts = () => {
    if (this.state.userNotFound) {
      return (
        <div>
          <p>Username and/or password are incorrect.</p>{" "}
          <p>Please try again.</p>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="main">
        <div className="sign-in-modal-title">SIGN IN</div>
        <div>
          <TextField
            error={this.state.userNotFound}
            variant="outlined"
            name="username"
            label="username"
            id="margin-normal"
            defaultValue={""}
            className="sign-in-input"
            margin="normal"
            onChange={(event) =>
              this.setState({
                username: event.target.value,
                userNotFound: false,
              })
            }
            onKeyDown={(e) => {if(e.keyCode == 13 && !(this.state.username === "" || this.state.password === "")) { this.authenticate() } }}
          />
        </div>
        <div>
          <TextField
            error={this.state.userNotFound}
            variant="outlined"
            type="password"
            name="password"
            label="password"
            id="margin-normal"
            defaultValue={""}
            className="sign-in-input"
            margin="normal"
            onChange={(event) =>
              this.setState({
                password: event.target.value,
                userNotFound: false,
              })
            }
            onKeyDown={(e) => {if(e.keyCode == 13 && !(this.state.username === "" || this.state.password === "")) { this.authenticate() } }}
          />
        </div>
        <div className="user-not-found-text">{this.renderHelpTexts()}</div>
        <div className="sign-in-button-container">
          <Button
            onClick={this.authenticate}
            variant="contained"
            color="primary"
            disabled={this.state.username === "" || this.state.password === ""}
          >
            Sign In
          </Button>
          {/* <button onClick={this.props.toggle}> Close </button> */}
        </div>
      </div>
    );
  }
}

export default SignInPage;
