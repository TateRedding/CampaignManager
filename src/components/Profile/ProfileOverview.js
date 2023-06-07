import React from "react";

const ProfileOverview = ({ profileData, parseDate, isLoggedInUser }) => {
    const getName = () => {
        if (isLoggedInUser) {
            if (!profileData.firstName && !profileData.surname) {
                return null;
            } else {
                let name = '';
                if (profileData.firstName) {
                    name += profileData.firstName;
                };
                if (profileData.surname) {
                    if (name) {
                        name += ' ';
                    };
                    name += profileData.surname;
                };
                return name;
            };
        } else {
            return null;
        }
    };
    const name = getName();

    return (
        <div className="d-flex profile-overview">
            <div className="d-flex flex-column align-items-center avatar-container">
                <img
                    className="avatar-xlg mb-3"
                    src={profileData.avatarURL}
                    alt={`${profileData.username}'s avatar`}
                />
                {
                    isLoggedInUser ?
                        <>
                            <button className="btn btn-outline-primary mb-3">Change Image</button>
                            <button className="btn btn-outline-success mb-3">Edit Profile</button>
                        </>
                        :
                        null
                }
            </div>
            <div className="flex-grow-1">
                <h2>{profileData.username}</h2>
                {
                    isLoggedInUser ?
                        <>
                            {
                                name ?
                                    <p>{name}</p>
                                    :
                                    null
                            }
                            <p>{profileData.location}</p>
                            <p>{profileData.email}</p>
                        </>
                        :
                        null
                }
                <p>Member since: {parseDate(profileData.registerDate).split(' ').slice(1, 4).join(' ')}</p>
                <p className="mb-0"><b>About Me:</b></p>
                <p>{profileData.bio ? profileData.bio : "There's nothing here!"}</p>
            </div>
        </div>
    );
};

export default ProfileOverview