import React from "react";

const PrivateMessages = ({ userData }) => {
    return (
        userData.privateMessages.map(message => <p key={message.id}>{message.content}</p>)
    );
};

export default PrivateMessages;