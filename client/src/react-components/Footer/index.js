import React, { Component } from "react";
import { AppBar } from "@material-ui/core";
import CopyrightIcon from "@material-ui/icons/Copyright";
import "./styles.css";

class Footer extends Component {
  state = {};
  render() {
    return (
      <AppBar
        position="fixed"
        color="primary"
        style={{ bottom: "0", top: "auto" }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "small",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 10px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "small",
              alignItems: "center",
            }}
          >
            <CopyrightIcon style={{ fontSize: "medium" }} />
            <p>2020 University of Toronto &nbsp;</p>
          </div>
          <p>
            {" "}
            <a
              href=""
              className="Footer-link"
            >
              Contact Us
            </a>
          </p>
        </div>
      </AppBar>
    );
  }
}

export default Footer;
