import React from "react";
import './Navbar.css';
import Logo from "../Assets/bot-logo.png";

const Navbar = ({ conversationHeaders, onConversationClick }) => {
    return (
        <div className="react-navbar">
            <div className="react-navbar-logo">
                <img src={Logo} alt="logo" />
                <h1>SymptoCare</h1>
            </div>
            <h2>Conversations</h2>
            <ul>
                {conversationHeaders.map((header) => (
                <li key={header.id} onClick={() => onConversationClick(header.id)}>
                    {header.text}
                </li>
                ))}
                <li>Chat 1</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
                <li>I am suffering from Headache</li>
            </ul>
        </div>
    )
}

export default Navbar;