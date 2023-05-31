import axios from "axios";
import React, { useState, useEffect } from "react";

import CampaignCard from "./CampaignCard";

const LookingForCampaigns = ({ userId }) => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const getCampaigns = async () => {
            try {
                const response = await axios.get("/api/campaigns");
                setCampaigns(response.data);
            } catch (error) {
                console.error(error);
            };
        };
        getCampaigns();
    }, []);

    return (
        <>
            {
                campaigns.map(campaign => {
                    return <CampaignCard
                        campaign={campaign}
                        userId={userId}
                        key={campaign.id}
                    />
                })
            }
        </>
    );
};

export default LookingForCampaigns;