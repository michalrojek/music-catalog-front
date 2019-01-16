import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import AutoComplete from 'material-ui/AutoComplete';
import Auth from '../modules/Auth';

const style = {
    margin: 12,
};

const padding = {
    paddingLeft: 12,
    paddingRight: 12
}

function checkForErrors(errorsArray, arrayToCheck, valueToCheck) {
    arrayToCheck.map((value, index) => {
        if(value.param === valueToCheck) {
            errorsArray.push(<span className="error-message">{value.msg}</span>);
            errorsArray.push(<br/>);
        }
    })
}

class AddBand extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            bandName: '',
            bandOrigin: '',
            bandFormDate: '',
            members: [{ name: ''}],
            membersDates: [{ year: ''}],
            membersEndDates: [{ year: ''}],
            messages: [],
            successMessage: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputUpdate = this.handleInputUpdate.bind(this);
        this.handleAddShareholder = this.handleAddShareholder.bind(this);
        this.handleRemoveShareholder = this.handleRemoveShareholder.bind(this);
        this.handleShareholderNameChange = this.handleShareholderNameChange.bind(this);
        this.updateSingleInputs = this.updateSingleInputs.bind(this);
    }

    updateSingleInputs(evt){
        evt.preventDefault();
        switch(evt.target.name) {
            case "bandName":
                this.setState({bandName: evt.target.value});
                break;
            case "bandOrigin":
                this.setState({bandOrigin: evt.target.value});
                break;
            case "bandFormDate":
                this.setState({bandFormDate: evt.target.value});
                break;
            default:
                break;
        }
    }

    handleInputUpdate(value, dataSource, params, idx){
        const newMembers = this.state.members.map((member, sidx) => {
            if (idx !== sidx) return member;
            return { ...member, name: value};
        });

        this.setState({ members: newMembers });

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
            }
        });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({messages: []});
        this.setState({successMessage: ''});
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/bands/addBand',
            data: {
                bandName: this.state.bandName,
                bandOrigin: this.state.bandOrigin,
                bandFormDate: this.state.bandFormDate,
                members: JSON.stringify(this.state.members.map((obj) => {return obj.name})),
                membersDate: JSON.stringify(this.state.membersDates.map((obj) => {return obj.year})),
                membersEndDate: JSON.stringify(this.state.membersEndDates.map((obj) => {return obj.year}))

            },
            dataType:'json',
            cache: false,
            success: function(response){
                if(response.errors) {
                    this.setState({messages: response.errors}, function() {

                    });
                } else if (response.successMessage) {
                    this.setState({successMessage: response.successMessage, bandName: '', bandOrigin: '', bandFormDate: '', members: [{ name: '' }], membersDates: [{ year: '' }], membersEndDates: [{ year: '' }]});
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
            members: this.state.members.concat([{ name: ''}]),
            membersDates: this.state.membersDates.concat([{ year: ''}]),
            membersEndDates: this.state.membersEndDates.concat([{ year: ''}])
        });
    }
    
    handleRemoveShareholder = (idx) => () => {
        this.setState({
            members: this.state.members.filter((s, sidx) => idx !== sidx),
            membersDates: this.state.membersDates.filter((s, sidx) => idx !== sidx),
            membersEndDates: this.state.membersEndDates.filter((s, sidx) => idx !== sidx)
        });
    }

    handleShareholderNameChange = (idx, type) => (evt) => {
        if(type === "start") {
            let newMembersDate = this.state.membersDates.map((membersDate, sidx) => {
                if (idx !== sidx) return membersDate;
                return { ...membersDate, year: evt.target.value};
            });
    
            this.setState({ membersDates: newMembersDate });
        } else if (type === "end") {
            let newMembersDate = this.state.membersEndDates.map((membersDate, sidx) => {
                if (idx !== sidx) return membersDate;
                return { ...membersDate, year: evt.target.value};
            });
    
            this.setState({ membersEndDates: newMembersDate });
        }
    }

    render(){
        let bandNameErrors = [], bandOriginErrors = [], bandFormDateErrors = [], bandMembersErrors = [], bandMembersDateErrors = [];
        checkForErrors(bandNameErrors, this.state.messages, "bandName");
        checkForErrors(bandOriginErrors, this.state.messages, "bandOrigin");
        checkForErrors(bandFormDateErrors, this.state.messages, "bandFormDate");
        checkForErrors(bandMembersErrors, this.state.messages, "members");
        checkForErrors(bandMembersDateErrors, this.state.messages, "membersDate");

        return (
            <Card className="container">
                <CardTitle title="Dodawanie zespołu" />
                {this.state.successMessage.length ? (<span className="success-message">{this.state.successMessage}</span>) : (<div></div>)}
                <form>
                    <TextField type="text" value={this.state.bandName} name="bandName" hintText="Nazwa zespołu" onChange={this.updateSingleInputs}/><br/>
                    {bandNameErrors}
                    <TextField type="text" value={this.state.bandOrigin} name="bandOrigin" hintText="Kraj pochodzenia zespołu" onChange={this.updateSingleInputs}/><br/>
                    {bandOriginErrors}
                    <TextField type="number" value={this.state.bandFormDate} name="bandFormDate" hintText="Rok założenia" onChange={this.updateSingleInputs}/><br/>
                    {bandFormDateErrors}
                    {this.state.members.map((shareholder, idx) => (
                        <div className="shareholder">
                            <AutoComplete
                                type="text"
                                value={shareholder.name}
                                name="members[]"
                                style={padding}
                                hintText={`Członek zespołu #${idx + 1}`}
                                filter={AutoComplete.caseInsensitiveFilter} 
                                dataSource={this.state.dataSource}
                                onUpdateInput={(x, y, z) => this.handleInputUpdate(x, y, z, idx)}
                            />
                            <TextField type="number" value={this.state.membersDates[idx].year} name="membersDate[]" style={padding} hintText={`Rok dołączenia #${idx + 1}`} onChange={this.handleShareholderNameChange(idx, "start")}/>
                            <TextField type="number" value={this.state.membersEndDates[idx].year} name="membersEndDate[]" style={padding} hintText={`Rok odejścia #${idx + 1}`} onChange={this.handleShareholderNameChange(idx, "end")}/>
                            <RaisedButton label="-"  secondary={true} style={style} onClick={this.handleRemoveShareholder(idx)}/><br/>
                            
                        </div>
                    ))}
                    {bandMembersErrors}
                    {bandMembersDateErrors}
                    <RaisedButton label="Dodaj członka zespołu" default={true} style={style} onClick={this.handleAddShareholder}/><br/>
                    <RaisedButton label="Dodaj zespół" primary={true} style={style} onClick={this.handleSubmit}/>
                </form>
            </Card>
        )
    }

}

export default AddBand;