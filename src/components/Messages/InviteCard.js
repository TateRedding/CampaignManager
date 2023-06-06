import axios from "axios";
import React, { useEffect, useState } from "react";

const InviteCard = ({ invite, declineInvite }) => {
    const [campaign, setCampaign] = useState({});
    const [senderName, setSenderName] = useState('');

    const imageAreaStyle = {
        width: "200px",
        height: "200px"
    };

    const acceptInvite = async () => {

    };

    useEffect(() => {
        const getCampaignData = async () => {
            const response = await axios.get(`/api/campaigns/${invite.campaignId}`);
            setCampaign(response.data);
        };

        const getSenderName = async () => {
            const response = await axios.get(`/api/users/id/${invite.senderId}`);
            setSenderName(response.data.username);
        };

        getCampaignData();
        getSenderName();
    }, []);

    return (
        <div className="card mb-3">
            <div className="card-body d-flex">
                <div className="d-flex align-items-center me-3">
                    {
                        campaign.imageURL ?
                            <img
                                style={imageAreaStyle}
                                src={campaign.imageURL}
                                alt={`${campaign.name}'s banner image`}
                            />
                            :
                            <div
                                className="card"
                                style={imageAreaStyle}
                            >
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <p className="card-text text-center">No image to display</p>
                                </div>
                            </div>
                    }
                </div>
                <div className="flex-grow-1">
                    <div className="name-location-header d-flex">
                        {
                            campaign.location ?
                                <>
                                    <h5 className="card-title me-3">{campaign.name}</h5>
                                    <h6 className="divider">|</h6>
                                    <h6>{campaign.location}</h6>
                                </>
                                :
                                <h5 className="card-title">{campaign.name}</h5>
                        }
                    </div>
                    <p className="card-text"><i>From {senderName}</i></p>
                    <p className="card-text">{invite.content}</p>
                    {
                        campaign.description ?
                            <>
                                <p className="card-text"><b>About {campaign.name}</b></p>
                                <p className="card-text">{campaign.description}</p>
                            </>
                            :
                            <p className="card-text">This campaign does not have a bio.</p>
                    }
                    <div className="d-flex">
                        <div className="ms-auto">
                            <button className="btn btn-success me-3" onClick={() => acceptInvite()}>Accept</button>
                            <button className="btn btn-danger" onClick={() => declineInvite(invite)}>Decline</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteCard;