import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm.jsx';
import Auth from '../modules/Auth';

class LoginPage extends React.Component {

    /**
     * Class constructor
     */
    constructor(props, context) {
        super(props, context);

        const storedMessage = localStorage.getItem('asd');
        let successMessage = '';
        if (storedMessage) {
            successMessage = storedMessage;
            localStorage.removeItem('asd');
        }

        //set the initial component state
        this.state = {
            errors: {},
            successMessage,
            user: {
                email: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    /**
     * Process the form.
     * 
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();
    
        //console.log('email:', this.state.user.email);
        //console.log('password:', this.state.user.password);

        //create a string for an http body message
        const email = encodeURIComponent(this.state.user.email);
        const password = encodeURIComponent(this.state.user.password);
        const formData = `email=${email}&password=${password}`;

        const xhr = new XMLHttpRequest();
        xhr.open('post', 'http://localhost:4000/auth/login');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                //success

                //change the component container state
                this.setState({
                    errors: {}
                });

                //save the token
                Auth.authenticateUser(xhr.response.token);
                if(xhr.response.user.type == "admin") {
                    Auth.authenticateAdmin(true);
                } else {
                    Auth.authenticateAdmin(false);
                }
                if(xhr.response.user.type == "moderator") {
                    Auth.authenticateModerator(true);
                } else {
                    Auth.authenticateModerator(false);
                }
                console.log(xhr.response)
                //change the current URL to /
                this.props.history.push('/');
                window.location.reload(false); 
            } else {
                //failure

                //change the component container state
                const errors = xhr.response.errors ? xhr.response.errors : {};
                errors.summary = xhr.response.message;

                this.setState({
                    errors
                });
            }
        });
        xhr.send(formData);
    }

    /**
     * Change the user object.
     *
     * @param {object} event - the JavaScript event object
     */
    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    /**
     * Render the component
     */
    render() {
        return (
            <LoginForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                user={this.state.user}
            />
        );
    }
}

export default LoginPage;