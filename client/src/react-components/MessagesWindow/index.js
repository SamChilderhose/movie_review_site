import React, { Component } from "react";
import MessageInChat from "../MessageInChat";
import { uid } from "react-uid";

class MessagesWindow extends Component {
  state = {};

  render() {
    return (
      <div>
        {this.props.messageOnDisplay.Messages.map((message) => (
          <div className="" key={uid(message)}>
            <MessageInChat
              message={message}
              from={this.props.from}
              currentUser={this.props.currentUser}
              image={this.props.image}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default MessagesWindow;
