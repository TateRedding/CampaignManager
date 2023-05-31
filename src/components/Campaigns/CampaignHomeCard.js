import React from "react";
import { useNavigate } from "react-router-dom";

const CampaignHomeCard = ({ campaign, userData }) => {
    const navigate = useNavigate();

    const userCampaign = campaign.users.find(user => user.userId === userData.id);

    return (
        <div className="card m-3" style={{ width: "400px" }}>
            <div className="card-body d-flex flex-column align-items-center text-center">
                <h5 className="card-title">{campaign.name}</h5>
                <p className="card-text">
                    {
                        userCampaign.isDM ?
                            "Dungeon Master"
                            :
                            userCampaign.characterId ?
                                userCampaign.characterName
                                :
                                "You do not currently have a character is this campaign!"
                    }
                </p>
                {
                    campaign.imageURL ?
                        <img src={campaign.imageURL} alt={`${campaign.name} thumbnail image`} />
                        :
                        <p className="card-text">No image available.</p>
                }
                <button className="btn btn-success" onClick={() => navigate(`/campaigns/${campaign.id}`)}>Go to Campaign Page</button>
            </div>
        </div>
    );
};

export default CampaignHomeCard;