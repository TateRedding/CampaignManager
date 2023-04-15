import React from "react";
import { useNavigate } from "react-router-dom";


const Header = ({ token, setToken }) => {
    const navigate = useNavigate();

    const logout = () => {
        window.localStorage.removeItem(TOKEN_NAME);
        setToken('');
    };

    return (
        <header>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-primary" onClick={() => navigate('/campaigns')}>Campaigns</button>
            <button className="btn btn-primary" onClick={() => navigate('/characters')}>Characters</button>
            <button className="btn btn-primary" onClick={() => navigate('/lfg')}>Looking for Group</button>
            {
                (token) ?
                    <>
                        <button className="btn btn-primary" onClick={() => navigate('/profile')}>My Profile</button>
                        <button className="btn btn-primary" onClick={() => logout()}>Log Out</button>
                    </> :
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>Login/Register</button>
            }

        </header>
    )
};

export default Header;