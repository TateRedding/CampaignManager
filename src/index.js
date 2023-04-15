import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import NewCampaign from "./components/NewCampaign";
import Profile from "./components/Profile";
import Register from "./components/Register";

const App = () => {
    const TOKEN_NAME = 'campaignManagerLoginToken';
    const [isLoggedIn, setIsLoggedIn] = useState(window.localStorage.getItem(TOKEN_NAME));

    return (
        <>
            <Header
                TOKEN_NAME={TOKEN_NAME}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={
                        <Login
                            TOKEN_NAME={TOKEN_NAME}
                            setIsLoggedIn={setIsLoggedIn}
                        />}
                    />
                    <Route path='/register' element={
                        <Register
                            TOKEN_NAME={TOKEN_NAME}
                            setIsLoggedIn={setIsLoggedIn}
                        />}
                    />
                    <Route path='/campaigns/new' element={
                        <NewCampaign
                            TOKEN_NAME={TOKEN_NAME}
                        />
                    } />
                    <Route path='/profile' element={
                        <Profile
                            TOKEN_NAME={TOKEN_NAME}
                        />
                    } />
                </Routes>
            </main>
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <HashRouter>
        <App />
    </HashRouter>
);