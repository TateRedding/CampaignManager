import React from "react";

const Header = ({ TOKEN_NAME, token, setToken, userData }) => {

    const logout = () => {
        window.localStorage.removeItem(TOKEN_NAME);
        setToken('');
    };

    return (
        <header>
            <nav className="navbar navbar-expand-sm bg-body-tertiary">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#cmNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="cmNavbar">
                        <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/#/home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#/characters">Characters</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#/campaigns">Campaigns</a>
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
                                                <li><a className="dropdown-item" href="/profile">{userData.username}</a></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><a className="dropdown-item" href="/">My Campaigns</a></li>
                                                <li><a className="dropdown-item" href="/">My Characters</a></li>
                                                <li><a className="dropdown-item" href="/">Invites</a></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item" onClick={() => logout()}>Sign Out</button></li>
                                            </> :
                                            <>
                                                <li><a className="dropdown-item" href="/login">Sign In</a></li>
                                                <li><a className="dropdown-item" href="/register">Register</a></li>
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