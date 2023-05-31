import React, { useState, useEffect } from "react";

const InvitationModal = ({ player, campaignData, campaign, userId }) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (campaign) {
            setMessage("Default request to join campaign message");
        } else {
            setMessage("Default invitation to join campaign message");
        };
    }, []);

    const sendInvitation = async () => {
        const messageData = {
            senderId: userId,
            isInvitation: true,
            content: message,
            isPublic: false
        };

        if (campaign) {
            messageData.recipientId = campaign.creatorId;
            messageData.campaignId = campaign.id;
        } else {
            messageData.recipientId = player.id;
            messageData.campaignId = Number(selectedCampaignId);
        };
        console.log(messageData);
    };

    return (
        <div
            className="modal fade"
            id="invite-modal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="invite-modal-label"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title">{
                            campaign ?
                                `Request to join ${campaign.name}`
                                :
                                `Invitation to ${player.username}`
                        }</h3>
                        <button
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                        </button>
                    </div>
                    <div className="modal-body">
                        {
                            campaign ?
                                null
                                :
                                <select
                                    className="form-select mb-2"
                                    value={selectedCampaignId}
                                    onChange={(event) => setSelectedCampaignId(event.target.value)}
                                >
                                    <option value={0}>Select Campaign</option>
                                    {
                                        campaignData
                                            .filter(campaign => campaign.creatorId === userId)
                                            .map(campaign => <option value={campaign.id} key={campaign.id}>{campaign.name}</option>)
                                    }
                                </select>
                        }
                        <textarea
                            className="form-control"
                            rows="3"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}>
                        </textarea>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                        <button
                            className="btn btn-success"
                            disabled={
                                ((!campaign && selectedCampaignId) || campaign) && message ?
                                    false : true
                            }
                            onClick={() => sendInvitation()}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationModal;