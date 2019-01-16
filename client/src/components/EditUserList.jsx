import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Score from './Score.jsx';
import Review from './AddReview.jsx';
import AddToUserList from './AddToUserList.jsx';
import Auth from '../modules/Auth';
import { Link, NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';

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

class EditUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataUrl: "",
            open: false,
            messages: [],
            successMessage: ""
        }

        this.getData = this.getData.bind(this);
        this.handleRemoveAlbum = this.handleRemoveAlbum.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    componentWillMount(){
        let newUrl = "http://localhost:4000" + this.props.match.path.replace(':','') + "/";
        this.setState({dataUrl: newUrl});
        this.getData();
    }

    getData(){
        console.log(this);
        let queryName = this.props.match.path
        queryName = queryName.substring(0, queryName.length - 5)
        queryName = queryName.substring(1, queryName.length)
        queryName = queryName + "Info"
        console.log(queryName)
        let newUrl = "http://localhost:4000/lists/my/id/"
        console.log(newUrl + this.props.match.params.id)
        $.ajax({
            url: newUrl + this.props.match.params.id,
            dataType:'json',
            cache: false,
            success: function(data){
              this.setState({data: data.listInfo}, function(){
                    console.log(data)
              });
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    handleRemoveAlbum = (albumId) => () => {
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:4000/lists/deleteFromList/'+ this.props.match.params.id + '/' + albumId,
            dataType:'json',
            cache: false,
            success: function(response){
                this.getData();
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
    }

    updateQuery(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "listTitle":
                let newTitle = Object.assign({}, this.state.data);
                newTitle.title = evt.target.value;
                this.setState({data: newTitle});
                break;
            case "listDescription":
                let newDescription = Object.assign({}, this.state.data);
                newDescription.description = evt.target.value;
                this.setState({data: newDescription});
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
            url: 'http://localhost:4000/lists/editList/' + this.props.match.params.id,
            data: {
                listTitle: this.state.data.title,
                listDescription: this.state.data.description,
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
                    this.setState({successMessage: response.successMessage})
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }

    handleOpen = () => {
        this.setState({open: true});
      };
    
      handleClose = () => {
        this.setState({open: false});
      };

      handleDelete = () => {
        this.setState({open: false});
        let newUrl = "http://localhost:4000/lists/id/";
        $.ajax({
            url: newUrl + this.props.match.params.id,
            type: 'DELETE',
            success: function(result) {
                this.props.history.push('/mylists')
            }.bind(this),
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
      };

    render() {
        let listTitleErrors = [], listDescriptionErrors = [];
        checkForErrors(listTitleErrors, this.state.messages, "listTitle");
        checkForErrors(listDescriptionErrors, this.state.messages, "listDescription")

        const actions = [
            <FlatButton
              label="Nie"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Tak"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleDelete}
            />,
          ];

        if(typeof this.state.data.title === "undefined") {
            return (
            <div>
                <div className="container">
                    <div className="text-center">
                        <h1>Brak danych do wyświetlenia</h1>
                    </div>
                </div>
                <hr />
            </div>
            );
        }
        return (
            <Card className="container">
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="listTitle" value={this.state.data.title} hintText="Nazwa listy" onChange={this.updateQuery}/><br/>
                    {listTitleErrors}
                    <TextField 
                        type="text" 
                        name="listDescription" 
                        value={this.state.data.description} 
                        hintText="Opis listy" 
                        multiLine={true}
                        rows={5}
                        rowsMax={10}
                        onChange={this.updateQuery}/><br/>
                    {listDescriptionErrors}
                    <RaisedButton label="Edytuj listę" primary={true} style={style} onClick={this.handlePost}/>
                </form>
                {this.state.data.albums.map(item =>
                            <div key={item._id}><Link to={{
                                pathname: '/albums/' + item._id,
                                state: {
                                    dataUrl: "http://localhost:4000" + this.props.match.path +"/id/"
                                }
                            }}>{item.name}</Link><RaisedButton label="-"  secondary={true} style={style} onClick={this.handleRemoveAlbum(item._id)}/></div>
                )}
                <RaisedButton label="Usuń listę" onClick={this.handleOpen} />
                <Dialog
                title="Czy na prawdę chcesz usunąc listę?"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                >
                </Dialog>
            </Card>
        );
    }
}


export default EditUserList;