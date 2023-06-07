import React from "react";
import MessageThread from "./MessageThread";

const PrivateMessages = ({ userData, parseDate }) => {

    return (
        <div className="accordion" id="private-message-accordion">
            {
                userData.privateMessages ?
                    userData.privateMessages.map((thread) => {
                        return <MessageThread
                            thread={thread}
                            parseDate={parseDate}
                            userData={userData}
                            key={thread.userId}
                        />
                    })
                    :
                    <h4>You do not have any private messages yet!</h4>
            }
        </div>
    );
};

export default PrivateMessages;