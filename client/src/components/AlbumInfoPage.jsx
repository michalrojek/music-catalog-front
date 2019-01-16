import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Score from './Score.jsx';
import Review from './AddReview.jsx';
import AddToUserList from './AddToUserList.jsx';
import { Link, NavLink } from 'react-router-dom';
import Auth from '../modules/Auth';

const buttons = {
    margin: 10
}

class AlbumInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataUrl: "",
            genres: [],
            editions: [],
            tracks: [],
            open: false
        }

        this.getData = this.getData.bind(this);
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
        let newUrl = "http://localhost:4000" + this.props.match.path.replace(':','') + "/";
        console.log(newUrl + this.props.match.params.id)
        $.ajax({
            url: newUrl + this.props.match.params.id,
            dataType:'json',
            cache: false,
            success: function(data){
              this.setState({
                    data: data[queryName], 
                    genres: data[queryName].genres, 
                    editions: data[queryName].editions, 
                    tracks: data[queryName].tracks
                });
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
        $.ajax({
            url: "http://localhost:4000/scores/average/" + this.props.match.params.id,
            dataType:'json',
            cache: false,
            success: function(data){
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    handleOpen = () => {
        this.setState({open: true});
      };
    
      handleClose = () => {
        this.setState({open: false});
      };

      handleDelete = () => {
        this.setState({open: false});
        let newUrl = "http://localhost:4000" + this.props.match.path.replace(':','') + "/";
        $.ajax({
            url: newUrl + this.props.match.params.id,
            type: 'DELETE',
            success: function(result) {
                this.props.history.push('/albums')
            }.bind(this),
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
      };

    render() {
        let linkToArtist = <Link to='/albums'></Link>;
        if(this.state.data.authorType === "band") {
            linkToArtist = <Link to={{pathname:  '/bands/' + this.state.data.idArtist}}>{this.state.data.author}</Link>
        } else {
            linkToArtist = <Link to={{pathname:  '/artists/' + this.state.data.idArtist}}>{this.state.data.author}</Link>
        }

        let genresDisplay = [];
        this.state.genres.map((element, index) => genresDisplay.push(<span key={index}>{element}; </span>));
        let editionsDisplay = [];
        this.state.editions.map((element, index) => editionsDisplay.push(<span key={index}>{element}; </span>));
        let tracksDisplay = [];
        this.state.tracks.map((element, index) => tracksDisplay.push(<div key={index}><span>{index + 1}. {element.trackName}   {element.trackDurationMin}min {element.trackDurationSec}sec </span><br/></div>));

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

        return (
            <Card className="container">
                <CardTitle title={this.state.data.name}/>
                <span>Album stworzny przez {linkToArtist}</span><br/>
                {Auth.isUserAdmin() || Auth.isUserModerator() ? (<RaisedButton style={buttons} label="Usuń album" onClick={this.handleOpen} />) : (<div></div>)}
                <h4>Gatunki: </h4>{genresDisplay}<br/>
                <h4>Typ albumu: </h4><span>{this.state.data.albumType}</span><br/>
                <h4>Wydania albumu: </h4>{editionsDisplay}<br/>
                <h4>Data wydania: </h4><span>{this.state.data.releaseDate}</span><br/>
                <h4>Długość: </h4><span>{this.state.data.length}</span><br/>
                <h4>Piosenki: </h4>{tracksDisplay}<br/>
                <Dialog
                title="Czy na prawdę chcesz usunąć album?"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                >
                </Dialog>
                <Score albumId={this.props.match.params.id}/><br/>
                <AddToUserList albumId={this.props.match.params.id}/>
                <Review albumId={this.props.match.params.id}/><br/>
            </Card>
        );
    }
}


export default AlbumInfoPage;