import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCharacterCard = ({ character }) => {

    const navigate = useNavigate();

    const descriptorArray = [
        character.subspecies,
        character.species,
        character.subclass,
        character.class
    ];
    const descriptor = descriptorArray.filter(x => x).join(' ');

    return (
        <div className="card text-center w-25 m-3">
            <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
                <p>Level {character.level}</p>
                <p className="text-capitalize">{descriptor}</p>
                <button className="btn btn-outline-success" onClick={() => navigate(`/characters/${character.id}`)}>Character Sheet</button>
            </div>
        </div>
    );
};

export default ProfileCharacterCard;