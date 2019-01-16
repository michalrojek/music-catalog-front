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

class ArtistInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataUrl: "",
            albums: [],
            bands: [],
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
                console.log(data)
              this.setState({data: data[queryName], albums: data[queryName].albums, bands: data[queryName].bands}, function(){
                
              });
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
                this.props.history.push('/artists')
            }.bind(this),
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
      };

    render() {
        let birthDate = new Date(this.state.data.birthDate);

        let albumsDisplay = [];
        this.state.albums.map((element, index) => albumsDisplay.push(<div key={index}><Link to={{pathname:  '/albums/' + element._id}}>{element.name}</Link><br/></div>));
        let bandsDisplay = [];
        this.state.bands.map((element, index) => {
                if(element.endYear == 0) {
                    bandsDisplay.push(<div key={index}><Link to={{pathname:  '/bands/' + element._id}}>{element.name}</Link><br/></div>)
                } else {
                    bandsDisplay.push(<div key={index}><Link to={{pathname:  '/bands/' + element._id}}>{element.name}</Link> <span>{element.startYear} - {element.endYear}</span><br/></div>)
                }
            }
        );


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
                <CardTitle title={this.state.data.fullName}/>
                {Auth.isUserAdmin() || Auth.isUserModerator() ? (<RaisedButton style={buttons} label="Usuń artystę" onClick={this.handleOpen} />) : (<div></div>)}
                <h4>Data urodzenia: </h4><span>{birthDate.getDate()}.{birthDate.getMonth() + 1}.{birthDate.getUTCFullYear()}</span><br/>
                <h4>Kraj pochodzenia: </h4><span>{this.state.data.birthPlace}</span><br/>
                <h4>Solowe albumy: </h4>{albumsDisplay}<br/>
                <h4>Zespoły: </h4>{bandsDisplay}<br/>
                <Dialog
                title="Czy na prawdę chcesz usunąć artystę?"
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


export default ArtistInfoPage;