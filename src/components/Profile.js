import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = ({ TOKEN_NAME }) => {
    const [userData, setUserData] = useState({});
    const [campaignData, setCampaignData] = useState([]);
    const [characterData, setCharacterData] = useState([]);

    const getUserData = async () => {
        try {
            const user = await axios.get('/api/users/me', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem(TOKEN_NAME)}`
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
                        'Authorization': `Bearer ${window.localStorage.getItem(TOKEN_NAME)}`
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
                        'Authorization': `Bearer ${window.localStorage.getItem(TOKEN_NAME)}`
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

        </>
    )

};

export default Profile;