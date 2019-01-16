import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import Auth from '../modules/Auth';

const Base = () => (
    <div>
        <div className="top-bar">
            <div className="top-bar-left">
                <NavLink to="/">Katalog muzyczny</NavLink>
            </div>
            <div className="top-bar-right">
                    <Link to="/albums">Albumy</Link>
                    <Link to="/artists">Artyści</Link>
                    <Link to="/bands">Zespoły</Link>
                    <Link to="/lists">Listy</Link>
                    <Link to="/addlist">Dodaj listę</Link>
                    <Link to="/mylists">Moje listy</Link>
                    <Link to="/addalbum">Dodaj album</Link>
                    <Link to="/addartist">Dodaj artystę</Link>
                    <Link to="/addband">Dodaj zespół</Link>
                    <Link to="/addgenre">Dodaj gatunek</Link>
                    <Link to="/addedition">Dodaj wydanie</Link>
                    <Link to="/addalbumtype">Dodaj typ albumu</Link>
                    <Link to="/users">Użytkownicy</Link>
                    <Link to="/login">Zaloguj się</Link>
                    <Link to="/signup">Zarejestruj się</Link>
                </div>
            {Auth.isUserAuthenticated() && Auth.isUserAdmin() ? (
                <div className="top-bar-right">
                    <Link to="/albums">Albumy</Link>
                    <Link to="/artists">Artyści</Link>
                    <Link to="/bands">Zespoły</Link>
                    <Link to="/lists">Listy</Link>
                    <Link to="/addlist">Dodaj listę</Link>
                    <Link to="/mylists">Moje listy</Link>
                    <Link to="/addalbum">Dodaj album</Link>
                    <Link to="/addartist">Dodaj artystę</Link>
                    <Link to="/addband">Dodaj zespół</Link>
                    <Link to="/addgenre">Dodaj gatunek</Link>
                    <Link to="/addedition">Dodaj wydanie</Link>
                    <Link to="/addalbumtype">Dodaj typ albumu</Link>
                    <Link to="/users">Użytkownicy</Link>
                    <Link to="/" onClick={Auth.deauthentiacteUser}>Wyloguj się</Link>
                </div>
            ) : Auth.isUserAuthenticated() && Auth.isUserModerator() ? (
                    <div className="top-bar-right">
                        <Link to="/albums">Albumy</Link>
                        <Link to="/artists">Artyści</Link>
                        <Link to="/bands">Zespoły</Link>
                        <Link to="/lists">Listy</Link>
                        <Link to="/addlist">Dodaj listę</Link>
                        <Link to="/mylists">Moje listy</Link>
                        <Link to="/addalbum">Dodaj album</Link>
                        <Link to="/addartist">Dodaj artystę</Link>
                        <Link to="/addband">Dodaj zespół</Link>
                        <Link to="/addgenre">Dodaj gatunek</Link>
                        <Link to="/addedition">Dodaj wydanie</Link>
                        <Link to="/addalbumtype">Dodaj typ albumu</Link>
                        <Link to="/" onClick={Auth.deauthentiacteUser}>Wyloguj się</Link>
                    </div>
                ) : Auth.isUserAuthenticated() ? (
                        <div className="top-bar-right">
                            <Link to="/albums">Albumy</Link>
                            <Link to="/artists">Artyści</Link>
                            <Link to="/bands">Zespoły</Link>
                            <Link to="/lists">Listy</Link>
                            <Link to="/addlist">Dodaj listę</Link>
                            <Link to="/mylists">Moje listy</Link>
                            <Link to="/" onClick={Auth.deauthentiacteUser}>Wyloguj się</Link>
                        </div>
                    ) : (
                        <div className="top-bar-right">
                        </div>
                    )}

        </div>
    </div>
);

Base.propTypes = {
    //children: PropTypes.object.isRequired
};

export default Base;