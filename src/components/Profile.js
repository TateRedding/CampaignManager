import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CharacterCard from "./Characters/CharacterCard";
import CampaignCard from "./Campaigns/CampaignCard";

const Profile = ({ campaignData, characterData }) => {
    

    const navigate = useNavigate();

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