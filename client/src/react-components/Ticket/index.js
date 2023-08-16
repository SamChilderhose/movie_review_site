
import React from "react";
import "./styles.css";


class ShowTicket extends React.Component {
    render() {
        const { author, title, content} = this.props;
        return(
            <div className="ticketPanel">
                <p>Author: { author } </p>
                <p>Post: { title } </p>
                <p>Content: { content } </p>
                <button className="approvalButton" onClick={() => console.log("Solved")}> Solved </button>
                <hr/>
            </div>
        );
    }
}   

export default ShowTicket;