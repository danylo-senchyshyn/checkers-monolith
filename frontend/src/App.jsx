import {Routes, Route} from "react-router-dom";
import React from "react";

import Home from "./pages/Home.jsx";
import Rules from "./pages/Rules.jsx";
import About from "./pages/About.jsx";
import Reviews from "./pages/review/Reviews.jsx";
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Game from "./pages/game/Game.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/rules" element={<Rules/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/reviews" element={<Reviews/>}/>
            <Route path="/leaderboard" element={<LeaderBoard/>}/>
            <Route path="/game" element={<Game/>}/>
        </Routes>
    );
}