import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import TimePicker from 'rc-time-picker';
import Auth from '../modules/Auth';

const style = {
    margin: 12,
};

const padding = {
    paddingLeft: 12,
    paddingRight: 12
}

const trackLength = {
    width: 50,
    marginLeft: 12
}

const styles = {
    block: {
      maxWidth: 250,
    },
    checkbox: {
      marginBottom: 16,
      display: 'inline-block',
        width: 256,
        position: 'relative'
    },
    checkboxes: {
        display: 'inline-block',
        width: 256,
        position: 'relative'
    }
  };

function checkForErrors(errorsArray, arrayToCheck, valueToCheck) {
    arrayToCheck.map((value, index) => {
        if(value.param === valueToCheck) {
            errorsArray.push(<span className="error-message">{value.msg}</span>);
            errorsArray.push(<br/>);
        }
    })
}

/**
 * let genres = req.body.albumGenre;
    let albumType = req.body.albumType;
    let editions = req.body.albumEdition;
    let tracksNames = req.body.albumTrackName;
    let tracksLengths = req.body.albumTrackLength;
 */

class AddAlbum extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            genreDataSource: [],
            typeDataSource: [],
            editionDataSource: [],
            authorDataSource: [],
            albumName: '',
            albumAuthor: '',
            albumReleaseDate: '',
            albumType: '',
            albumGenre: [{ name: ''}],
            albumEdition: [],
            albumTrackName: [{ name: ''}],
            albumTrackLengthMin: [{length: ''}],
            albumTrackLengthSec: [{length: ''}],
            messages: [],
            successMessage: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputUpdate = this.handleInputUpdate.bind(this);
        this.handleAuthorInputUpdate = this.handleAuthorInputUpdate.bind(this);
        this.handleAddShareholder = this.handleAddShareholder.bind(this);
        this.handleRemoveShareholder = this.handleRemoveShareholder.bind(this);
        this.handleShareholderNameChange = this.handleShareholderNameChange.bind(this);
        this.updateSingleInputs = this.updateSingleInputs.bind(this);
        this.getAlbumTypes = this.getAlbumTypes.bind(this);
        this.getEditions = this.getEditions.bind(this);
    }

    componentWillMount(){
        this.getAlbumTypes();
        this.getEditions();
    }

    getAlbumTypes() {
        $.ajax({
            url: "http://localhost:4000/albumtypes/all",
            dataType:'json',
            cache: false,
            success: function(data){
                let albumTypesNames = data.albumTypes.map(element => element.name);
                let albumTypesElements = [];
                albumTypesNames.forEach((element) => {
                    albumTypesElements.push(<MenuItem value={element} primaryText={element} />)
                });
                this.setState({typeDataSource: albumTypesElements});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    getEditions(){
        $.ajax({
            url: "http://localhost:4000/editions/all",
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({editionDataSource: data.editions});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    updateCheck(evt, checked, idx, name) {
        if(checked) {
            let newEditions = this.state.albumEdition.map(edition => {return edition;});
            newEditions.push(name);
            this.setState({ albumEdition: newEditions });
        } else {
            let newEditions = this.state.albumEdition.filter(edition => edition != name); 
            this.setState({ albumEdition: newEditions });
        }
    }

    updateSingleInputs(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "albumName":
                this.setState({albumName: evt.target.value});
                break;
            case "albumAuthor":
                this.setState({albumAuthor: evt.target.value});
                break;
            case "albumReleaseDate":
                this.setState({albumReleaseDate: evt.target.value});
                break;
            default:
                break;
        }
    }

    handleChange = (event, index, value) => {
        this.setState({albumType: value});
    }

    handleInputUpdate(value, dataSource, params, idx){
        const newGenres = this.state.albumGenre.map((genre, sidx) => {
            if (idx !== sidx) return genre;
            return { ...genre, name: value };
        });

        this.setState({ albumGenre: newGenres });

        $.ajax({
            url: "http://localhost:4000/genres/search/query?searchGenre=" + value + "&page=1",
            dataType:'json',
            cache: false,
            success: function(data){
                let genreNames = data.genres.map(element => element.name);
                this.setState({genreDataSource: genreNames});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    handleAuthorInputUpdate(value, dataSource, params){
        this.setState({ albumAuthor: value });

        $.ajax({
            url: "http://localhost:4000/artists/search/query?searchArtist=" + value + "&page=1",
            dataType:'json',
            cache: false,
            success: function(data){
                let artistsNames = data.artists.map(element => element.fullName);
                $.ajax({
                    url: "http://localhost:4000/bands/search/query?searchBand=" + value + "&page=1",
                    dataType:'json',
                    cache: false,
                    success: function(data){
                        let bandsNames = data.bands.map(element => element.name);
                        let authorDataSource = artistsNames.concat(bandsNames);
                        this.setState({authorDataSource: authorDataSource});
                    }.bind(this),
                    error: function(xhr, status, err){
                      console.log(err);
                    },
                    beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
                });
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({messages: []});
        this.setState({successMessage: ''});
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/albums/addAlbum',
            data: {
                albumName: this.state.albumName,
                albumReleaseDate: this.state.albumReleaseDate,
                albumAuthor: this.state.albumAuthor,
                albumType: this.state.albumType,
                albumEdition: JSON.stringify(this.state.albumEdition),
                albumGenre: JSON.stringify(this.state.albumGenre.map((obj) => {return obj.name})),
                albumTrackName: JSON.stringify(this.state.albumTrackName.map((obj) => {return obj.name})),
                albumTrackLengthMin: JSON.stringify(this.state.albumTrackLengthMin.map((obj) => {return obj.length})),
                albumTrackLengthSec: JSON.stringify(this.state.albumTrackLengthSec.map((obj) => {return obj.length})),
            },
            dataType:'json',
            cache: false,
            success: function(response){
                if(response.errors) {
                    console.log(response.errors)
                    this.setState({messages: response.errors});
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, albumName: '',
                    albumAuthor: '',
                    albumReleaseDate: '',
                    albumType: '',
                    albumGenre: [{ name: ''}],
                    albumEdition: [],
                    albumTrackName: [{ name: ''}],
                    albumTrackLengthMin: [{length: ''}],
                    albumTrackLengthSec: [{length: ''}]});
                }
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
    }
    
    handleAddShareholder = () => {
        this.setState({
            albumGenre: this.state.albumGenre.concat([{ name: ''}]),
        });
    }

    handleAddTrack = () => {
        this.setState({
            albumTrackName: this.state.albumTrackName.concat([{ name: ''}]),
            albumTrackLengthMin: this.state.albumTrackLengthMin.concat([{ length: ''}]),
            albumTrackLengthSec: this.state.albumTrackLengthSec.concat([{ length: ''}]),
        });
    }
    
    handleRemoveShareholder = (idx, input) => () => {
        if (input === 'genre') {
            this.setState({
                albumGenre: this.state.albumGenre.filter((s, sidx) => idx !== sidx),
            });
        } else if (input === 'track') {
            this.setState({
                albumTrackName: this.state.albumTrackName.filter((s, sidx) => idx !== sidx),
                albumTrackLengthMin: this.state.albumTrackLengthMin.filter((s, sidx) => idx !== sidx),
                albumTrackLengthSec: this.state.albumTrackLengthSec.filter((s, sidx) => idx !== sidx),
            });
        }
    }

    handleShareholderNameChange = (idx, type) => (evt) => {
        if (type === "trackName") {
            let newTrackNames = this.state.albumTrackName.map((trackName, sidx) => {
                if (idx !== sidx) return trackName;
                return { ...trackName, name: evt.target.value, };
            });
    
            this.setState({ albumTrackName: newTrackNames });
        } else if (type === "min") {
            let newTrackMin = this.state.albumTrackLengthMin.map((trackMin, sidx) => {
                if (idx !== sidx) return trackMin;
                return { ...trackMin, length: evt.target.value, };
            });
    
            this.setState({ albumTrackLengthMin: newTrackMin });
        } else if (type === "sec") {
            let newTrackSec = this.state.albumTrackLengthSec.map((trackSec, sidx) => {
                if (idx !== sidx) return trackSec;
                return { ...trackSec, length: evt.target.value, };
            });
    
            this.setState({ albumTrackLengthSec: newTrackSec });
        }
    }

    handleLengthChange = (value) => {
        console.log(value)
    }

    render(){
        let albumNameErrors = [], albumReleaseErrors = [], albumAuthorErrors = [], albumTypeErrors = [], albumGenreErrors = [], albumEditionErrors = [], albumTrackNamesErrors = [],
            albumTrackLengthsMinError = [], albumTrackLengthsSecError = [];
        checkForErrors(albumNameErrors, this.state.messages, "albumName");
        checkForErrors(albumReleaseErrors, this.state.messages, "albumReleaseDate");
        checkForErrors(albumAuthorErrors, this.state.messages, "albumAuthor");
        checkForErrors(albumTypeErrors, this.state.messages, "albumType");
        checkForErrors(albumGenreErrors, this.state.messages, "albumGenre");
        checkForErrors(albumEditionErrors, this.state.messages, "albumEdition");
        checkForErrors(albumTrackNamesErrors, this.state.messages, "albumTrackName");
        checkForErrors(albumTrackLengthsMinError, this.state.messages, "albumTrackLengthMin");
        checkForErrors(albumTrackLengthsSecError, this.state.messages, "albumTrackLengthSec");
        /**
         * albumTrackName', 'Podaj tytuł piosenki!');
    checkIfInputsAreEmpty(tracksLengthsMin, 'albumTrackLengthMin', 'Podaj minuty trwania piosenki!');
    checkIfInputsAreEmpty(tracksLengthsSec, 'albumTrackLengthSec'
         * {this.state.albumTrackName.map((track, idx) => (
                        <div className="shareholder">
                            <TextField type="number" name="albumTrackLength[]" style={padding} hintText={`Track #${idx + 1} length`} onChange={this.handleShareholderNameChange(idx, "start")}/>
                            <RaisedButton label="-"  secondary={true} style={style} onClick={this.handleRemoveShareholder(idx)}/><br/>                      
                        </div>
                    ))}
                    <RaisedButton label="Add track" default={true} style={style} onClick={this.handleAddShareholder}/><br/>
         */

        return (
            <Card className="container">
            <CardTitle title="Dodawanie artysty"/>
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" name="albumName" value={this.state.albumName} hintText="Tytuł albumu" onChange={this.updateSingleInputs}/><br/>
                    {albumNameErrors}
                    <TextField type="number" name="albumReleaseDate" value={this.state.albumReleaseDate} hintText="Rok wydania" onChange={this.updateSingleInputs}/><br/>
                    {albumReleaseErrors}
                    <AutoComplete
                                type="text"
                                name="albumAuthor"
                                hintText="Autor"
                                searchText={this.state.albumAuthor}
                                filter={AutoComplete.caseInsensitiveFilter} 
                                dataSource={this.state.authorDataSource}
                                onUpdateInput={this.handleAuthorInputUpdate}
                            /><br/>
                    {albumAuthorErrors}
                    <SelectField
                        floatingLabelText="Typ albumu"
                        value={this.state.albumType}
                        onChange={this.handleChange}
                        >
                        {this.state.typeDataSource}
                    </SelectField>
                    <br />
                    {albumTypeErrors}
                    {this.state.editionDataSource.map((item, idx) =>
                            <div key={idx}>
                                <Checkbox
                                    label={item.name}
                                    onCheck={(evt, checked) => this.updateCheck(evt, checked, idx, item.name)}
                                    style={styles.checkbox}
                                /><br/>
                            </div>
                    )}
                    {albumEditionErrors}
                    {this.state.albumGenre.map((genre, idx) => (
                        <div className="shareholder">
                            <AutoComplete
                                type="text"
                                name="albumGenre[]"
                                searchText={genre.name}
                                style={padding}
                                hintText={`Gatunek #${idx + 1}`}
                                filter={AutoComplete.caseInsensitiveFilter} 
                                dataSource={this.state.genreDataSource}
                                onUpdateInput={(x, y, z) => this.handleInputUpdate(x, y, z, idx)}
                            />
                            <RaisedButton label="-"  secondary={true} style={style} onClick={this.handleRemoveShareholder(idx, 'genre')}/><br/>                           
                        </div>
                    ))}
                    {albumGenreErrors}
                    <RaisedButton label="Dodaj gatunek" default={true} style={style} onClick={this.handleAddShareholder}/><br/>
                    {this.state.albumTrackName.map((trackName, idx) => (
                        <div className="shareholder">
                            <TextField name="membersDate[]" value={trackName.name} style={padding} hintText={`Piosenka #${idx + 1}`} onChange={this.handleShareholderNameChange(idx, "trackName")}/>
                            <TextField type="number" min="0" value={this.state.albumTrackLengthMin[idx].length} name="membersLengthMin[]" style={trackLength} hintText={`min`} onChange={this.handleShareholderNameChange(idx, "min")}/>
                            <TextField type="number" min="0" value={this.state.albumTrackLengthSec[idx].length} name="membersLengthSec[]" style={trackLength} hintText={`sec`} onChange={this.handleShareholderNameChange(idx, "sec")}/>
                            <RaisedButton label="-"  secondary={true} style={style} onClick={this.handleRemoveShareholder(idx, 'track')}/><br/>                           
                        </div>
                    ))}
                    {albumTrackNamesErrors}
                    {albumTrackLengthsMinError}
                    {albumTrackLengthsSecError}
                    <RaisedButton label="Dodaj piosenkę" default={true} style={style} onClick={this.handleAddTrack}/><br/>
                    <RaisedButton label="Dodaj album" primary={true} style={style} onClick={this.handleSubmit}/>
                </form>
            </Card>
        )
    }

}

export default AddAlbum;