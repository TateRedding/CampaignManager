import React from "react";
import { useNavigate } from "react-router-dom";
import InvitationModal from "../Messages/InvitationModal";

const CampaignCard = ({ campaign, token, userId }) => {
    const navigate = useNavigate();

    const isInCampaign = Boolean(campaign.users.find(userCampaign => userCampaign.userId === userId));

    const imageAreaStyle = {
        width: "200px",
        height: "200px"
    };

    return (
        <>
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
                        <div className="lfg-card-header d-flex">
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
                        <p className="card-text"><b>About {campaign.name}</b></p>
                        <p className="card-text">{
                            campaign.bio ?
                                campaign.bio
                                :
                                "There's nothing here!"
                        }</p>
                        <div className="d-flex">
                            <div className="ms-auto">
                                {
                                    isInCampaign ?
                                        <button className="btn btn-success me-3" disabled>You're already in this campaign!</button>
                                        :
                                        <button className="btn btn-success me-3" data-bs-toggle="modal" data-bs-target={`#request-modal-${campaign.id}`}>Request to join</button>
                                }
                                <button className="btn btn-primary" onClick={() => navigate(`/campaigns/${campaign.id}`)}>View Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <InvitationModal
                campaign={campaign}
                token={token}
                userId={userId}
            />
        </>
    );
};

export default CampaignCard;