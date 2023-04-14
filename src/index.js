import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(window.localStorage.getItem('fitness-tracker-token'));

    return (
        <>
            <main>
                <Routes>
                    <Route path="/login" element={
                        <Login
                            setIsLoggedIn={setIsLoggedIn}
                        />}
                    />
                </Routes>
            </main>
        </>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <HashRouter>
        <App />
    </HashRouter>
);