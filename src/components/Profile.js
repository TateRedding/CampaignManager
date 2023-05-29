import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CharacterCard from "./Characters/CharacterCard";
import CampaignCard from "./Campaigns/CampaignCard";

const Profile = ({ token }) => {
    const [userData, setUserData] = useState({});
    const [campaignData, setCampaignData] = useState([]);
    const [characterData, setCharacterData] = useState([]);

    const navigate = useNavigate();

    const getUserData = async () => {
        try {
            const user = await axios.get('/api/users/me', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(user.data);
        } catch (error) {
            console.error(error);
        };
    };

    const getCampaignData = async () => {
        if (userData.username) {
            try {
                const campaigns = await axios.get(`/api/users/${userData.username}/campaigns`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCampaignData(campaigns.data);
            } catch (error) {
                console.error(error);
            };
        };
    };

    const getCharacterData = async () => {
        if (userData.username) {
            try {
                const characters = await axios.get(`/api/users/${userData.username}/characters`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCharacterData(characters.data);
            } catch (error) {
                console.error(error);
            };
        };
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        getCampaignData();
        getCharacterData();
    }, [userData]);

    // Future task: split characters and campaigns into tabs 
    return (
        <>
            <h1>My Profile</h1>
            <h2>My Characters</h2>
            <button className="btn btn-primary" onClick={() => navigate('/characters/new')}>New Character</button>
            {
                characterData.map((character, i) => {
                    return <CharacterCard character={character} key={i} />
                })
            }
            <h2>My Campaigns</h2>
            <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>New Campaign</button>
            {
                campaignData.map((campaign, i) => {
                    return <CampaignCard campaign={campaign} key={i} />
                })
            }
        </>
    )

};

export default Profile;