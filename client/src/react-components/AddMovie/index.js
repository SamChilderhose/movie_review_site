
import { Button } from "@material-ui/core";
import React, { Fragment } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import axios from "axios";

class AddMovie extends React.Component {

    state = {
        userProfile: {},
        imageToUpload: null,
        movie: {
            Name: "",
            Image: "",
            Description:"",
            ReleaseDate: null,
            Director: "",
            Stars: "",
            Genre: "",
        }
    }


    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        let newMovie = this.state.movie;
        newMovie[nam] = val;
        this.setState({movie:newMovie});
        
      };

      handleImgChange = (event) => {
        let val = event.target.files[0];
        let newImg = this.state.imageToUpload;
        newImg = val;
        this.setState({imageToUpload:newImg});
      };

      handleSubmit(){
        const successMessage = (
          <div>
            <h2>Success</h2>
            <p>New Movie Entry Created</p>
          </div>
        );
        const errorMessage = (
          <div>
            <h2>Something went wrong</h2>
            <p>Movie Was Not Created</p>
          </div>
        );
        let form = new FormData();
        form.append("file", this.state.imageToUpload);
        // console.log(this.state.imageToUpload);
        axios
          .post("/api/images", form)
          .then((res) => {
            let newMovie = this.state.movie;
            newMovie.Image = res.data.ImageUrl;
            this.setState({movie:newMovie});
            console.log("Added Image:", this.state.movie)
            axios
              .post("/api/movies/",this.state.movie)
              .then((res) => {
                console.log("Added", res.data);
                this.setState({
                  movie: res.data,
                });
            this.props.appState.handleOpenSnackbarMessage(
              "success",
              successMessage
            );
            const empty = {
              Name: "",
              Image: "",
              Description:"",
              ReleaseDate: null,
              Director: "",
              Stars: "",
              Genre: "",
            }
            this.setState({
              movie: empty,
            });
            console.log("emtpying this.state.movie:",this.state.movie)
          })
          .catch((error) => {
            console.error("error", error);
            this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
          }); 
          })
          .catch((error) => {
            console.error("error", error);
            this.props.appState.handleOpenSnackbarMessage("error", errorMessage);
          });
        
         
      };

      handleCancel = () => {
        console.log("Cancelling");     
      };

    render (){
        return(

            <Fragment>

            <div className='centerDiv'>
            <form className='center'> 
            <br/>
                <br/>
                <h1> Adding a Movie Entry</h1>
                <br/>
                <p> Movie Title </p> 
                
                <input type="text" name='Name' id="titleInput" 
                  value={this.state.movie.Name} onChange={this.handleChange}/>
                <br/>
                <br/>

                <p> Description </p>
                <textarea name='Description' id="DescriptionInput" className="textBox" rows="6" cols="80" 
                  value={this.state.movie.Description} onChange={this.handleChange}>         
                </textarea>  
                <br/>
                <br/>

                <p> Release Date </p>
                <input type="date" name='ReleaseDate' id="ReleaseInput" 
                  onChange={this.handleChange}/>
                <br />
                <br />

                <p> Genre </p>
                <input type="tetxt" name='Genre' id="GenerInput" 
                  value={this.state.movie.Genre} onChange={this.handleChange}/>
                <br />
                <br />

                <p> Director(s) </p>
                <input type="tetxt"  name='Director' id="ReleaseInput" 
                  value={this.state.movie.Director} onChange={this.handleChange}/>
                <br />
                <br />

                <p> Stars </p>
                <input type="tetxt" name='Stars' id="StarsInput" 
                  value={this.state.movie.Stars} onChange={this.handleChange}/>
                <br />
                <br />

                <p> Upload Poster </p>
                <input type="file" name='Image' id="imgInput"  accept="image/*"
                  onChange={this.handleImgChange}/>
                <br />
                <br />
                
                <Button  className="addmoviebutton" variant="contained" color="primary" onClick={() => this.handleSubmit()}> Submit </Button>
                <div class="divider"></div>
                <Link  to={"./../AdminDashboard"}>
                  <Button className="addmoviebutton" variant="contained" color="secondary" onClick={() => this.handleCancel()}> Cancel </Button>                 
                </Link>
                
            </form>
            </div>
            
            </Fragment>
        );
        
    }




}

export default AddMovie