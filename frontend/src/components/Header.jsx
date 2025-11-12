import React from 'react';
import { NavLink } from "react-router-dom";
import board_checkers from "../images/board/board_checkers.png";
import "./header.css";

export default function Header() {
    return (
        <header>
            <div className="header-title">
                <h1>Checkers - Monolith</h1>
                <img
                    src={board_checkers}
                    alt="Checkers Logo"
                    className="checkers_logo"
                />
            </div>

            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/leaderboard"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Leaderboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/reviews"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Reviews
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/rules"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Rules
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            About
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}