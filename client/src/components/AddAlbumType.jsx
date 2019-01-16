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

class AddAlbumType extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            albumTypeName: "",
            albumTypeDescription: "",
            messages: [],
            successMessage: ""
        }

        this.updateQuery = this.updateQuery.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    updateQuery(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "albumTypeName":
                this.setState({albumTypeName: evt.target.value});
                break;
            case "albumTypeDescription":
                this.setState({albumTypeDescription: evt.target.value});
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
            url: 'http://localhost:4000/albumtypes/addAlbumType',
            data: {
                albumTypeName: this.state.albumTypeName,
                albumTypeDescription: this.state.albumTypeDescription
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
                    this.setState({successMessage: response.successMessage, albumTypeName: '', albumTypeDescription: ''})
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }

    render(){
        let albumTypeNameErrors = [], albumTypeDescriptionErrors = [];
        checkForErrors(albumTypeNameErrors, this.state.messages, "albumTypeName");
        checkForErrors(albumTypeDescriptionErrors, this.state.messages, "albumTypeDescription")
                
        return (
            <Card className="container">
            <CardTitle title="Dodawanie typu albumu"/>
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="albumTypeName" value={this.state.albumTypeName} hintText="Nazwa typu albumu" onChange={this.updateQuery}/><br/>
                    {albumTypeNameErrors}
                    <TextField 
                        type="text" 
                        name="albumTypeDescription" 
                        value={this.state.albumTypeDescription} 
                        hintText="Opis typu albumu" 
                        multiLine={true}
                        rows={5}
                        rowsMax={10}
                        onChange={this.updateQuery}/><br/>
                    {albumTypeDescriptionErrors}
                    <RaisedButton label="Dodaj typ albumu" primary={true} style={style} onClick={this.handlePost}/>
                </form>
            </Card>
        )
    }

}

export default AddAlbumType;