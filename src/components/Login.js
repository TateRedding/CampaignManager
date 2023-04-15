import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ TOKEN_NAME, setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidLogin, setInvalidLogin] = useState(false);

    const navigate = useNavigate();

    const logIn = async (event) => {
        event.preventDefault();
        
        if (username && password) {
            setInvalidLogin(false);
            try {
                const response = await axios.post('/api/users/login', {
                    username,
                    password
                });
                if (response.data.error === 'IncorrectCredentialsError') {
                    setInvalidLogin(true);
                } else {
                    window.localStorage.setItem(TOKEN_NAME, response.data.token);
                    setToken(response.data.token);
                    setUsername('');
                    setPassword('');
                    navigate('/');
                };
            } catch (error) {
                console.error(error);
            };
        };
    };

    return (
        <>
            {
                (invalidLogin) ?
                    <p>Incorrect username or password. Try again.</p> :
                    null
            }
            <form autoComplete="off" onSubmit={logIn}>
                <div className="mb-3">
                    <label htmlFor="username-login" className="form-label">Username</label>
                    <input
                        className="form-control"
                        id="username-login"
                        value={username}
                        required
                        onChange={(event) => setUsername(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3">
                    <label htmlFor="password-login" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password-login"
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)}>
                    </input>
                </div>
                <p>Don't have an account yet? <Link to="/register">Click here!</Link></p>
                <button type="submit" className="btn btn-primary">Log In</button>
            </form>
        </>
    );
};

export default Login;