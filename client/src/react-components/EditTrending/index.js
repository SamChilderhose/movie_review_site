
import { Button } from "@material-ui/core";
import React, {  Fragment } from "react";
import "./styles.css";
import TextField from "@material-ui/core/TextField";
import { uid } from "react-uid";
import { toDateString } from "../../actions/app-actions";
import { Link } from "react-router-dom";
import axios from "axios";
class EditTrending extends React.Component {


    constructor(props) {
        super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
        
        this.state = { //state is by default an object
            userProfile: props.UserProfile,
            trendingMovies: props.trendingMovies,
           searchInput:"",
           searchResults:[],
           initTrends:null,
           origintrends:props.trendingMovies,
           newtrendingMovies:[]
        }
     }

    renderTableHeader() {
        let header = Object.keys(this.state.trendingMovies[0])
        return header.map((key, index) => {
           return <th key={index}>{key.toUpperCase()}</th>
        })
     };

    renderTableData() {
        return this.state.trendingMovies.map((trend, index) => {
           const { Rating, Trending, Likes, Id, Name,  Description, Image, ReleaseDate, Director, Stars, Genre, _V } = trend 
           return (
              <tr key={Id} className='trends'>
                 <td>{Rating}</td>
                 <td>{"Currently Trending"}</td>
                 <td>{Likes}</td>
                 <td>{"Masking database _id"}</td>
                 <td>{Name}</td>
                 <td>{Description.substring(0,70)}</td>
                 <td>{Image.substring(0,70)}</td>
                 <td>{toDateString(ReleaseDate)}</td>
                 <td>{Director}</td>
                 <td>{Stars.substring(0,70)}</td>
                 <td>{Genre.substring(0,70)}</td>
                 <td>{_V}</td>
                 <td><Button color="primary" onClick={() => this.handleDelete(trend)}> Remove from Trends </Button> </td>
              </tr>
           )
        })
     };

    onSearchInputChange = (event) => {
        const value = event.target.value.toLowerCase();
        this.setState({
          searchInput: value,
        });
    };
      
    filterMovieList = () => {
        console.log("this.state.searchInput", this.state.searchInput);
        let newMovieList = this.props.movies.filter((movie) =>
          movie.Name.toLowerCase().includes(this.state.searchInput)
        );
        this.setState({
          searchResults: newMovieList,
          noOfPages: Math.ceil(newMovieList.length / this.state.itemsPerPage),
        });
    };

    handleAdd = (result) => {
        const successMessage = (
            <div>
              <h2>Success</h2>
              <p>Trending List Updated</p>
            </div>
          );
          const errorMessage = (
            <div>
              <h2>Something went wrong</h2>
              <p>Trending List Update Failed</p>
            </div>
          );
        let newTrendingMovies = this.state.trendingMovies;
        newTrendingMovies.push(result);
        this.setState({
            trendingMovies: newTrendingMovies   
        })
        console.log("adding trending:",result)
        axios
              .patch("/api/movietrend/"+result._id)
              .then((res) => {
                console.log("new trending film added:", res.data);
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

    handleDelete (trend) {
        const successMessage = (
            <div>
              <h2>Success</h2>
              <p>Trending List Updated</p>
            </div>
          );
          const errorMessage = (
            <div>
              <h2>Something went wrong</h2>
              <p>Trending List Update Failed</p>
            </div>
          );
        const newTrendingMovies = this.state.trendingMovies.filter(tm => tm !== trend)
        this.setState({
            trendingMovies: newTrendingMovies 
        })
        console.log("remove trending:", trend)
        axios
            .patch("/api/movienotrend/"+trend._id)
            .then((res) => {
              console.log("stopped trending film:", res.data);
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

    handleCancel = () => {
        console.log("canceling...");
        console.log(this.state.trendingMovies);
        console.log(this.props.trendingMovies);
    };

    render (){
        return(

            <Fragment>
            <br/>
            <br/>
            <div className='center'>
                <h1 id='title'>Current Trending Movies</h1>
                <table id='trendings'>
                    <tbody>
                        <tr className='trends'>
                            {this.renderTableHeader()}
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
                <div >
                {/* <Button variant="contained" color="primary" onClick={() => this.handleUpdateTrending()}> Update Trending List </Button> */}
                <Link  to={"./../AdminDashboard"}>
                  <Button variant="contained" color="secondary" onClick={() => this.handleCancel()}> Return to Dashboard </Button>
                </Link> 
                </div>
                <hr />
            </div>
            <div className="centerDiv">
            <form id="formA">
                <h1 id='title'>Search Movie Title Here</h1>
                <div className="search-container">
                <TextField
                    variant="outlined"
                    name="searchInput"
                    defaultValue={this.state.searchInput}
                    label="search"
                    className="search-input"
                    margin="normal"
                    onChange={this.onSearchInputChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.filterMovieList} >
                    search
                </Button>
                <br />  
                </div>
            </form>

            <div>
                {this.state.searchResults.map((result) => 
                    <div key={uid(result)}>
                        {result.Name}
                        <Button color="primary" 
                                onClick={() => this.handleAdd(result)}>Add</Button>
                    </div>)}
            </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />         

            
            </Fragment>
        );
        
    }




}
export default EditTrending