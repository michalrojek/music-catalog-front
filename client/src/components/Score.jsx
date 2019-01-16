import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import $ from 'jquery';
import Auth from '../modules/Auth';

const styles = {
    block: {
      maxWidth: 250,
    },
    radioButton: {
      marginBottom: 16,
      display: 'inline-block',
        width: 60,
        position: 'relative'
    },
  };

class Score extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            avg: ''
        }
    }

    updateScore = (evt, value) => {
        //addScore/:idAlbum
        evt.preventDefault();
        this.setState({score: value})
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/scores/addScore/' + this.props.albumId,
            data: {
                scoreValue: value
            },
            dataType:'json',
            cache: false,
            success: function(response){
                     console.log(response)
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/scores/average/' + this.props.albumId,
            dataType:'json',
            cache: false,
            success: function(response){
                console.log(response)
                     this.setState({avg: response.result[0].avg_score});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
    }

    componentDidMount() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/scores/id/' + this.props.albumId,
            dataType:'json',
            cache: false,
            success: function(response){
                     this.setState({score: parseInt(response.score.scoreValue)});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/scores/average/' + this.props.albumId,
            dataType:'json',
            cache: false,
            success: function(response){
                console.log(response)
                     this.setState({avg: response.result[0].avg_score});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
    }

    render() {
        console.log(this.state.score)
        let radioButtons = [];
        for(let i = 1; i < 11; i++) {
            radioButtons.push(<RadioButton
                value={i}
                label={i}
                style={styles.radioButton}
            />)
        }
        return (
                <div>
                    <h3>Twoja ocena</h3>
                    <RadioButtonGroup name="shipSpeed" onChange={this.updateScore} valueSelected={parseInt(this.state.score)}>
                        {radioButtons}
                    </RadioButtonGroup>
                    <h3>Średnia ocena</h3>
                    {this.state.avg}
                </div>
        )
    }

}

export default Score;