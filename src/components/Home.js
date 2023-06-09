import React from "react";
import { useNavigate } from "react-router-dom";

import CampaignHomeCard from "./Campaigns/CampaignHomeCard";

const Home = ({ userData }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="card mb-3">
                <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title text-center">Make friends. Play games. Slay Dragons.</h5>
                    <div className="w-100 d-flex justify-content-around">
                        <button className="btn btn-primary" onClick={() => navigate("/lfg/campaigns")}>Find a Campaign</button>
                        <button className="btn btn-primary" onClick={() => navigate("/lfg/players")}>Find Players</button>
                    </div>
                </div>
            </div>
            {
                Object.keys(userData).length && userData.campaigns.length ?
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">Your Campaigns</h5>
                            <div className="d-flex flex-wrap justify-content-around">
                                {
                                    userData.campaigns.map(campaign => <CampaignHomeCard campaign={campaign} userData={userData} key={campaign.id} />)
                                }

                            </div>
                        </div>
                    </div>
                    :
                    null
            }
        </>
    );
};

export default Home;