import React, { useState, useEffect } from "react";

import InviteCard from "./InviteCard";
import RequestCard from "./RequestCard";

const InvitesAndRequests = ({ invitationData, userId }) => {
    const [invites, setInvites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        setInvites(invitationData.filter(invitation => invitation.recipientId === userId));
        setRequests(invitationData.filter(invitation => invitation.senderId === userId));
    }, [invitationData]);

    return (
        <>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    {
                        tab === 0 ?
                            <button
                                className="nav-link active"
                                aria-current="page"
                            >
                                Invites
                            </button>
                            :
                            <button
                                className="nav-link"
                                onClick={() => setTab(0)}
                            >
                                Invites
                            </button>
                    }
                </li>
                <li className="nav-item">
                    {
                        tab === 1 ?
                            <button
                                className="nav-link active"
                                aria-current="page"
                            >
                                Requests
                            </button>
                            :
                            <button
                                className="nav-link"
                                onClick={() => setTab(1)}
                            >
                                Requests
                            </button>
                    }
                </li>
            </ul>
            <div>
                {
                    tab ?
                        requests.map(request => <RequestCard request={request} key={request.id} />)
                        :
                        invites.map(invite => <InviteCard invite={invite} key={invite.id} />)

                }
            </div>
        </>
    );
};

export default InvitesAndRequests;