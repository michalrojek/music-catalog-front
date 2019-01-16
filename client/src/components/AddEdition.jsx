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

class AddEdition extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            editionName: "",
            editionDescription: "",
            messages: [],
            successMessage: ""
        }

        this.updateQuery = this.updateQuery.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    updateQuery(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "editionName":
                this.setState({editionName: evt.target.value});
                break;
            case "editionDescription":
                this.setState({editionDescription: evt.target.value});
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
            url: 'http://localhost:4000/editions/addEdition',
            data: {
                editionName: this.state.editionName,
                editionDescription: this.state.editionDescription
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
                    this.setState({successMessage: response.successMessage, editionName: '', editionDescription: ''})
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }

    render(){
        let editionNameErrors = [], editionDescriptionErrors = [];
        checkForErrors(editionNameErrors, this.state.messages, "editionName");
        checkForErrors(editionDescriptionErrors, this.state.messages, "editionDescription")
                
        return (
            <Card className="container">
            <CardTitle title="Dodawanie wydania"/>
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="editionName" value={this.state.editionName} hintText="Nazwa wydania" onChange={this.updateQuery}/><br/>
                    {editionNameErrors}
                    <TextField 
                        type="text" 
                        name="editionDescription" 
                        value={this.state.editionDescription} 
                        hintText="Opis wydania" 
                        multiLine={true}
                        rows={5}
                        rowsMax={10}
                        onChange={this.updateQuery}/><br/>
                    {editionDescriptionErrors}
                    <RaisedButton label="Dodaj wydanie" primary={true} style={style} onClick={this.handlePost}/>
                </form>
            </Card>
        )
    }

}

export default AddEdition;