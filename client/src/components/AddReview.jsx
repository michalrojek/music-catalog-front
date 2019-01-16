import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import $ from 'jquery';
import Auth from '../modules/Auth';
import CardText from 'material-ui/Card/CardText';
import CardTitle from 'material-ui/Card/CardTitle';

const style = {
    margin: 12,
};

const cardStyle = {
    color: '#BEBEBE',
    paddingBottom: '6px'
};

class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewValue: '',
            reviewList: []
        }
    }

    updateQuery = (evt) => {
        evt.preventDefault();
        this.setState({reviewValue: evt.target.value});
    }

    componentWillMount() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/reviews/id/' + this.props.albumId,
            dataType:'json',
            cache: false,
            success: function(response){
                this.setState({reviewValue: response.review.reviewText});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/reviews/all/' + this.props.albumId,
            dataType:'json',
            cache: false,
            success: function(response){
                let reviewsArray = response.reviews.map((value, index) => {
                    return {reviewText: value.reviewText, reviewUser: value.username}
                })
                this.setState({reviewList: reviewsArray});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        })
    }

    handlePost = (evt) => {
        evt.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/reviews/addReview/' + this.props.albumId,
            data: {
                reviewText: this.state.reviewValue
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
    }

    render() {
        let reviews = this.state.reviewList;
        console.log(reviews)

        return(
            <div>
                <h3>Twoja Recenzja</h3>
                <form>
                    <TextField
                        hintText="Twoja recenzja"
                        multiLine={true}
                        rows={5}
                        rowsMax={10}
                        value={this.state.reviewValue}
                        onChange={this.updateQuery}
                    /><br />
                    <RaisedButton label="Dodaj recenzję" primary={true} style={style} onClick={this.handlePost}/>
                    <CardTitle title="Recenzje innych użytkowników" />
                    {reviews.map((value, index) =>
                        <div key={index}>
                            <CardText style={cardStyle}>Recezja napisana przez użytkownika <b>{value.reviewUser}</b></CardText>
                            <CardText>{value.reviewText}</CardText>
                        </div>
                )}
                </form>
            </div>
        )
    }
}

export default Review;