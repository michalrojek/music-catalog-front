import React from 'react';
import Pagination from '../components/Pagination.jsx';
import _ from 'lodash';
import $ from 'jquery';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import Auth from '../modules/Auth';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class PaginationPage extends React.Component {
    constructor() {
        super();

        this.state = {
            pageOfItems: [],
            currentPage: 1,
            totalDataCount: 1,
            dataUrl: "",
            heading: "",
            firstFlag: false,
            secondFlag: false
        };

        this.onChangePage = this.onChangePage.bind(this);
        this.handler = this.handler.bind(this);
        this.switchFlag = this.switchFlag.bind(this);
    }

    getTodos(){
        $.ajax({
            url: this.state.dataUrl + this.state.currentPage,
            dataType:'json',
            cache: false,
            success: function(data){
                let queryName = this.props.match.path.replace('/','');
                let queryCount = queryName + 'Count'
                this.setState({pageOfItems: data[queryName], totalDataCount: data[queryCount], secondFlag: true});
            }.bind(this),
            error: function(xhr, status, err){
              console.log(err);
            },
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);}
        });
    }

    handler(query) {
        let newQueryName = this.props.match.path.substring(1, this.props.match.path.length);
        newQueryName = "search" + newQueryName.charAt(0).toUpperCase() + newQueryName.slice(1);
        newQueryName = newQueryName.substring(0,newQueryName.length - 1 );
        let newUrl = "http://localhost:4000" + this.props.match.path + "/search/query?" + newQueryName + "=" + query + "&page=";
        this.setState({dataUrl: newUrl, firstFlag: true, currentPage: 1});
    }

    switchFlag() {
        this.setState({firstFlag: false, secondFlag: false});
    }

    componentWillMount(){
        switch(this.props.match.path) {
            case "/albums" : 
                this.setState({heading: "Albumy"});
                break;
            case "/artists" : 
                this.setState({heading: "Artyści"});
                break;
            case "/bands" : 
                this.setState({heading: "Zespoły"});
                break;
            case "/lists" : 
                this.setState({heading: "Listy"});
                break;
        }
        let newUrl = "http://localhost:4000" + this.props.match.path + "/all/";
        this.setState({dataUrl: newUrl});
    }

    componentDidMount(){
        this.getTodos();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.currentPage !== this.state.currentPage) {
            this.getTodos();
        } else if (prevState.dataUrl !== this.state.dataUrl) {
            this.getTodos();
        }
    }

    onChangePage(currentPage) {
        this.setState({ currentPage: currentPage });
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
                    <CardTitle title={this.state.heading} />
                    <div className="text-center">
                        <SearchBar handler = {this.handler}/>
                        {this.state.pageOfItems.map(item =>
                            <div className="pagination-link" key={item._id}><Link to={{
                                pathname: this.props.match.path + '/' + item._id,
                                state: {
                                    dataUrl: "http://localhost:4000" + this.props.match.path +"/id/"
                                }
                            }}>{item.fullName || item.name || item.title}</Link></div>
                        )}
                        <Pagination items={this.state.pageOfItems} onChangePage={this.onChangePage} totalDataCount={this.state.totalDataCount} firstFlag={this.state.firstFlag} secondFlag={this.state.secondFlag} handleSwitch={this.switchFlag}/>
                    </div>
                </Card>
            </div>
        );
        
    }
}

export default PaginationPage;