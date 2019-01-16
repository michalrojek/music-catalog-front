import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Auth from '../modules/Auth';

const SignUpFrom = ({
    onSubmit,
    onChange,
    errors,
    user,
}) => (
    <Card className="container">
        <form action="/" onSubmit={onSubmit}>
            <h2 className="card-heading">Zarejestruj się</h2>

            {errors.summary && <p className="error-message">{errors.summary}</p>}

            <div className="field-line">
                <TextField
                    floatingLabelText="Imię"
                    name="name"
                    errorText={errors.name}
                    onChange={onChange}
                    value={user.name}
                />
            </div>

            <div className="field-line">
                <TextField
                    floatingLabelText="Email"
                    name="email"
                    errorText={errors.email}
                    onChange={onChange}
                    value={user.email}
                />
            </div>

            <div className="field-line">
                <TextField
                    floatingLabelText="Hasło"
                    type="password"
                    name="password"
                    onChange={onChange}
                    errorText={errors.password}
                    value={user.password}
                />
            </div>

            <div className="button-line">
                <RaisedButton type="submit" label="Zarejestruj się" primary />
            </div>

            <CardText>Masz juz konto w serwisie? <Link to={'/login'}>Zaloguj się</Link></CardText>
        </form>
    </Card>
);

SignUpFrom.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};

export default SignUpFrom;