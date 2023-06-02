import React from "react";

const InvitesAndRequests = ({ invitationData }) => {
    return (
        <ul>
            {
                invitationData.map(invite => <p key={invite.id}>{invite.content}</p>)
            }
        </ul>
    );
};

export default InvitesAndRequests;