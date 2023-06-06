import React from "react";
import { useNavigate } from "react-router-dom";

const MessageThread = ({ messages, userId }) => {

    const navigate = useNavigate();

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button
                    className="accordion-button collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target={`#message-thread-${messages[0].otherPartyUsername}`}
                    aria-expanded="false"
                    aria-controls={`message-thread-${messages[0].otherPartyUsername}`}
                >
                    <img
                        className="avatar-xsm me-2"
                        src={messages[0].otherPartyAvatarURL ? messages[0].otherPartyAvatarURL : "../images/default_avatar.png"}
                        alt={`${messages[0].otherPartyUsername}'s avatar`}
                        onClick={() => navigate(`/u/${messages[0].otherPartyUsername}`)}
                    />
                    {messages[0].otherPartyUsername}
                </button>
            </h2>
            <div
                id={`message-thread-${messages[0].otherPartyUsername}`}
                className="accordion-collapse collapse"
                data-bs-parent={"#private--message-accordion"}>
                <div className="accordion-body">
                    {
                        messages
                            .sort((a, b) => a.postDate > b.postDate)
                            .map(message => {
                                const date = new Date(Date.parse(message.postDate))
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
                                date[3] = `${time[0]}:${time[1]} ${time[2]}`   

                                console.log(date);

                                return (
                                    <div className="d-flex flex-column" key={message.id}>
                                        {
                                            message.senderId === userId ?
                                                <>
                                                    <p className="mb-0 ms-auto">{message.content}</p>
                                                    <p className="ms-auto">{date.join(' ')}</p>
                                                </>
                                                :
                                                <>
                                                    <p className="mb-0">{message.content}</p>
                                                    <p>{date.join(' ')}</p>
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