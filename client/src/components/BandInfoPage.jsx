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
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import Auth from '../modules/Auth';

const buttons = {
    margin: 10
}

const padding = {
    paddingLeft: 12,
    paddingRight: 12
}

class BandInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataSource: [],
            dataUrl: "",
            albums: [],
            members: [],
            messages: [],
            successMessage: '',
            open: false,
            addmember: false,
            newMember: '',
            newMemberStartDate: '',
            newMemberEndDate: '',
            adddate: false
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
              this.setState({data: data[queryName], albums: data[queryName].albums, members: data[queryName].members}, function(){
                
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

      openAddingDialog = () => {
        this.setState({addmember: true});
      };
    
      closeAddingDialog = () => {
        this.setState({addmember: false});
      };

      openDateDialog = () => {
        this.setState({adddate: true});
      };
    
      closeDateDialog = () => {
        this.setState({adddate: false});
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

      handleAddingMember = () => {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/bands/addMember/' + this.props.match.params.id,
            data: {
                memberName: this.state.newMember,
                memberStartDate: this.state.newMemberStartDate,
                memberEndDate: this.state.newMemberEndDate,
            },
            dataType:'json',
            cache: false,
            success: function(response){
                console.log(response)
                if(response.errors) {
                    console.log(response.errors)
                    this.setState({messages: response.errors.map((element) => {return <span><span className="error-message">{element.msg}</span><br/></span>})}, function() {

                    });
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, addmember: false, newMember: '', newMemberStartDate: '', newMemberEndDate: ''});
                    this.getData();
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
      };

      handleAddingEndDate = (evt, idArtist) => {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/bands/memberEndDate/' + this.props.match.params.id + '/' + idArtist,
            data: {
                memberEndDate: this.state.newMemberEndDate,
            },
            dataType:'json',
            cache: false,
            success: function(response){
                console.log(response)
                if(response.errors) {
                    this.setState({messages: response.errors}, function() {

                    });
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, adddate: false, newMemberEndDate: ''});
                    this.getData();
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
      };

      handleInputUpdate(value, dataSource, params){
        this.setState({ newMember: value });

        $.ajax({
            url: "http://localhost:4000/artists/search/query?searchArtist=" + value + "&page=1",
            dataType:'json',
            cache: false,
            success: function(data){
                let artistsNames = data.artists.map(element => element.name);
                this.setState({dataSource: artistsNames});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    handleShareholderNameChange = (evt) => {
        evt.preventDefault();
        switch(evt.target.name) {
            case "membersDate":
                this.setState({newMemberStartDate: evt.target.value});
                break;
            case "membersEndDate":
                this.setState({newMemberEndDate: evt.target.value});
                break;
            default:
                break;
        }
    }

    render() {
        let birthDate = new Date(this.state.data.birthDate);

        let albumsDisplay = [];
        this.state.albums.map((element, index) => albumsDisplay.push(<div key={index}><Link to={{pathname:  '/albums/' + element._id}}>{element.name}</Link><br/></div>));
        let membersDisplay = [];
        this.state.members.map((element, index) => {
                if(element.endYear == 0) {
                    membersDisplay.push(
                    <div key={index}><Link to={{pathname:  '/artists/' + element._id}}>{element.name}</Link> <span>{element.startYear} - teraz</span> 
                        {Auth.isUserAdmin() || Auth.isUserModerator() ? ( <span><RaisedButton style={buttons} label="Dodaj rok zakończenia współpracy" onClick={this.openDateDialog} />
                    <Dialog
                        title="Podaj rok zakończenia współpracy."
                        actions={[<FlatButton
                            label="Zamknij"
                            primary={true}
                            onClick={this.closeDateDialog}
                          />,
                          <FlatButton
                            label="Dodaj"
                            primary={true}
                            keyboardFocused={true}
                            onClick={(evt) => this.handleAddingEndDate(evt, element._id)}
                          />]}
                        modal={false}
                        open={this.state.adddate}
                        onRequestClose={this.closeDateDialog}
                    >
                    <TextField type="number" value={this.state.newMemberEndDate} name="membersEndDate" style={padding} hintText='Rok odejścia' onChange={this.handleShareholderNameChange}/>
                    </Dialog><br/> </span>) : (<div> </div> )}
                    </div>)
                } else {
                    membersDisplay.push(<div key={index}><Link to={{pathname:  '/artists/' + element._id}}>{element.name}</Link> <span>{element.startYear} - {element.endYear}</span><br/></div>)
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

          const membersActions = [
            <FlatButton
              label="Zamknij"
              primary={true}
              onClick={this.closeAddingDialog}
            />,
            <FlatButton
              label="Dodaj"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleAddingMember}
            />,
          ];

          const membersEndDateActions = [
            <FlatButton
              label="Zamknij"
              primary={true}
              onClick={this.closeAddingDialog}
            />,
            <FlatButton
              label="Dodaj"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleAddingEndDate}
            />,
          ];

        return (
            <Card className="container">
                <CardTitle title={this.state.data.name}/>
                {Auth.isUserAdmin() || Auth.isUserModerator() ? (<div><RaisedButton style={buttons} label="Usuń zespół" onClick={this.handleOpen} />
                    <RaisedButton style={buttons} label="Dodaj nowego członka" onClick={this.openAddingDialog} />
                    </div>
                ) : (
                    <div></div>
                )}
                <h4>Data uformowania: </h4><span>{this.state.data.formDate}</span><br/>
                <h4>Miejsce uformowania: </h4><span>{this.state.data.origin}</span><br/>
                <h4>Albumy: </h4>{albumsDisplay}<br/>
                <h4>Członkowie: </h4>{membersDisplay}<br/>
                <Dialog
                title="Czy na prawdę chcesz usunąć zespół?"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                >
                </Dialog>
                <Dialog
                title="Podaj dane nowego członka zespołu."
                actions={membersActions}
                modal={false}
                open={this.state.addmember}
                onRequestClose={this.closeAddingDialog}
                >
                {this.state.messages}
                <AutoComplete
                                type="text"
                                value={this.state.newMember}
                                name="members[]"
                                style={padding}
                                hintText='Imię członka'
                                filter={AutoComplete.caseInsensitiveFilter} 
                                dataSource={this.state.dataSource}
                                onUpdateInput={(x, y, z) => this.handleInputUpdate(x, y, z)}
                            />
                            <TextField type="number" value={this.state.newMemberStartDate} name="membersDate" style={padding} hintText='Rok dołączenia' onChange={this.handleShareholderNameChange}/>
                            <TextField type="number" value={this.state.newMemberEndDate} name="membersEndDate" style={padding} hintText='Rok odejścia' onChange={this.handleShareholderNameChange}/>
                </Dialog>
            </Card>
        );
    }
}


export default BandInfoPage;