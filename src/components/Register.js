import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = ({ TOKEN_NAME, setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [location, setLocation] = useState('');
    const [usernameTaken, setUsernameTaken] = useState(false);

    const navigate = useNavigate();

    const register = async (event) => {
        event.preventDefault();

        if (username && password && password === passwordConfirm && password.length >= 8) {
            setUsernameTaken(false);
            const fields = {
                username,
                password,
                email,
                firstName,
                surname,
                location,
            };

            Object.keys(fields).map(key => (!fields[key]) ? delete fields[key] : null);

            try {
                const response = await axios.post('/api/users/register', fields);
                if (response) {
                    if (response.data.error === 'UsernameTakenError') {
                        setUsernameTaken(true);
                    } else {
                        window.localStorage.setItem(TOKEN_NAME, response.data.token)
                        setToken(response.data.token);
                        setUsername('');
                        setPassword('');
                        setPasswordConfirm('');
                        setEmail('');
                        setFirstName('');
                        setSurname('');
                        setLocation('');
                        navigate('/');
                    };
                };
            } catch (error) {
                console.error(error);
            };
        };
    }

    return (
        <>
            {
                (usernameTaken) ?
                    <p>Username already taken! Try something else</p> :
                    null
            }
            <form autoComplete="off" onSubmit={register}>
                <div className="mb-3">
                    <label htmlFor="username-register" className="form-label">Username *</label>
                    <input
                        className="form-control"
                        id="username-register"
                        value={username}
                        required
                        onChange={(event) => setUsername(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3">
                    <label htmlFor="password-register" className="form-label">Password *</label>
                    <input
                        type="password"
                        className="form-control"
                        aria-labelledby="passwordHelp"
                        id="password-register"
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)}>
                    </input>
                    <span className="form-text" id="passwordHelp">
                        Must be 8-25 characters.
                    </span>
                </div>
                <div className="mb-3">
                    <label htmlFor="password-confirm" className="form-label" aria-labelledby="passwords-must-match">Confirm Password *</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password-confirm"
                        value={passwordConfirm}
                        required
                        onChange={(event) => setPasswordConfirm(event.target.value)}>
                    </input>
                    {
                        (passwordConfirm && password !== passwordConfirm) ?
                            <span id="passwords-must-match" className="form-text">Passwords must match!</span> :
                            null
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="email-register" className="form-label">Email *</label>
                    <input
                        className="form-control"
                        id="email-register"
                        value={email}
                        required
                        onChange={(event) => setEmail(event.target.value)}>
                    </input>
                </div>
                <div className="row g-3 align-items-center">
                    <div className="mb-3 col-auto">
                        <label htmlFor="first-name-register" className="form-label">First Name</label>
                        <input
                            className="form-control"
                            id="first-name-register"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}>
                        </input>
                    </div>
                    <div className="mb-3 col-auto">
                        <label htmlFor="surname-register" className="form-label">Last Name</label>
                        <input
                            className="form-control"
                            id="surname-register"
                            value={surname}
                            onChange={(event) => setSurname(event.target.value)}>
                        </input>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="location-register" className="form-label">Location</label>
                    <input
                        className="form-control"
                        id="location-register"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}>
                    </input>
                </div>
                <p>Already signed up? <Link to='/login'>Click here!</Link></p>
                <button type="submit" className="btn btn-primary">Register</button>
            </form >
        </>
    );
};

export default Register;