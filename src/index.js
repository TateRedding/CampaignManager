import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import NewCampaign from "./NewCampaign";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(window.localStorage.getItem('fitness-tracker-token'));

    const TOKEN_NAME = 'campaignManagerLoginToken';

    return (
        <>
            <main>
                <Routes>
                    <Route path='/login' element={
                        <Login
                            TOKEN_NAME={TOKEN_NAME}
                            setIsLoggedIn={setIsLoggedIn}
                        />}
                    />
                    <Route path='/register' element={
                        <Register
                            TOKEN_NAME={TOKEN_NAME}
                            setIsLoggedIn={setIsLoggedIn}
                        />}
                    />
                    <Route path='/campaigns/new' element={
                        <NewCampaign
                            TOKEN_NAME={TOKEN_NAME}
                        />
                    } />
                </Routes>
            </main>
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <HashRouter>
        <App />
    </HashRouter>
);