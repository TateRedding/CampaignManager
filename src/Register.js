import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = ({ TOKEN_NAME, setIsLoggedIn }) => {
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

            Object.keys(fields).map(key => (fields[key] === '') ? delete fields[key] : null);

            try {
                const response = await axios.post('/api/users/register', { fields });
                console.log(response);
                if (response.data.error === 'UsernameTakenError') {
                    setUsernameTaken(true);
                } else {
                    window.localStorage.setItem(TOKEN_NAME, response.data.token)
                    setIsLoggedIn(true);
                    setUsername('');
                    setPassword('');
                    setPasswordConfirm('');
                    setEmail('');
                    setFirstName('');
                    setSurname('');
                    setLocation('');
                    navigate('/');
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
                    <label htmlFor="username" className="form-label">Username *</label>
                    <input
                        className="form-control"
                        id="username"
                        value={username}
                        required
                        onChange={(event) => setUsername(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password *</label>
                    <input
                        type="password"
                        className="form-control"
                        aria-labelledby="passwordHelp"
                        id="password"
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
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                        className="form-control"
                        id="email"
                        value={email}
                        required
                        onChange={(event) => setEmail(event.target.value)}>
                    </input>
                </div>
                <div className="row g-3 align-items-center">
                    <div className="mb-3 col-auto">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input
                            className="form-control"
                            id="first-name"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}>
                        </input>
                    </div>
                    <div className="mb-3 col-auto">
                        <label htmlFor="surname" className="form-label">Last Name</label>
                        <input
                            className="form-control"
                            id="surname"
                            value={surname}
                            onChange={(event) => setSurname(event.target.value)}>
                        </input>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input
                        className="form-control"
                        id="location"
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