import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import { Link, NavLink } from 'react-router-dom';
import Auth from '../modules/Auth';
import { Card, CardTitle } from 'material-ui/Card';

class UserLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageOfItems: [],
            totalDataCount: ''
        };

        this.getTodos = this.getTodos.bind(this);
    }

    getTodos(){
        $.ajax({
            url: "http://localhost:4000/lists/my/all",
            dataType:'json',
            cache: false,
            success: function(data){
                console.log(data)
              this.setState({pageOfItems: data.lists, totalDataCount: data.listCount});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        });
    }

    componentWillMount(){
        this.getTodos();
    }

    render() {
        if(!this.state.pageOfItems.length) {
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
            <div>
                <Card className="container">
                    <div className="text-center">
                        <CardTitle title="Twoje listy"/>
                        <hr/>
                        {this.state.pageOfItems.map(item =>
                            <div className="pagination-link" key={item._id}><Link to={{
                                pathname: "/mylists/id/" + item._id,
                                state: {
                                    dataUrl: "http://localhost:4000/lists/my/id/"
                                }
                            }}>{item.title}</Link></div>
                        )}
                    </div>
                </Card>
                <hr />
            </div>
        );
        
    }
}

export default UserLists;