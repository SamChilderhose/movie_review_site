import React, { Component } from "react";
import { Chip } from "@material-ui/core";
import { toDateTimeString } from "../../actions/app-actions";
import "./styles.css";

class MessageInChat extends Component {
  state = {};

  renderChipContainerClass = () => {
    if (
      this.props.currentUser !== null &&
      this.props.message.CreatedBy === this.props.currentUser._id
    ) {
      return "current-user-message-container";
    }
    return "other-user-message-container";
  };

  renderChipClass = () => {
    if (
      this.props.currentUser !== null &&
      this.props.message.CreatedBy === this.props.currentUser._id
    ) {
      return "current-user-message";
    }
    return "other-user-message";
  };

  render() {
    return (
      <div className="message-chip-container">
        <div className={this.renderChipContainerClass()}>
          <div>
            <Chip
              className={this.renderChipClass()}
              label={this.props.message.Text}
            />
            <div className="chip-message-sent">
              {toDateTimeString(
                this.props.message ? new Date(this.props.message.CreatedAt) : ""
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageInChat;
