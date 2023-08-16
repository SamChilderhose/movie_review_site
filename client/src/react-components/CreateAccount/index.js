import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import "./styles.css";
import axios from "axios";

class CreateAccount extends Component {
  state = {
    username: "",
    password: "",
    reEnterPassword: "",
  };

  onInputChange = (event) => {
    let value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };

  renderHelperText = () => {
    if (this.state.password !== this.state.reEnterPassword) {
      return "Passwords do not match";
    }
  };

  handleSubmit = () => {
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Account Created</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Account was not created</p>
      </div>
    );

    this.props.appState.setState({ loading: true }, () => {
      axios
        .post("/api/users/", {
          Username: this.state.username,
          Password: this.state.password,
          IsAdmin: false,
        })
        .then((res) => {
          console.log("res.data", res.data);
          this.props.closeModal();

          // Stop loading animation
          this.props.appState.setState({
            loading: false,
          });

          // Open success message
          this.props.appState.handleOpenSnackbarMessage(
            "success",
            successMessage
          );
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

  isSubmittable = () => {
    return !(this.state.username === "" || this.state.password === "" || this.state.reEnterPassword === "" || this.state.password !== this.state.reEnterPassword)
  }

  render() {
    return (
      <div className="main">
        <div className="sign-in-modal-title">Create Account</div>
        <div>
          <TextField
            type="text"
            variant="outlined"
            name="username"
            label="username"
            id="margin-normal"
            defaultValue={""}
            className="sign-in-input"
            margin="normal"
            onChange={this.onInputChange}
            rows={4}
            onKeyDown={(e) => {if(e.keyCode == 13 && this.isSubmittable()) { this.handleSubmit() } }}
          />
        </div>
        <div>
          <TextField
            variant="outlined"
            type="password"
            name="password"
            label="password"
            defaultValue={""}
            className="sign-in-input"
            margin="normal"
            onChange={this.onInputChange}
            rows={2}
            onKeyDown={(e) => {if(e.keyCode == 13 && this.isSubmittable()) { this.handleSubmit() } }}
          />
        </div>
        <div>
          <TextField
            variant="outlined"
            type="password"
            name="reEnterPassword"
            label="re-enter password"
            defaultValue={""}
            className="sign-in-input"
            margin="normal"            
            onChange={this.onInputChange}
            error={this.state.password !== this.state.reEnterPassword}
            helperText={this.renderHelperText()}
            rows={2}
            onKeyDown={(e) => {if(e.keyCode == 13 && this.isSubmittable()) { this.handleSubmit() } }}
          />
        </div>
        <div className="sign-in-button-container">
          <Button
            disabled={
              !this.isSubmittable()
            }
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
          >
            {" "}
            Submit{" "}
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateAccount;
