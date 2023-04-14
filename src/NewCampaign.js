import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NewCampaign = () => {
    const [public, setPublic] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const createCampaign = (event) => {
        event.preventDefault();

        try {

        } catch (error) {
            console.error(error);
        };
    };

    return (
        <p>New Campaign</p>
    );
};

export default NewCampaign;