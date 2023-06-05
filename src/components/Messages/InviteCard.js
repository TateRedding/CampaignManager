import React from "react";

const InviteCard = ({ invite }) => {
    console.log(invite);
    return (
        <p>{invite.content}</p>
    );
};

export default InviteCard;