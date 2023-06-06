import React from "react";

const PrivateMessages = ({ privateMessageData }) => {
    return (
        privateMessageData.map(message => <p key={message.id}>{message.content}</p>)
    );
};

export default PrivateMessages;