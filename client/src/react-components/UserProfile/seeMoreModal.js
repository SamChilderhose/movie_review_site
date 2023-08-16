import React, { Component } from "react";
import Modal from '@material-ui/core/Modal';
import { Button } from "@material-ui/core";
import SideDetailsCard from "./sideDetailsCard"
import "./styles.css";


class SeeMoreModal extends Component {
  state = {
    list: this.props.list,
    modalName: this.props.modalName,
    show: false
  }

  showPopUp = (event) => {
    this.setState({ 
      show: true
    })
  }

  closePopUp = (event) => {
    this.setState({ 
      show: false
    })
  }

  render() {
    return(
      <div>
        <Button className="profileBtn" onClick={this.showPopUp}>
          See More
        </Button>

          <Modal
            data-backdrop="true"
            open={this.state.show}
            onClose={this.closePopUp}
          >
            <div className="seeMoreModalContainer">
              <h2 className="centerText">All {this.state.modalName} </h2>
              <br />
              <SideDetailsCard
                list={this.props.list} 
                showAll={true}
              />

              <div className="centerModalBtn"> 
              <Button className="centerText profileBtn" onClick={this.closePopUp}> close </Button>
              </div>
             </div>
          </Modal>
      </div>
    )
  }
}

export default SeeMoreModal