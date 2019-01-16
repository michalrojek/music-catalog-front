import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
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

class AddList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            listTitle: "",
            listDescription: "",
            messages: [],
            successMessage: ""
        }

        this.updateQuery = this.updateQuery.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    updateQuery(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "listTitle":
                this.setState({listTitle: evt.target.value});
                break;
            case "listDescription":
                this.setState({listDescription: evt.target.value});
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
            url: 'http://localhost:4000/lists/addList',
            data: {
                listTitle: this.state.listTitle,
                listDescription: this.state.listDescription,
            },
            dataType:'json',
            cache: false,
            success: function(response){
                if(response.errors) {
                    this.setState({messages: response.errors}, function() {
                        this.state.messages.map(function(value, index){
                        })
                    });
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, listTitle: '', listDescription: ''})
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }

    render(){
        let listTitleErrors = [], listDescriptionErrors = [];
        checkForErrors(listTitleErrors, this.state.messages, "listTitle");
        checkForErrors(listDescriptionErrors, this.state.messages, "listDescription")
                
        return (
            <Card className="container">
                <CardTitle title="Dodawanie listy" />
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="listTitle" value={this.state.listTitle} hintText="Nazwa listy" onChange={this.updateQuery}/><br/>
                    {listTitleErrors}
                    <TextField 
                        type="text" 
                        name="listDescription" 
                        value={this.state.listDescription} 
                        hintText="Opis listy" 
                        multiLine={true}
                        rows={5}
                        rowsMax={10}
                        onChange={this.updateQuery}/><br/>
                    {listDescriptionErrors}
                    <RaisedButton label="Dodaj listę" primary={true} style={style} onClick={this.handlePost}/>
                </form>
            </Card>
        )
    }

}

export default AddList;