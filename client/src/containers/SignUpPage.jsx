import React from 'react';
import PropTypes from 'prop-types';
import SignUpFrom from '../components/SignUpForm.jsx';
import Auth from '../modules/Auth';

class SignUpPage extends React.Component {

    /**
     * Class constructor
     */
    constructor(props, context) {
        super(props, context);

        //set the initial component state
        this.state = {
            errors: {},
            user: {
                email: '',
                name: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    /**
     * Change the user object
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
     * Process the form.
     * 
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
        //prevent default action. in this case, action is the form submission event
        event.preventDefault();

        //console.log('name: ', this.state.user.name);
        //console.log('email: ', this.state.user.email);
        //console.log('password: ', this.state.user.password);

        const name = encodeURIComponent(this.state.user.name);
        const email = encodeURIComponent(this.state.user.email);
        const password = encodeURIComponent(this.state.user.password);
        const formData = `name=${name}&email=${email}&password=${password}`;

        //create an ajax request
        const xhr = new XMLHttpRequest();
        xhr.open('post', 'http://localhost:4000/auth/signup');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
            if(xhr.status === 200) {
                //success

                //change the component container state
                this.setState({
                    errors: {}
                });

                //set a message
                localStorage.setItem('message', xhr.response.message);

                //make a redirect
                this.props.history.push('/login');
            } else {
                //failure

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
     * Render the component.
     */
    render() {
        return (
            <SignUpFrom
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                user={this.state.user}
            />
        );
    }
}

export default SignUpPage;