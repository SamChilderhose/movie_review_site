import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class SignOutPage extends React.Component {
  state = {
    waited: false,
  };

  componentDidMount() {
    this.props.parentCallback();
    setTimeout(() => {
      this.setState({ waited: true });
    }, 3000);
    console.log("redirecting");

    // Sign out current user
    axios
      .get("/api/users/logout")
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  render() {
    return (
      <div>
        Signing you out
        {this.state.waited ? <Redirect to="/" /> : null}
      </div>
    );
  }
}

export default SignOutPage;
