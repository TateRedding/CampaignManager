import React from "react";

const CampaignCard = ({ campaign }) => {
    return (
        <div className="card">
            <div className="card-body overflow-auto">
                <pre>{JSON.stringify(campaign, null, 2)}</pre>
            </div>
        </div>
    );
};

export default CampaignCard;