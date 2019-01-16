import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import Auth from '../modules/Auth';

const style = {
    margin: 12,
};

function checkForErrors(errorsArray, arrayToCheck, valueToCheck) {
    arrayToCheck.map((value, index) => {
        if(value.param === valueToCheck) {
            errorsArray.push(<span className="error-message">{value.msg}</span>);
            errorsArray.push(<br/>);
        }
    })
}

class AddGenre extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            genreName: "",
            genreDescription: "",
            messages: [],
            successMessage: ""
        }

        this.updateQuery = this.updateQuery.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    updateQuery(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "genreName":
                this.setState({genreName: evt.target.value});
                break;
            case "genreDescription":
                this.setState({genreDescription: evt.target.value});
                break;
            default:
                break;
        }
    }

    handlePost(evt){
        evt.preventDefault();
        this.setState({messages: []});
        this.setState({successMessage: ''});
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/genres/addGenre',
            data: {
                genreName: this.state.genreName,
                genreDescription: this.state.genreDescription
            },
            dataType:'json',
            cache: false,
            success: function(response){
                if(response.errors) {
                    this.setState({messages: response.errors}, function() {
                        this.state.messages.map(function(value, index){
                            console.log(value)
                        })
                    });
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, genreName: '', genreDescription: ''})
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }

    render(){
        let genreNameErrors = [], genreDescriptionErrors = [];
        checkForErrors(genreNameErrors, this.state.messages, "genreName");
        checkForErrors(genreDescriptionErrors, this.state.messages, "genreDescription")
                
        return (
            <Card className="container">
            <CardTitle title="Dodawanie gatunku"/>
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="genreName" value={this.state.genreName} hintText="Nazwa gatunku" onChange={this.updateQuery}/><br/>
                    {genreNameErrors}
                    <TextField 
                        type="text" 
                        name="genreDescription" 
                        value={this.state.genreDescription} 
                        hintText="Opis gatunku" 
                        multiLine={true}
                        rows={5}
                        rowsMax={10}
                        onChange={this.updateQuery}/><br/>
                    {genreDescriptionErrors}
                    <RaisedButton label="Dodaj gatunek" primary={true} style={style} onClick={this.handlePost}/>
                </form>
            </Card>
        )
    }

}

export default AddGenre;