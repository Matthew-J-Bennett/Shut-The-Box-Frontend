import './App.css';
import React from 'react';
import {useNavigate} from "react-router-dom";


export default function NotFound(props) {
    const navigate = useNavigate();

    function backHome() {
        navigate("/");

    }

    return (
        <header className="App-header">
            <h1>404 - Page Not Found!</h1>
            <button onClick={backHome}>Main Menu</button>
        </header>
    )
}

