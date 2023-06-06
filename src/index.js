import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import Profile from "./components/Profile";
import Register from "./components/Register";

const App = () => {
    const TOKEN_NAME = 'campaignManagerLoginToken';
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState({});
    const [campaignData, setCampaignData] = useState([]);
    const [characterData, setCharacterData] = useState([]);
    const [invitationData, setInvitationData] = useState([]);
    const [privateMessageData, setPrivateMessageData] = useState([]);

    const navigate = useNavigate();

    const getUserData = async () => {
        if (token) {
            try {
                const userResponse = await axios.get(`/api/users/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(userResponse.data);
                if (userResponse.data.id) {
                    const campaignResponse = await axios.get(`/api/users/${userResponse.data.id}/campaigns`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setCampaignData(campaignResponse.data);

                    const characterResponse = await axios.get(`/api/users/${userResponse.data.id}/characters`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setCharacterData(characterResponse.data);

                    const invitationResponse = await axios.get(`/api/messages/invites/${userResponse.data.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setInvitationData(invitationResponse.data);

                    const privateMessageResponse = await axios.get(`/api/messages/private/${userResponse.data.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setPrivateMessageData(privateMessageResponse.data);
                }
            } catch (error) {
                console.error(error);
            };
        } else {
            setUserData({});
        }
    };

    const resetData = () => {
        setUserData({});
        setCampaignData([]);
        setCharacterData([]);
        setInvitationData([]);
        setPrivateMessageData([]);
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
                resetData={resetData}
                setToken={setToken}
                userData={userData}
            />
            <main>
                <Routes>
                    <Route path='/' element={
                        <Home
                            campaignData={campaignData}
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
                            invitationData={invitationData}
                            token={token}
                            userId={userData.id}
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
                            campaignData={campaignData}
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
                            privateMessageData={privateMessageData}
                        />
                    } />
                    <Route path='/profile' element={
                        <Profile
                            campaignData={campaignData}
                            characterData={characterData}
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