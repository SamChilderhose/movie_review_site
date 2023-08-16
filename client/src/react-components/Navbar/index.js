import React from "react";
import { Button, Modal, Card } from "@material-ui/core";
import SignInPage from "../SignInPage";
import CreateAccount from "../CreateAccount";
import { Link } from "react-router-dom";

import "./styles.css";

class Navbar extends React.Component {
  state = {
    currentUser: this.props.currentUser,
    redirect: null,
    openSignInModal: false,
    openCreateAccountModal: false,
    openSuccessMessage: false,
    searchInput: "",
  };

  componentDidMount() {
    console.log(this.props);
  }

  renderSignInOutButtons = () => {
    if (this.props.appState.state.currentUser) {
      return (
        <div>
          <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/signout")}
          >
            Sign Out
          </Button>
          <Link to="/messages">
            <Button
              className="button"
              variant="contained"
              color="primary"
            >
              Messages
            </Button>
          </Link>
          <Link to={`/userprofile/${this.props.appState.state.currentUser._id}`} >
            <Button
              className="button"
              variant="contained"
              color="primary"
            >
              {this.props.appState.state.currentUser.Username}'s Profile
            </Button>
          </Link>
        </div>
      );
    }
    return (
      <div>
        <Button
          className="button"
          variant="contained"
          color="primary"
          onClick={() => this.handleSignInModalOpen()}
        >
          Sign In
        </Button>
        <Button
          className="button"
          variant="contained"
          color="primary"
          onClick={() => this.handleCreateAccountModalOpen()}
        >
          Create Account
        </Button>
      </div>
    );
  };

  handleSignInModalOpen = () => {
    this.setState({
      openSignInModal: true,
    });
  };

  handleSignInModalClose = () => {
    this.setState({
      openSignInModal: false,
    });
  };

  handleCreateAccountModalOpen = () => {
    this.setState({
      openCreateAccountModal: true,
    });
  };

  handleCreateAccountModalClose = () => {
    this.setState({
      openCreateAccountModal: false,
    });
  };

  onSearchInputChange = (event) => {
    let value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };
  render() {
    return (
      <div className="bar">
        <Link to={`/`}>
          <p className="website-name">Quick Movie Review</p>
        </Link>
        <div className="navbar-links">
          {/* <Button
            className="button"
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/signout")}
          >
            Sign Out
          </Button> */}
          {this.renderSignInOutButtons()}
          <Link to="/search">
            <Button
              className="button"
              variant="contained"
              color="primary"
            >
              Search
            </Button>
          </Link>
          <Link to="/">
            <Button
              className="button"
              variant="contained"
              color="primary"
            >
              Home
            </Button>
          </Link>
          {this.props.currentUser && this.props.currentUser.IsAdmin ? (
            <Link to="/adminDashboard">
              <Button
                className="button"
                variant="contained"
                color="primary"
              >
                Admin Dashboard
              </Button>
            </Link>
          ) : null}
          {this.state.redirect}
        </div>
        <Modal
          open={this.state.openSignInModal}
          onClose={this.handleSignInModalClose}
          className="sign-in-modal"
        >
          <Card className="sign-in-card">
            <SignInPage
              currentUser={this.props.appState.currentUser}
              users={this.props.appState.users}
              toggle={this.toggleSignInPage}
              // parentCallback={(user) => this.props.parentCallback(user)}
              appState={this.props.appState}
              closeModal={this.handleSignInModalClose}
            />
          </Card>
        </Modal>
        <Modal
          open={this.state.openCreateAccountModal}
          onClose={this.handleCreateAccountModalClose}
          className="create-account-modal"
        >
          <Card className="sign-in-card">
            <CreateAccount
              closeModal={this.handleCreateAccountModalClose}
              appState={this.props.appState}
            />
          </Card>
        </Modal>
      </div>
    );
  }
}

export default Navbar;
