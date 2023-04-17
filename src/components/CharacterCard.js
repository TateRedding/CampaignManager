import React from "react";

const CharacterCard = ({ character }) => {
    return (
        <div className="card small">
            <div className="card-body overflow-auto">
                <pre>{JSON.stringify(character, null, 2)}</pre>
            </div>
        </div>
    );
};

export default CharacterCard;