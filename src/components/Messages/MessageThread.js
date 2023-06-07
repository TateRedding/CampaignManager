import React from "react";
import { useNavigate } from "react-router-dom";

const MessageThread = ({ thread, userData }) => {

    const navigate = useNavigate();

    const parseDate = (postDate) => {
        const date = new Date(Date.parse(postDate))
            .toString()
            .split(' ')
        date.splice(3, 1);
        date.splice(4);
        const time = date[3].split(':');
        (time[0] / 12 >= 1) ? time[2] = 'PM' : time[2] = 'AM'
        time[0] = time[0] % 12
        if (time[0] === 0) {
            time[0] = 12;
        };
        date[3] = `${time[0]}:${time[1]} ${time[2]}`;
        console.log(date);
        return date.join(' ');
    };

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
                        src={thread.avatarURL ? thread.avatarURL : "../images/default_avatar.png"}
                        alt={`${thread.userId}'s avatar`}
                        onClick={() => navigate(`/u/${thread.userId}`)}
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
                                                <>
                                                    <p className="mb-0 ms-auto">{message.content}</p>
                                                    <p className="ms-auto">{parseDate(message.postDate)}</p>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-0">{message.content}</p>
                                                    <p>{parseDate(message.postDate)}</p>
                                                </>
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