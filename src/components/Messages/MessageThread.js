import React from "react";
import { useNavigate } from "react-router-dom";
import SingleMessage from "./SingleMessage";

const MessageThread = ({ thread, parseDate, userData }) => {

    const navigate = useNavigate();

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target={`#message-thread-${thread.userId}`}
                    aria-expanded="false"
                    aria-controls={`message-thread-${thread.userId}`}
                >
                    <img
                        className="avatar-xsm me-2"
                        src={thread.avatarURL}
                        alt={`${thread.userId}'s avatar`}
                        onClick={() => navigate(`/u/${thread.username}`)}
                    />
                    {thread.username}
                </button>
            </h2>
            <div
                id={`message-thread-${thread.userId}`}
                className="accordion-collapse collapse"
                data-bs-parent={"#private--message-accordion"}>
                <div className="accordion-body">
                    {
                        thread.messages
                            .sort((a, b) => a.postDate > b.postDate)
                            .map(message => {
                                return (
                                    <div className="d-flex flex-column" key={message.id}>
                                        {
                                            message.senderId === userData.id ?
                                                <SingleMessage
                                                    message={message}
                                                    letter={userData.username[0]}
                                                    leftAlign={false}
                                                    parseDate={parseDate}
                                                />
                                                :
                                                <SingleMessage
                                                    message={message}
                                                    letter={thread.username[0]}
                                                    leftAlign={true}
                                                    parseDate={parseDate}
                                                />
                                        }
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </div>
    );
};

export default MessageThread;