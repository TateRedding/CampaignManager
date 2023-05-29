import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CampaignPage = ({ token, userData }) => {
    const [campaign, setCampaign] = useState({});
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [recipientId, setRecipientId] = useState(0);
    const { campaignId } = useParams();

    const getCampaignData = async () => {
        try {
            const response = await axios.get(`/api/campaigns/${campaignId}`);
            if (!response.data.error) {
                setCampaign(response.data);
            };
        } catch (error) {
            console.error(error);
        };
    };

    const sendMessage = async (event) => {
        event.preventDefault();

        if (content) {
            const fields = {
                campaignId: campaign.id,
                content,
                isPublic
            };

            if (!isPublic) {
                if (recipientId) {
                    fields.recipientId = recipientId
                } else {
                    return;
                };
            };

            try {
                const response = await axios.post('/api/messages', fields, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response) {
                    setContent('');
                    setIsPublic(true);
                    setRecipientId(0);
                    getCampaignData();
                };
            } catch (error) {
                console.error(error);
            };
        };
    };

    useEffect(() => {
        getCampaignData();
    }, []);

    return (
        <div className="card">
            <div className="card-body">
                <pre>{JSON.stringify(campaign, null, 2)}</pre>
                {
                    (Object.keys(campaign).length) ?
                        <form autoComplete="off" onSubmit={sendMessage}>
                            <div className="mb-3">
                                <label htmlFor="campaign-message" className="form-label">Message</label>
                                <input
                                    className="form-control"
                                    id="campaign-message"
                                    value={content}
                                    required
                                    onChange={(event) => setContent(event.target.value)} >
                                </input>
                            </div>

                            <div className="row g-3 align-items-center">
                                <div className="mb-3 col-auto">
                                    <label htmlFor="is-public-message" className="form-check-label">Private</label>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="is-public-message"
                                        checked={!isPublic}
                                        onChange={(event) => setIsPublic(!event.target.checked)}>
                                    </input>
                                </div>
                                {
                                    (isPublic) ?
                                        null :
                                        <div className="mb-3 col-auto">
                                            <select className="mb-3 form-select col-auto"
                                                aria-label="Select recipient"
                                                defaultValue={0}
                                                onChange={(event) => setRecipientId(event.target.value)}>
                                                <option value={0}>Select Recipient</option>
                                                {
                                                    campaign.players.map((player, i) => {
                                                        if (player.username !== userData.username) {
                                                            return <option key={i} value={player.id}>{player.username}</option>
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                }
                            </div>
                            <button type="submit" className="btn btn-primary">Send</button>
                        </form> :
                        null
                }
            </div>
        </div>
    );
};

export default CampaignPage;