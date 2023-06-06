import axios from "axios";
import React, { useState, useEffect } from "react";

import PlayerCard from "./PlayerCard";

const LookingForPlayers = ({ token, userData }) => {
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
                    if (player.id !== userData.id) {
                        return <PlayerCard
                            player={player}
                            token={token}
                            userData={userData}
                            key={player.id}
                        />
                    }
                })
            }
        </>
    );
};

export default LookingForPlayers;