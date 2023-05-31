import axios from "axios";
import React, { useState, useEffect } from "react";

import PlayerCard from "./PlayerCard";

const LookingForPlayers = ({ campaignData, userId }) => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const getPlayers = async () => {
            try {
                const response = await axios.get("/api/users");
                setPlayers(response.data);
            } catch (error) {
                console.error(error);
            };
        };
        getPlayers();
    }, []);

    return (
        <>
            {
                players.map(player => {
                    return <PlayerCard
                        player={player}
                        campaignData={campaignData}
                        userId={userId}
                        key={player.id}
                    />
                })
            }
        </>
    );
};

export default LookingForPlayers;