import { Button } from "@material-ui/core";
import React from "react";
import "./styles.css";
import { toDateString } from "../../actions/app-actions";
import { Link } from "react-router-dom";
import ProfileSideDisplay from "../UserProfile/profileSideDisplay";
import axios from "axios";
import { withRouter } from "react-router-dom";

class AdminDashboard extends React.Component {
  state = {
    tickets: [],
    ticketCountOngoing: "fetching data...",
    reviewCount: "fetching data...",
  };

  componentDidMount() {
    //"/api/users/admin/auth"
    // Check if user is authorized to view admin
    axios
      .get("/api/users/admin/auth")
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error", error);
        this.props.history.push("/");
      });

    this.getOngoingTicketsNum();
    this.getTodayReivewsNum();
  }

  getOngoingTicketsNum() {
    axios
      .get("/api/ongoingtickets")
      .then((res) => {
        console.log("OngoingTickets: ", res.data.length);
        if (res.data.length > 0) {
          this.setState({
            tickets: res.data,
            ticketCountOngoing: res.data.length,
          });
          return res.data.length;
        } else {
          this.setState({ ticketCountOngoing: 0 });
          return 0;
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
    setTimeout(function () {}, 5000);
  }

  getTodayReivewsNum() {
    //var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    axios
      .get("/api/reviews")
      .then((res) => {
        console.log("TotalReviews: ", res.data.reviews.length);
        if (res.data.reviews.length > 0) {
          this.setState({ reviewCount: res.data.reviews.length });
        } else {
          this.setState({ reviewCount: 0 });
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
    setTimeout(function () {}, 5000);
  }

  handleSolve = (aTicket) => {
    let otherTickets = this.state.tickets.filter((tt) => tt !== aTicket);
    console.log(aTicket);
    let solvedTicket = this.state.tickets.filter((tt) => tt === aTicket);
    solvedTicket[0].status = "solved";
    otherTickets.push(solvedTicket[0]);
    this.setState({
      otherTickets,
    });
    const successMessage = (
      <div>
        <h2>Success</h2>
        <p>Ticket Solved, Hiding Sovled Ticket...</p>
      </div>
    );
    const errorMessage = (
      <div>
        <h2>Something went wrong</h2>
        <p>Ticket Update Failed</p>
      </div>
    );

    axios
      .patch("/api/ticket/" + aTicket._id)
      .then((res) => {
        console.log("solved:", res.data);
        this.props.appState.handleOpenSnackbarMessage(
          "success",
          successMessage
        );
      })
      .catch((error) => {
        console.error("error", error);
        this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
      });
  };

  /*handleSolve(){
        let nam = event.target.name;
        let val = event.target.value;
        let newMovie = this.state.movie;
        newMovie[nam] = val;
        this.setState({movie:newMovie}); 
      };*/

  renderTicket() {
    // axios
    //   .get("/api/ongoingtickets")
    //   .then((res) => {
    //     this.setState({ tickets: res.data });
    //   })
    //   .catch((error) => {
    //     console.error("error", error);
    //   });
    return this.state.tickets.map((aTicket, index) => {
      const { Author, Posttime, Title, Content, Status } = aTicket;
      let statusColor = Status === "ongoing" ? "orange" : "green";
      return (
        <div className="ticketPanel" key={index}>
          <p>
            {" "}
            <span className="ticketHeader"> Poster: </span> {Author}{" "}
          </p>
          <p>
            {" "}
            <span className="ticketHeader"> Originally posted on: </span>{" "}
            {toDateString(Posttime)}{" "}
          </p>
          <p>
            {" "}
            <span className="ticketHeader"> Ticket subject: </span> {Title}{" "}
          </p>
          <p>
            {" "}
            <span className="ticketHeader"> Content: </span> {Content}{" "}
          </p>
          <p>
            {" "}
            <span className="ticketHeader"> Status: </span>{" "}
            <span className={statusColor}> {Status} </span>{" "}
          </p>
          <Button color="primary" onClick={() => this.handleSolve(aTicket)}>
            {" "}
            Solved{" "}
          </Button>
          <hr className="topMargin10px" />
        </div>
      );
    });
  }

  render() {
    // this.getOngoingTicketsNum();
    // this.getTodayReivewsNum();
    return (
      <div className="generalHolder">
        <div>
          <div className="moviesManagementContainer">
            <h2>Website Management Panel</h2>
            <Link to={"./../AddMovie"}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log("Add Movie")}
              >
                Add Movie
              </Button>
            </Link>
            <div class="divider"></div>
            <Link to={"./../EditMovie"}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log("Edit Movie")}
              >
                Edit Movie
              </Button>
            </Link>
            <div class="divider"></div>
            <Link to={"./../EditTrending"}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log("Edit Trending")}
              >
                Edit Trending
              </Button>
            </Link>
          </div>

          <div className="dashboardDisplayCotainer">
            <div className="dashboardPanel">
              <h3>Ongoing Tickets</h3>
              <p>{this.state.ticketCountOngoing}</p>
            </div>
            <div className="dashboardPanel">
              <h3>Total Reviews</h3>
              <p>{this.state.reviewCount}</p>
            </div>
          </div>

          <div className="ticketsContainer">
            <h2>Tickets</h2>
            <hr />
            {this.renderTicket()}
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(AdminDashboard);
