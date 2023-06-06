import React, { useState, useEffect } from "react";
import MessageThread from "./MessageThread";

const PrivateMessages = ({ userData }) => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const messageThreads = {};
        if (userData.privateMessages) {
            userData.privateMessages.forEach((message) => {
                let currUserId;
                message.senderId === userData.id ? currUserId = message.recipientId : currUserId = message.senderId;
                if (messageThreads[currUserId]) {
                    messageThreads[currUserId].push(message);
                } else {
                    messageThreads[currUserId] = [message];
                };
            });
            setThreads(messageThreads);
        };
    }, [userData]);

    return (
        <div className="accordion" id="private-message-accordion">
            {
                Object.keys(threads).map((key, i) => {
                    return <MessageThread
                        messages={threads[key]}
                        userId={userData.id}
                        key={i}
                    />
                })
            }
        </div>
    );
};

export default PrivateMessages;