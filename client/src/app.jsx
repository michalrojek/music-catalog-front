import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Route } from 'react-router-dom';
import routes from './routes.js';
import Base from './components/Base.jsx';
import { Link } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import { Switch, browserHistory } from 'react-router';
import Auth from './modules/Auth.js';
import DashboardPage from './containers/DashboardPage.jsx';
import PaginationPage from './containers/PaginationPage.jsx';
import AlbumInfoPage from './components/AlbumInfoPage.jsx';
import ArtistInfoPage from './components/ArtistInfoPage.jsx';
import BandInfoPage from './components/BandInfoPage.jsx';
import { HashRouter } from 'react-router-dom';
import AddArtist from './components/AddArtist.jsx';
import AddBand from './components/AddBand.jsx';
import AddAlbum from './components/AddAlbum.jsx'
import AddList from './components/AddList.jsx';
import UserLists from './components/UserLists.jsx';
import ListInfoPage from './components/ListInfoPage.jsx';
import EditUserList from './components/EditUserList.jsx';
import AddGenre from './components/AddGenre.jsx';
import AddEdition from './components/AddEdition.jsx';
import AddAlbumType from './components/AddAlbumType.jsx';
import EditModeratorList from './components/EditModeratorList.jsx';

injectTapEventPlugin();

ReactDom.render((
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <HashRouter>
            <div>
                <Route component={Base} />
                <Switch>
                    <Route exact path="/" component={HomePage} />                   
                    {Auth.isUserAuthenticated() && Auth.isUserAdmin() ? (
                        <div>
                            <Route exact path="/albums" component={PaginationPage} />
                            <Route exact path="/albums/:id" component={AlbumInfoPage} />
                            <Route exact path="/artists" component={PaginationPage} />
                            <Route exact path="/artists/:id" component={ArtistInfoPage} />
                            <Route exact path="/bands" component={PaginationPage} />
                            <Route exact path="/bands/:id" component={BandInfoPage} />
                            <Route exact path="/lists" component={PaginationPage} />
                            <Route exact path="/lists/:id" component={ListInfoPage} />
                            <Route exact path="/addlist" component={AddList} />
                            <Route exact path="/mylists" component={UserLists} />
                            <Route exact path="/mylists/id/:id" component={EditUserList} />
                            <Route exact path="/addalbum" component={AddAlbum} />
                            <Route exact path="/addartist" component={AddArtist} />
                            <Route exact path="/addband" component={AddBand} />
                            <Route exact path="/addgenre" component={AddGenre} />
                            <Route exact path="/addedition" component={AddEdition} />
                            <Route exact path="/addalbumtype" component={AddAlbumType} />
                            <Route exact path="/users" component={EditModeratorList} />
                        </div>
                    ) : Auth.isUserAuthenticated() && Auth.isUserModerator() ? (
                            <div>
                                <Route exact path="/albums" component={PaginationPage} />
                                <Route exact path="/albums/:id" component={AlbumInfoPage} />
                                <Route exact path="/artists" component={PaginationPage} />
                                <Route exact path="/artists/:id" component={ArtistInfoPage} />
                                <Route exact path="/bands" component={PaginationPage} />
                                <Route exact path="/bands/:id" component={BandInfoPage} />
                                <Route exact path="/lists" component={PaginationPage} />
                                <Route exact path="/lists/:id" component={ListInfoPage} />
                                <Route exact path="/addlist" component={AddList} />
                                <Route exact path="/mylists" component={UserLists} />
                                <Route exact path="/mylists/id/:id" component={EditUserList} />
                                <Route exact path="/addalbum" component={AddAlbum} />
                                <Route exact path="/addartist" component={AddArtist} />
                                <Route exact path="/addband" component={AddBand} />
                                <Route exact path="/addgenre" component={AddGenre} />
                                <Route exact path="/addedition" component={AddEdition} />
                                <Route exact path="/addalbumtype" component={AddAlbumType} />
                            </div>
                        ) : Auth.isUserAuthenticated() ? (
                                <div>
                                    <Route exact path="/albums" component={PaginationPage} />
                                    <Route exact path="/albums/:id" component={AlbumInfoPage} />
                                    <Route exact path="/artists" component={PaginationPage} />
                                    <Route exact path="/artists/:id" component={ArtistInfoPage} />
                                    <Route exact path="/bands" component={PaginationPage} />
                                    <Route exact path="/bands/:id" component={BandInfoPage} />
                                    <Route exact path="/lists" component={PaginationPage} />
                                    <Route exact path="/lists/:id" component={ListInfoPage} />
                                    <Route exact path="/addlist" component={AddList} />
                                    <Route exact path="/mylists" component={UserLists} />
                                    <Route exact path="/mylists/id/:id" component={EditUserList} />
                                </div>
                            ) : (
                                <div>
                                    <Route path="/login" component={LoginPage} />
                                    <Route path="/signup" component={SignUpPage} /> 
                                </div>
                            )}                    
                </Switch>
            </div>
        </HashRouter>
    </MuiThemeProvider>), document.getElementById('react-app'));