import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RequestCard = ({ request, rejectRequest }) => {
    const [player, setPlayer] = useState({});
    const [campaignName, setCampaignName] = useState('');

    const acceptRequest = async () => {

    };

    useEffect(() => {
        const getPlayerData = async () => {
            const response = await axios.get(`/api/users/id/${request.senderId}`);
            setPlayer(response.data);
        };

        const getCampaignName = async () => {
            const response = await axios.get(`/api/campaigns/${request.campaignId}`);
            setCampaignName(response.data.name);
        };
        
        getPlayerData();
        getCampaignName();
    }, []);
    return (
        <div className="card mb-3">
            <div className="card-body d-flex">
                <div className="d-flex align-items-center me-3">
                    <Link to={`/u/${player.username}`}>
                        <img
                            className="avatar-lg"
                            src={player.imageURL ? player.imageURL : "../images/default_avatar.png"}
                            alt={`${player.username}'s avatar`}
                            onClick={() => navigate(`/u/${player.username}`)}
                        />
                    </Link>
                </div>
                <div className="flex-grow-1">
                    <h5 className="card-title">{player.username} wants to join {campaignName}</h5>
                    <p className="card-text">{request.content}</p>
                    <div className="d-flex">
                        <div className="ms-auto">
                            <button className="btn btn-success me-3" onClick={() => acceptRequest()}>Accept</button>
                            <button className="btn btn-danger" onClick={() => rejectRequest(request)}>Reject</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default RequestCard;