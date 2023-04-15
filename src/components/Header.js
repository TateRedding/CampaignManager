import React from "react";
import { useNavigate } from "react-router-dom";


const Header = ({ TOKEN_NAME, isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const logout = () => {
        window.localStorage.removeItem(TOKEN_NAME);
        setIsLoggedIn(false);
    };

    return (
        <header>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-primary" onClick={() => navigate('/campaigns')}>Campaigns</button>
            <button className="btn btn-primary" onClick={() => navigate('/characters')}>Characters</button>
            <button className="btn btn-primary" onClick={() => navigate('/lfg')}>Looking for Group</button>
            {
                (isLoggedIn) ?
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