import React from "react";
import { Link } from "react-router-dom";

const Header = ({ TOKEN_NAME, token, setToken, userData }) => {

    const logout = () => {
        window.localStorage.removeItem(TOKEN_NAME);
        setToken('');
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
                                <Link className="nav-link" to="/home">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Home</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/characters">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Characters</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/campaigns">
                                    <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Campaigns</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav d-flex me-1">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img className="avatar" src="../images/default_avatar.png" alt="Avatar" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    {
                                        (token) ?
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to="/profile">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">{userData.username}</span>
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <Link className="dropdown-item" to="/">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">My Campaigns</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">My Characters</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to="/">
                                                        <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Invites</span>
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