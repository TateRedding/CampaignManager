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
    const [token, setToken] = useState(window.localStorage.getItem(TOKEN_NAME));

    return (
        <>
            <Header
                token={token}
                setToken={setToken}
            />
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={
                        <Login
                            TOKEN_NAME={TOKEN_NAME}
                            setToken={setToken}
                        />}
                    />
                    <Route path='/register' element={
                        <Register
                            TOKEN_NAME={TOKEN_NAME}
                            setToken={setToken}
                        />}
                    />
                    <Route path='/campaigns/new' element={
                        <NewCampaign
                            token={token}
                        />
                    } />
                    <Route path='/profile' element={
                        <Profile
                            token={token}
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