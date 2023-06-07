import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = ({ userData }) => {
    const [profileData, setProfileData] = useState({});

    const { username } = useParams();

    useEffect(() => {
        const getProfileData = async () => {
            if (username === userData.username) {
                setProfileData(userData);
            } else {
                try {
                    const response = await axios.get(`/api/users/username/${username}`);
                    setProfileData(response.data);
                } catch (error) {
                    console.error(error);
                };
            };
        };
        getProfileData();
    }, []);

    return (
        <p>{profileData.username ? profileData.username : null}</p>
    );
};

export default Profile;