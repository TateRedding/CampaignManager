import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NewCampaign = ({ TOKEN_NAME, userData }) => {
    const [isPublic, setIsPublic] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const createCampaign = async (event) => {
        event.preventDefault();

        console.log(userData);

        if (name) {
            const fields = {
                isPublic,
                name,
                description,
                location
            };

            Object.keys(fields).map(key => (key !== 'isPublic' && !fields[key]) ? delete fields[key] : null);

            try {
                const response = await axios.post('/api/campaigns', fields, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem(TOKEN_NAME)}`
                    }
                });
                if (response) {
                    const _response = await axios.post('/api/user_campaigns', {
                        userId: response.data.creatorId,
                        campaignId: response.data.id,
                        isDM: true
                    });
                    if (_response) {
                        console.log(response);
                        console.log(_response);
                        setIsPublic(true);
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
                    <label htmlFor="is-public-campaign" className="form-check-label">Public</label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="is-public-campaign"
                        checked={isPublic}
                        onChange={(event) => (event.target.value)}>
                    </input>
                </div>
                <button type="submit" className="btn btn-primary">Start your Journey!</button>
            </form>
        </>
    );
};

export default NewCampaign;