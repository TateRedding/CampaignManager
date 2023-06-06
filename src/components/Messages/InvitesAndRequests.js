import React, { useState, useEffect } from "react";
import axios from "axios";

import InviteCard from "./InviteCard";
import RequestCard from "./RequestCard";

const InvitesAndRequests = ({ invitationData, token, userId }) => {
    const [invites, setInvites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [tab, setTab] = useState(0);

    const deleteMessage = async (message) => {
        const response = await axios.delete(`/api/messages/${message.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.data) {
            invitationData.splice(invitationData.indexOf(message), 1);
            updateArrays();
        };
    };

    const updateArrays = () => {
        setInvites(invitationData.filter(invitation => invitation.campaignCreatorId !== userId));
        setRequests(invitationData.filter(invitation => invitation.campaignCreatorId === userId));
    };

    useEffect(() => {
        updateArrays();
    }, [invitationData]);

    return (
        <>
            <ul className="nav nav-tabs mb-3">
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
                        <>
                            <h4>When others want to join your campaign, their requests will show up here</h4>
                            {
                                requests.map(request => {
                                    return <RequestCard
                                        request={request}
                                        rejectRequest={deleteMessage}
                                        key={request.id}
                                    />
                                })
                            }
                        </>
                        :
                        <>
                            <h4>When others want you to join their campaign, their invitations will show up here</h4>
                            {
                                invites.map(invite => {
                                    return <InviteCard
                                        invite={invite}
                                        declineInvite={deleteMessage}
                                        key={invite.id}
                                    />
                                })
                            }
                        </>
                }
            </div>
        </>
    );
};

export default InvitesAndRequests;