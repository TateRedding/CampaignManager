import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import ProfileOverview from "./ProfileOverview";

const ProfilePage = ({ parseDate, useQuery, userData }) => {
    const [profileData, setProfileData] = useState({});
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);

    const { username } = useParams();

    const query = useQuery();
    const tab = query.get("tab");

    useEffect(() => {
        const getProfileData = async () => {
            if (username === userData.username) {
                setProfileData(userData);
                setIsLoggedInUser(true);
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
    }, [userData]);

    return (
        <>
            <ul className="nav nav-tabs my-5">
                <li className="nav-item">
                    <Link
                        to={`/u/${username}?tab=overview`}
                        className={!tab || tab === 'overview' ? "nav-link active" : "nav-link"}
                        aria-current={!tab || tab === 'overview' ? "page" : "false"}
                    >
                        Overview
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to={`/u/${username}?tab=characters`}
                        className={tab === 'characters' ? "nav-link active" : "nav-link"}
                        aria-current={tab === 'characters' ? "page" : "false"}
                    >
                        {
                            isLoggedInUser ?
                                "My Characters"
                                :
                                "Characters"
                        }
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to={`/u/${username}?tab=campaigns`}
                        className={tab === 'campaigns' ? "nav-link active" : "nav-link"}
                        aria-current={tab === 'campaigns' ? "page" : "false"}
                    >
                        {
                            isLoggedInUser ?
                                "My Campaigns"
                                :
                                "Campaigns"
                        }
                    </Link>
                </li>
            </ul>
            {
                !tab || tab === 'overview' ?
                    <ProfileOverview
                        profileData={profileData}
                        parseDate={parseDate}
                        isLoggedInUser={isLoggedInUser}
                    />
                    :
                    null
            }
        </>
    );
};

export default ProfilePage;