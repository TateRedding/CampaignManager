import React from "react";

const CharacterCard = ({ character }) => {
    return (
        <div className="card">
            <div className="card-body">
                <pre>{JSON.stringify(character, null, 2)}</pre>
            </div>
        </div>
    );
};

export default CharacterCard;