import React, { useState } from "react";
import axios from "axios";

const NewCampaign = ({ token }) => {
    const [isLookingForPlayers, setIsLookingForPlayers] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const createCampaign = async (event) => {
        event.preventDefault();

        if (name) {
            const fields = {
                isLookingForPlayers,
                name,
                description,
                location
            };

            Object.keys(fields).map(key => (key !== 'isLookingForPlayers' && !fields[key]) ? delete fields[key] : null);

            try {
                const campaignResponse = await axios.post('/api/campaigns', fields, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (campaignResponse) {
                    const userCampaignResponse = await axios.post('/api/user_campaigns', {
                        userId: campaignResponse.data.creatorId,
                        campaignId: campaignResponse.data.id,
                        isDM: true
                    });
                    if (userCampaignResponse) {
                        setIsLookingForPlayers(true);
                        setName('');
                        setDescription('');
                        setLocation('');
                    }
                };
            } catch (error) {
                console.error(error);
            };
        };
    };

    return (
        <>
            <form autoComplete="off" onSubmit={createCampaign}>
                <div className="mb-3">
                    <label htmlFor="name-campaign" className="form-label">Campaign Name</label>
                    <input
                        className="form-control"
                        id="name-campaign"
                        value={name}
                        required
                        onChange={(event) => setName(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3">
                    <label htmlFor="description-campaign" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description-campaign"
                        rows="3"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}>
                    </textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="location-campaign" className="form-label">Location</label>
                    <input
                        className="form-control"
                        id="location-campaign"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}>
                    </input>
                </div>
                <div className="mb-3">
                    <label htmlFor="is-looking-for-players" className="form-check-label">Looking for more players?</label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="is-looking-for-players"
                        checked={isLookingForPlayers}
                        onChange={(event) => setIsLookingForPlayers(event.target.checked)}>
                    </input>
                </div>
                <button type="submit" className="btn btn-primary">Start your Journey!</button>
            </form>
        </>
    );
};

export default NewCampaign;