import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="card">
            <div className="card-body d-flex flex-column align-items-center">
                <h5 className="card-title text-center">Make friends. Play games. Slay Dragons.</h5>
                <div className="w-100 d-flex justify-content-around">
                    <button className="btn btn-primary" onClick={() => navigate("/campaigns")}>Find a Campaign</button>
                    <button className="btn btn-primary" onClick={() => navigate("/players")}>Find Players</button>
                </div>
            </div>
        </div>
    );
};

export default Home;