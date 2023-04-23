import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import CampaignPage from "./components/CampaignPage";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import NewCampaign from "./components/NewCampaign";
import NewCharacter from "./components/NewCharacter";
import Profile from "./components/Profile";
import Register from "./components/Register";

const App = () => {
    const TOKEN_NAME = 'campaignManagerLoginToken';
    const [token, setToken] = useState(window.localStorage.getItem(TOKEN_NAME));
    const [userData, setUserData] = useState({});

    const getUserData = async () => {
        if (token) {
            try {
                const response = await axios.get(`/api/users/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error(error);
            };
        } else {
            setUserData({});
        }
    };

    useEffect(() => {
        getUserData();
    }, [token]);

    return (
        <>
            <Header
                TOKEN_NAME={TOKEN_NAME}
                token={token}
                setToken={setToken}
                userData={userData}
            />
            <main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/campaigns/new' element={
                        <NewCampaign
                            token={token}
                        />
                    } />
                    <Route path='/campaigns/:campaignId' element={
                        <CampaignPage
                            token={token}
                            userData={userData}
                        />
                    } />
                    <Route path='/characters/new' element={
                        <NewCharacter
                            token={token}
                        />
                    } />
                    <Route path='/login' element={
                        <Login
                            TOKEN_NAME={TOKEN_NAME}
                            setToken={setToken}
                        />}
                    />
                    <Route path='/profile' element={
                        <Profile
                            token={token}
                        />
                    } />
                    <Route path='/register' element={
                        <Register
                            TOKEN_NAME={TOKEN_NAME}
                            setToken={setToken}
                        />}
                    />
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