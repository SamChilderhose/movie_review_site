import { Button } from "@material-ui/core";
import React, { Fragment } from "react";
import "./styles.css";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

class AddTicket extends React.Component {
  state = {
    userProfile: this.props.UserProfile,
    currentUser: this.props.currentUser,
    createdByUser: null,
    ticket: {
      title: "",
      author: "",
      content: "",
      status: "",
      posttime: null,
    },

    redirect: (
      <Redirect to={{ pathname: "/", currentUser: this.props.currentUser }} />
    ),
  };


  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    let newTicket = this.state.ticket;
    newTicket[nam] = val;
    this.setState({ ticket: newTicket });
  };

  handleSubmit() {
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Ticket Submitted to Admin</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Ticket Submission Failed</p>
      </div>
    );
    let finalTicket = this.state.ticket;
    try{
      finalTicket.author = this.state.currentUser.Username;
      finalTicket.status = "ongoing";
      finalTicket.posttime = new Date();
      this.setState({ ticket: finalTicket });
      console.log("submitting ticket:",this.state.ticket);
      axios
        .post("/api/ticket/",this.state.ticket)
        .then((res) => {
          console.log("submitted:", res.data);
          this.props.appState.handleOpenSnackbarMessage(
            "success",
            successMessage
          );
          const empty ={
            title: "",
            author: "",
            content: "",
            status: "",
            posttime: null,
          }
          this.setState({ ticket: empty });
        })
        .catch((error) => {
        console.error("error", error);
        this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        const empty ={
          title: "",
          author: "",
          content: "",
          status: "",
          posttime: null,
        }
        this.setState({ ticket: empty });
        });
      }catch{
        this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
        const empty ={
          title: "",
          author: "",
          content: "",
          status: "",
          posttime: null,
        }
        this.setState({ ticket: empty });
    }
    
  }

  handleCancel = () => {
    console.log("Cancelling");
  };

  render() {
    return (
      <Fragment>
        <br />
        <br />
        <div className="centerDiv">
          <h1> Submit a Ticket to Admin of the Site </h1>
          <form className="centerForm">
            <p> Title </p>
            <input
              type="text"
              name="title"
              id="titleInput"
              value={this.state.ticket.title}
              onChange={this.handleChange}
            />
            <br />
            <br />

            <p> Description </p>
            <textarea
              id="DescriptionInput"
              className="textBox"
              rows="6"
              cols="80"
              name="content"
              value={this.state.ticket.content}
              onChange={this.handleChange}
            ></textarea>
            <br />
            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleSubmit()}
            >
              {" "}
              Submit{" "}
            </Button>
            <div class="divider"></div>
            <Link to={"./../"}>
              <Button variant="contained" color="secondary">
                Cancel{" "}
              </Button>
            </Link>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default AddTicket;
