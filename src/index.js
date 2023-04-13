import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

const App = () => {
    return (
        <h1>Campaign Manager</h1>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <HashRouter>
        <App />
    </HashRouter>
);