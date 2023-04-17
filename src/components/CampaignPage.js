import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CampaignPage = () => {
    const [campaign, setCampaign] = useState({});
    const { campaignId } = useParams();

    const getCampaignData = async (campaignId) => {
        try {
            const _campaign = await axios.get(`/api/campaigns/${campaignId}`);
            setCampaign(_campaign.data);
        } catch (error) {
            console.error(error);
        };
    };

    useEffect(() => {
        getCampaignData(campaignId);
    }, []);

    return (
        <div className="card">
            <div className="card-body">
                <pre>{JSON.stringify(campaign, null, 2)}</pre>
            </div>
        </div>
    );
};

export default CampaignPage;