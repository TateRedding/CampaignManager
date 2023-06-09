import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ TOKEN_NAME, token, setUserData, setToken, userData }) => {

    const navigate = useNavigate();

    const logout = () => {
        window.localStorage.removeItem(TOKEN_NAME);
        navigate("/");
        setToken('');
        setUserData({});
    };

    return (
        <header>
            <nav className="navbar navbar-expand-sm bg-body-tertiary mb-3">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#cmNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="cmNavbar">
                        <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Home</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/characters">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Character Library</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/lfg/campaigns">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Campaigns</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav d-flex me-1">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img className="avatar-sm" src={userData.avatarURL ? userData.avatarURL : "../images/default_avatar.svg"} alt={userData.username ? `${userData.username}'s avatar`: "Deafult Avatar"} />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    {
                                        (token) ?
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to={`/u/${userData.username}`}>
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">{userData.username}</span>
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <Link className="dropdown-item" to={`/u/${userData.username}?tab=campaigns`}>
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">My Campaigns</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to={`/u/${userData.username}?tab=characters`}>
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">My Characters</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/invites">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Invites/ Requests</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/messages">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Private Messages</span>
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item" onClick={() => logout()}>Sign Out</button></li>
                                            </> :
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to="/login">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Sign In</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/register">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Register</span>
                                                    </Link>
                                                </li>
                                            </>
                                    }
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header >
    )
};

export default Header;