import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import CampaignPage from "./components/Campaigns/CampaignPage";
import Header from "./components/Header";
import Home from "./components/Home";
import InvitesAndRequests from "./components/Messages/InvitesAndRequests";
import Login from "./components/Login";
import LookingForCampaigns from "./components/Campaigns/LookingForCampaigns";
import LookingForPlayers from "./components/Players/LookingForPlayers";
import NewCampaign from "./components/Campaigns/NewCampaign";
import NewCharacter from "./components/Characters/NewCharacter";
import PrivateMessages from "./components/Messages/PrivateMessages";
import ProfilePage from "./components/Profile/ProfilePage";
import Register from "./components/Register";

const App = () => {
    const TOKEN_NAME = 'campaignManagerLoginToken';
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };

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
        };
    };

    const parseDate = (postDate) => {
        const date = new Date(Date.parse(postDate));
        const day = date.toString().split(' ')[0];
        const month = date.toString().split(' ')[1];
        date.setHours(12);
        let period = 'AM'
        let hour = date.getHours();
        if (hour >= 12) {
            hour -= 12;
            if (hour === 0) {
                hour = 12;
            };
            period = 'PM'
        };
        return (`${day} ${month} ${date.getDate()}, ${date.getFullYear()} ${hour}:${date.getMinutes()} ${period}`)
    };

    useEffect(() => {
        const currToken = window.localStorage.getItem(TOKEN_NAME);
        if (currToken) {
            const tokenData = jwt_decode(currToken);
            if (Date.now() > tokenData.exp * 1000) {
                window.localStorage.removeItem(TOKEN_NAME);
                resetData();
                navigate("/login/expired");
            } else {
                setToken(currToken);
            };
        };
    }, []);

    useEffect(() => {
        getUserData();
    }, [token]);

    return (
        <>
            <Header
                TOKEN_NAME={TOKEN_NAME}
                token={token}
                setUserData={setUserData}
                setToken={setToken}
                userData={userData}
            />
            <main>
                <Routes>
                    <Route path='/' element={
                        <Home
                            userData={userData}
                        />} />
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
                    <Route path='/invites' element={
                        <InvitesAndRequests
                            token={token}
                            useQuery={useQuery}
                            userData={userData}
                        />
                    } />
                    <Route path='/lfg/campaigns' element={
                        <LookingForCampaigns
                            token={token}
                            userId={userData.id}
                        />}
                    />
                    <Route path='/lfg/players' element={
                        <LookingForPlayers
                            token={token}
                            userData={userData}
                        />}
                    />
                    <Route path='/login' element={
                        <Login
                            TOKEN_NAME={TOKEN_NAME}
                            sessionExpired={false}
                            setToken={setToken}
                        />}
                    />
                    <Route path='/login/expired' element={
                        <Login
                            TOKEN_NAME={TOKEN_NAME}
                            sessionExpired={true}
                            setToken={setToken}
                        />
                    } />
                    <Route path='/messages' element={
                        <PrivateMessages
                            userData={userData}
                            parseDate={parseDate}
                        />
                    } />
                    <Route path='/register' element={
                        <Register
                            TOKEN_NAME={TOKEN_NAME}
                            setToken={setToken}
                        />}
                    />
                    <Route path='/u/:username' element={
                        <ProfilePage
                            parseDate={parseDate}
                            useQuery={useQuery}
                            userData={userData}
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