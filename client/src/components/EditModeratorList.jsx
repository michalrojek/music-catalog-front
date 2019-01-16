import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import { Link, NavLink } from 'react-router-dom';
import Auth from '../modules/Auth';
import Checkbox from 'material-ui/Checkbox';
import { Card, CardTitle, CardText } from 'material-ui/Card';

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
  };

class EditModeratorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageOfItems: [],
            totalDataCount: '',
            checked: false,
        };

        this.getTodos = this.getTodos.bind(this);
        this.updateCheck = this.updateCheck.bind(this);
    }

    getTodos(){
        console.log('halo')
        $.ajax({
            url: "http://localhost:4000/users/all",
            dataType:'json',
            cache: false,
            success: function(data){
                console.log(data)
                this.setState({pageOfItems: data.users}, () => {
                    console.log(this.state.pageOfItems)
                });
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        });
    }

    updateCheck(evt, checked, userId) {
        let isModerator = true;
        let newUsers = this.state.pageOfItems.map((user, sidx) => {
            if (userId !== user._id) return user;
            if (user.type == 'moderator') {
                isModerator = false;
                return { ...user,  type: 'user'};
            }
            isModerator = true;
            return { ...user,  type: 'moderator'};
        });
        this.setState({ pageOfItems: newUsers });
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/users/moderator/' + userId,
            data: {
                isModerator: isModerator
            },
            dataType:'json',
            cache: false,
            success: function(response){
                console.log(response)
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        })
      }

    componentWillMount(){
        this.getTodos();
    }

    render() {
        if(!this.state.pageOfItems.length) {
            return (
            <div>

            </div>
            );
        }
        return (
            <Card className="container">
            <CardTitle title="Lista uzytkowników i moderatorów" subtitle="Zaznacz, aby mianować moderatora / Odznacz, aby odebrać uprawnienia moderatora"/>
                <div>
                {this.state.pageOfItems.map(item =>
                <div key={item._id}>
                    <Checkbox
                        label={item.name}
                        checked={item.type == "moderator" ? (true) : (false)}
                        onCheck={(evt, checked) => this.updateCheck(evt, checked, item._id)}
                        style={styles.checkbox}
                    />
                </div>
                )}
            </div>
            </Card>
        );
        
    }
}

export default EditModeratorList;