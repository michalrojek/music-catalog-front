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

class AddArtist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            artistName: "",
            artistSurname: "",
            artistCountry: "",
            artistBrith: "",
            artistPseudonym: "",
            messages: [],
            successMessage: ""
        }

        this.updateQuery = this.updateQuery.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    updateQuery(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "artistName":
                this.setState({artistName: evt.target.value});
                break;
            case "artistPseudonym":
                this.setState({artistPseudonym: evt.target.value});
                break;
            case "artistSurname":
                this.setState({artistSurname: evt.target.value});
                break;
            case "artistCountry":
                this.setState({artistCountry: evt.target.value});
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
            url: 'http://localhost:4000/artists/addArtist',
            data: {
                artistName: this.state.artistName,
                artistPseudonym: this.state.artistPseudonym,
                artistSurname: this.state.artistSurname,
                artistCountry: this.state.artistCountry,
                artistBirth: this.state.artistBrith 
            },
            dataType:'json',
            cache: false,
            success: function(response){
                console.log(response)
                if(response.errors) {
                    this.setState({messages: response.errors}, function() {
                        this.state.messages.map(function(value, index){
                            console.log(value)
                        })
                    });
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, artistName: '', artistPseudonym: '', artistSurname: '', artistCountry: '', artistBirth: {}})
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }

    updateDate(evt, value){
        this.setState({artistBrith: value});
    }

    render(){
        let artistNameErrors = [], artistSurnameErrors = [], artistCountryErrors = [], artistBirthErrors =[];
        checkForErrors(artistNameErrors, this.state.messages, "artistName");
        checkForErrors(artistSurnameErrors, this.state.messages, "artistSurname")
        checkForErrors(artistCountryErrors, this.state.messages, "artistCountry")
        checkForErrors(artistBirthErrors, this.state.messages, "artistBirth")
                
        return (
            <Card className="container">
                <CardTitle title="Dodawanie artysty"/>
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="artistName" value={this.state.artistName} hintText="Imię" onChange={this.updateQuery}/><br/>
                    {artistNameErrors}
                    <TextField type="text" name="artistPseudonym" value={this.state.artistPseudonym} hintText="Pseudonim" onChange={this.updateQuery}/><br/>
                    <TextField type="text" name="artistSurname" value={this.state.artistSurname} hintText="Nazwisko" onChange={this.updateQuery}/><br/>
                    {artistSurnameErrors}
                    <TextField type="text" name="artistCountry" value={this.state.artistCountry} hintText="Kraj pochodzenia" onChange={this.updateQuery}/><br/>
                    {artistCountryErrors}
                    <DatePicker name="artistBirth" value={this.state.artistBrith} hintText="Data urodzenia" onChange={this.updateDate} /><br/>
                    {artistBirthErrors}
                    <RaisedButton label="Dodaj artystę" primary={true} style={style} onClick={this.handlePost}/>
                </form>
            </Card>
        )
    }

}

export default AddArtist;