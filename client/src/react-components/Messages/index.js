import React, { Component } from "react";
import {
  Paper,
  Grid,
  Button,
  Card,
  Modal,
  TextField,
  CardContent,
  CardActions,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Message from "../Message";
import MessagesWindow from "../MessagesWindow";
import { uid } from "react-uid";
import "./styles.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Messages extends Component {
  state = {
    messageOnDisplayFromUser: null,
    friends: [],
    newMessageModalOpen: false,
    newMessageUser: {},
    messageInput: "",
    messageOnDisplayImage: require(`../../images/avatar.png`).default,
    messageOnDisplay: undefined,
    messages: [
      {
        From: {
          Name: "John Smith",
          Image: "phil_dunphy.jpg",
        },
        LastSent: new Date(),
        LastMessage: "where r u?",
        Messages: [
          {
            From: {
              Name: "John Smith",
              Image: "phil_dunphy.jpg",
            },
            Message: "Hey",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "Hey John",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "John Smith",
              Image: "phil_dunphy.jpg",
            },
            Message: "I couldn't get a hold of you",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "Sorry, my phone died",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "What's up?",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "John Smith",
              Image: "phil_dunphy.jpg",
            },
            Message: "about to head to the mall",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "John Smith",
              Image: "phil_dunphy.jpg",
            },
            Message: "what are you doing today?",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "nothing",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "nada",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "absolutely nothing",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "so.... can you pick me up?",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "John Smith",
              Image: "phil_dunphy.jpg",
            },
            Message: "where r u?",
            CreatedAt: new Date(),
          },
        ],
      },
      {
        From: {
          Name: "Jane Doe",
          Image: "claire_dunphy.jpg",
        },
        LastSent: new Date(),
        LastMessage: "what are you doing?",
        Messages: [
          {
            From: {
              Name: "Jane Doe",
              Image: "claire_dunphy.jpg",
            },
            Message: "Hey",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "Hey girl!",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Jane Doe",
              Image: "claire_dunphy.jpg",
            },
            Message: "what are you doing?",
            CreatedAt: new Date(),
          },
        ],
      },
      {
        From: {
          Name: "Tony Stark",
          Image: "phil_dunphy.jpg",
        },
        LastSent: new Date(),
        LastMessage: "how r u?",
        Messages: [
          {
            From: {
              Name: "Current User",
              Image: "phil_dunphy.jpg",
            },
            Message: "Hi buddy",
            CreatedAt: new Date(),
          },
          {
            From: {
              Name: "Tony Stark",
              Image: "phil_dunphy.jpg",
            },
            Message: "how r u?",
            CreatedAt: new Date(),
          },
        ],
      },
    ],
  };

  componentDidMount = () => {

    // Get Following
    if (this.props.appState.state.currentUser !== null) {
      axios
        .get(
          "/api/users/" +
            this.props.appState.state.currentUser._id +
            "/following"
        )
        .then((res) => {

          this.setState({
            friends: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });

      // Get the current user's conversations
      this.getUsersCoversations(true);
    } else {
      // Redirect to home
      this.props.history.push("/");
    }
  };

  getUsersCoversations = (setMessageOnDisplay) => {
    // Get the current user's conversations
    axios
      .get(
        "/api/conversations/user/" + this.props.appState.state.currentUser._id
      )
      .then((res) => {
        // console.log("users conversations", res.data);
        if (setMessageOnDisplay && res.data.length > 0) {
          // console.log(res.data);
          this.setState({
            messages: res.data,
            messageOnDisplay: res.data[0],
          });
          // Get From user
          const fromUser = this.renderFromUsersName();
          this.setState({
            messageOnDisplayFromUser: fromUser,
          });
        } else {
          this.setState({
            messages: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleMessageClick = (message) => {
    this.setState({
      messageOnDisplay: message,
      messageOnDisplayFromUser: this.renderFromUsersName(message),
    });
  };

  onMessageInputChange = (event) => {
    const value = event.target.value;
    this.setState({
      messageInput: value,
    });
  };

  handleSendClick = () => {
    // Send a message by creating a new message in the db and adding it to conversation
    const newMessage = {
      Text: this.state.messageInput,
      CreatedBy: this.props.appState.state.currentUser,
    };
    this.props.appState.setState({ loading: true }, () => {
      axios
        .post(
          "/api/conversations/" + this.state.messageOnDisplay._id,
          newMessage
        )
        .then((res) => {
          // console.log("res.data", res.data);
          // Set Message on display to this new conversation
          this.getUsersCoversations();
          this.setState({
            messageOnDisplay: res.data,
            messageInput: "",
          });

          // Stop loading animation
          this.props.appState.setState({
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.props.appState.setState({
            loading: false,
          });
        });
    });
  };

  // New Message modal
  handleNewMessageModalOpen = () => {
    this.setState({
      newMessageModalOpen: true,
    });
  };

  handleNewMessageModalClose = () => {
    this.setState({
      newMessageModalOpen: false,
    });
  };

  handleNewMessageUserInputChange = (event, value) => {
    this.setState({
      newMessageUser: value,
    });
  };

  handleCreateNewMessageClick = () => {
    // Check if conversation already exists
    const conversationExists = this.state.messages.filter(
      (m) =>
        m.Users[0]._id === this.state.newMessageUser._id ||
        m.Users[1]._id === this.state.newMessageUser._id
    );

    // Conversation exists, so switch message on display to that conversation
    if (conversationExists.length > 0) {
      this.setState({
        messageOnDisplay: conversationExists[0],
        newMessageModalOpen: false,
      });

      // Get From user
      const fromUser = this.renderFromUsersName();
      this.setState({
        messageOnDisplayFromUser: fromUser,
      });
    } else {
      // Otherwise Create conversation
      this.props.appState.setState({ loading: true }, () => {
        axios
          .post("/api/conversations/", {
            Users: [
              this.props.appState.state.currentUser,
              this.state.newMessageUser,
            ],
          })
          .then((res) => {
            // console.log("res.data", res.data);
            // Set Message on display to this new conversation
            this.getUsersCoversations();
            this.setState({
              messageOnDisplay: res.data,
              newMessageModalOpen: false,
            });

            // Get From user
            const fromUser = this.renderFromUsersName();
            this.setState({
              messageOnDisplayFromUser: fromUser,
            });

            // Stop loading animation
            this.props.appState.setState({
              loading: false,
            });
          })
          .catch((err) => {
            console.log(err);
            this.props.appState.setState({
              loading: false,
            });
          });
      });
    }
  };

  renderFromUsersName = (message = null) => {
    if (message !== null) {
      const fromUser = message.Users.filter(
        (u) => u._id !== this.props.appState.state.currentUser._id
      );

      return fromUser[0];
    } else {
      if (this.state.messageOnDisplay.Users !== undefined) {
        const fromUser = this.state.messageOnDisplay.Users.filter(
          (u) => u._id !== this.props.appState.state.currentUser._id
        );

        return fromUser[0];
      }
    }
  };

  renderMessageOnDisplay = () => {
    if (this.state.messageOnDisplay === undefined) {
      return <Paper className="messages-paper">No messages</Paper>;
    }
    return (
      <Paper className="messages-paper">
        <h2>Message</h2>
        <div className="from-user-container">
          <img
            className="from-user-image"
            src={
              this.state.messageOnDisplayFromUser !== null &&
              this.state.messageOnDisplayFromUser.Image !== null
                ? this.state.messageOnDisplayFromUser.Image
                : this.state.messageOnDisplayImage
            }
            alt={this.state.messageOnDisplayFromUser}
          />
          <div className="messageOnDisplay-from-user-name">
            {this.state.messageOnDisplayFromUser
              ? this.state.messageOnDisplayFromUser.Username
              : ""}
          </div>
        </div>
        <div className="all-messages">
          <MessagesWindow
            messageOnDisplay={this.state.messageOnDisplay}
            from={this.state.messageOnDisplayFromUser}
            currentUser={this.props.appState.state.currentUser}
            image={this.state.messageOnDisplayImage}
          />
        </div>
        <div className="write-message-container">
          <TextField
            multiline
            variant="outlined"
            name=""
            value={this.state.messageInput}
            placeholder="enter message..."
            className="write-message-input"
            rowsMax="2"
            onChange={this.onMessageInputChange}
          />
          <Button
            className="send-message-button"
            variant="contained"
            color="primary"
            onClick={() => this.handleSendClick()}
          >
            Send
          </Button>
        </div>
      </Paper>
    );
  };

  render() {
    return (
      <div className="messages-container">
        <div messages-toolbar>
          <Button
            variant="contained"
            className="new-message-button"
            onClick={this.handleNewMessageModalOpen}
            color="primary"
          >
            New Message
          </Button>
        </div>
        <Grid container spacing={3}>
          <Grid item xs className="hundred-height">
            <Paper className="messages-paper scroll">
              <h2>Your conversations</h2>
              <div>
                {this.state.messages.map((message) => (
                  <div
                    className="one-message"
                    key={uid(message)}
                    onClick={() => this.handleMessageClick(message)}
                  >
                    <Message
                      message={message}
                      // handleClick={this.handleMessageClick}
                      appState={this.props.appState}
                    />
                  </div>
                ))}
              </div>
            </Paper>
          </Grid>
          <Grid item xs={9} className="hundred-height">
            {this.renderMessageOnDisplay()}
          </Grid>
        </Grid>
        <div>
          <Modal
            open={this.state.newMessageModalOpen}
            onClose={this.handleNewMessageModalClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="new-message-modal"
          >
            <Card className="new-message-card">
              <CardContent>
                <Autocomplete
                  options={this.state.friends}
                  getOptionLabel={(option) => option.Username}
                  onChange={this.handleNewMessageUserInputChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Following"
                      variant="outlined"
                    />
                  )}
                />
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  className="create-new-message-button"
                  onClick={this.handleCreateNewMessageClick}
                >
                  Create New Message
                </Button>
              </CardActions>
            </Card>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(Messages);
