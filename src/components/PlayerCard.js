import React from "react";
import { useNavigate } from "react-router-dom";

const PlayerCard = ({ player }) => {
    const navigate = useNavigate();

    return (
        <div className="card mb-3">
            <div className="card-body d-flex">
                <div className="d-flex align-items-center me-3">
                    <img
                        className="avatar-lg"
                        src={player.imageURL ? player.imageURL : "../images/default_avatar.png"}
                        alt={`${player.username}'s avatar`}
                    />
                </div>
                <div className="flex-grow-1">
                    <div className="lfg-card-header d-flex">
                        {
                            player.location ?
                                <>
                                    <h5 className="card-title me-3">{player.username}</h5>
                                    <h6 className="divider">|</h6>
                                    <h6>{player.location}</h6>
                                </>
                                :
                                <h5 className="card-title">{player.username}</h5>
                        }
                    </div>
                    <p className="card-text"><b>About {player.username}</b></p>
                    <p className="card-text">{
                        player.bio ?
                            player.bio
                            :
                            "There's nothing here!"
                    }</p>
                    <div className="d-flex">
                        <div className="ms-auto">
                            <button className="btn btn-success me-3" onClick={() => console.log("send message")}>Send invite</button>
                            <button className="btn btn-primary" onClick={() => navigate(`/u/${player.username}`)}>View Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;