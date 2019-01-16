import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Auth from '../modules/Auth';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        }

        this.updateQuery = this.updateQuery.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    updateQuery(evt){
        this.setState({inputValue: evt.target.value})
    }

    handleClick(e){
        e.preventDefault();
        this.props.handler(this.state.inputValue);
    }

    render() {
        return (
            <div>
                <TextField type="text" name="query" placeholder="Wpisz tekst" onChange={this.updateQuery}/>
                <RaisedButton className="buttonMargin" label="Szukaj" primary={true} onClick={this.handleClick}/>
            </div>
        );
    }
}


export default SearchBar;