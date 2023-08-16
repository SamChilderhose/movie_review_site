import React, { Component } from "react";
import { toDateTimeString } from "../../actions/app-actions";
import "./styles.css";
// import axios from "axios";

class Message extends Component {
  state = {
    image: require(`../../images/avatar.png`).default,
    lastMessage: undefined,
    fromUser: null,
  };

  componentDidMount() {
    const fromUser = this.renderFromUsersName();

    if (fromUser !== undefined) {
      this.setState({
        fromUser: fromUser,
      });

      if (fromUser.Image !== null) {
        this.setState({
          image: fromUser.Image,
        });
      }
    }

    if (this.props.message.Messages.length > 0) {
      this.setState({
        lastMessage: this.props.message.Messages.slice(-1)[0],
      });
    }
  }

  renderFromUsersName = () => {
    if (this.props.message.Users !== undefined) {
      const fromUser = this.props.message.Users.filter(
        (u) => u._id !== this.props.appState.state.currentUser._id
      );

      return fromUser[0];
    }
  };

  render() {
    return (
      <div
        className="message-container"
      >
        <div className="image-container">
          <img
            className="from-user-image"
            src={this.state.image}
            alt={
              this.state.fromUser !== null ? this.state.fromUser.Username : ""
            }
          />
        </div>
        <div className="message-details">
          <div className="from-name">
            {this.state.fromUser !== null ? this.state.fromUser.Username : ""}
          </div>
          <div className="last-sent">
            {this.state.lastMessage !== undefined
              ? toDateTimeString(new Date(this.state.lastMessage.CreatedAt))
              : ""}
          </div>
          <div className="message">
            {this.state.lastMessage !== undefined
              ? this.state.lastMessage.Text
              : ""}
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
