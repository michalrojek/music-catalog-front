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

class ListInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataUrl: "",
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
              this.setState({data: data[queryName]}, function(){
                    console.log(this.state.data)
              });
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    render() {
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
                <CardTitle title={this.state.data.title} subtitle={"Lista użytkownika " + this.state.data.username}/>
                <hr/>
                <p>{this.state.data.description}</p>
                <hr />
                {this.state.data.albums.map(item =>
                            <div className="pagination-link" key={item._id}><Link to={{
                                pathname: '/albums/' + item._id,
                                state: {
                                    dataUrl: "http://localhost:4000" + this.props.match.path +"/id/"
                                }
                            }}>{item.name || item.title}</Link></div>
                )}
            </Card>
        );
    }
}


export default ListInfoPage;