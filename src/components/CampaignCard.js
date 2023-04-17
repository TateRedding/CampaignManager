import React from "react";
import { useNavigate } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
    const navigate = useNavigate();
    return (
        <div className="card small">
            <div className="card-body overflow-auto">
                <pre>{JSON.stringify(campaign, null, 2)}</pre>
                <button className="btn btn-primary" onClick={() => navigate(`/campaigns/${campaign.id}`)}>View Details</button>
            </div>
        </div>
    );
};

export default CampaignCard;