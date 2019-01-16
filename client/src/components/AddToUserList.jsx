import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import { Link, NavLink } from 'react-router-dom';
import Auth from '../modules/Auth';
import Checkbox from 'material-ui/Checkbox';

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

class AddToUserList extends React.Component {
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
        $.ajax({
            url: "http://localhost:4000/lists/my/all/" + this.props.albumId,
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({pageOfItems: data.lists, totalDataCount: data.listCount}, () => {
                    console.log(this.state.pageOfItems)
                });
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`); }
        });
    }

    updateCheck(evt, checked, listId) {
        let add = true;
        let newLists = this.state.pageOfItems.map((list, sidx) => {
            if (listId !== list._id) return list;
            add = !list.albumIncluded;
            return { ...list,  albumIncluded: !list.albumIncluded};
        });
        this.setState({ pageOfItems: newLists });
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/lists/addToList/' + listId + '/' + this.props.albumId,
            data: {
                add: add
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
            <div>
                <h3>Twoje listy</h3>
                {this.state.pageOfItems.map(item =>
                <div key={item._id}>
                    <Checkbox
                        label={item.title}
                        checked={item.albumIncluded}
                        onCheck={(evt, checked) => this.updateCheck(evt, checked, item._id)}
                        style={styles.checkbox}
                    />
                </div>
                )}
            </div>
        );
        
    }
}

export default AddToUserList;