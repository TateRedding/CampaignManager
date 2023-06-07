import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

import InviteCard from "./InviteCard";
import RequestCard from "./RequestCard";

const InvitesAndRequests = ({ token, userData }) => {
    const [invites, setInvites] = useState([]);
    const [requests, setRequests] = useState([]);

    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    };

    const query = useQuery();
    const tab = query.get("tab");

    const deleteMessage = async (message) => {
        const response = await axios.delete(`/api/messages/${message.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.data) {
            userData.invitations.splice(userData.invitations.indexOf(message), 1);
            updateArrays();
        };
    };

    const updateArrays = () => {
        if (userData.invitations) {
            setInvites(userData.invitations.filter(invitation => invitation.campaignCreatorId !== userData.id));
            setRequests(userData.invitations.filter(invitation => invitation.campaignCreatorId === userData.id));
        };
    };

    useEffect(() => {
        updateArrays();
    }, [userData.invitations]);

    return (
        <>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    {
                        !tab || tab === 'invites' ?
                            <Link
                                to="/invites?tab=invites"
                                className="nav-link active"
                                aria-current="page"
                            >
                                Invites
                            </Link>
                            :
                            <Link
                                to="/invites?tab=invites"
                                className="nav-link"
                            >
                                Invites
                            </Link>
                    }
                </li>
                <li className="nav-item">
                    {
                        tab === 'requests' ?
                            <Link
                                to="/invites?tab=requests"
                                className="nav-link active"
                                aria-current="page"
                            >
                                Requests
                            </Link>
                            :
                            <Link
                                to="/invites?tab=requests"
                                className="nav-link"
                            >
                                Requests
                            </Link>
                    }
                </li>
            </ul>
            <div>
                {
                    !tab || tab === "invites" ?
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
                        :
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
                }
            </div>
        </>
    );
};

export default InvitesAndRequests;