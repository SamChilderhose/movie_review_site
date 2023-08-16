import React, { Component } from "react";
import "./styles.css";
import { Link } from "react-router-dom";


class SideDetailsCard extends Component {
  state = {
    list: this.props.list,
    showAll: this.props.showAll
  }


  createUserCard = (profileImg, profileName, profileId) => {
    return (
      <div> 
        <img className="miniProfilePic" src={profileImg
                  ? profileImg
                  : require(`../../images/avatar.png`).default} alt="" />
        <div className="miniProfileText"> 
          <a href={"/userprofile/" + profileId} > { profileName } </a>
        </div>
        <br/>
        <br/>
      </div>
    )
  }

  generateProfileCards(list) {
    const result = []
    if (list.length >= 1) {
      result.push(
        <div> 
          { this.createUserCard( list[0].profileIcon, list[0].name, list[0].userId) } 
        </div>)
    } if (list.length >= 2) {
      result.push(
        <div> 
          { this.createUserCard( list[1].profileIcon, list[1].name, list[1].userId) } 
        </div>)
    } if (list.length >= 3) {
      result.push(
      <div> 
        { this.createUserCard( list[2].profileIcon, list[2].name, list[1].userId) } 
      </div>)
    } 
    return (result)
  }

  displayMiniProfiles = (list) => {
    return this.generateProfileCards(list)
  }

  displayAllMiniProfiles = (list) => {
    const result = []
    for (let i = 0; i < list.length; i++) {
      result.push(
        <div className="inlineBlockElement"> 
          <div className="inlineBlockElement"> { this.createUserCard( list[i].profileIcon, list[i].name, list[i].userId) } </div>
        </div>)
    }
    return result
  }

  render() {
    if (!this.state.showAll) {
      return(
        <div> 
          {this.displayMiniProfiles(this.state.list)}
        </div>
      )
    } else {
      return(
        <div>
          {this.displayAllMiniProfiles(this.state.list)}
        </div>
      )
    }
  }

}

export default SideDetailsCard