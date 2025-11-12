import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/home.css"
import "../styles/player_avatar.css"

export default function Home() {
    const avatarModules = import.meta.glob("../images/player_avatar/*.gif", { eager: true });
    const avatars = Object.values(avatarModules).map((m) => m.default);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(1);
    const navigate = useNavigate();

    const nextAvatar1 = () => setIndex1((index1 + 1) % avatars.length);
    const prevAvatar1 = () => setIndex1((index1 - 1 + avatars.length) % avatars.length);
    const nextAvatar2 = () => setIndex2((index2 + 1) % avatars.length);
    const prevAvatar2 = () => setIndex2((index2 - 1 + avatars.length) % avatars.length);

    const handleConfirm = async () => {
        if (!player1Name.trim() || !player2Name.trim()) {
            alert("⚠️ Please enter both player names.");
            return;
        }

        const player1 = { nickname: player1Name, avatarUrl: avatars[index1] };
        const player2 = { nickname: player2Name, avatarUrl: avatars[index2] };

        try {
            const savePlayer = async (player) => {
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(player),
                });

                if (!res.ok) throw new Error(`Failed to save player: ${player.nickname}`);
                return res.json();
            };

            const savedPlayer1 = await savePlayer(player1);
            const savedPlayer2 = await savePlayer(player2);

            console.log("✅ Players stored in DB:", savedPlayer1, savedPlayer2);

            // ✅ Start new game with correct endpoint
            const response = await fetch("/api/game/start", {  // gateway
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    whitePlayer: savedPlayer1.nickname,
                    blackPlayer: savedPlayer2.nickname,
                    whiteAvatarUrl: savedPlayer1.avatarUrl,
                    blackAvatarUrl: savedPlayer2.avatarUrl,
                }),
            });

            if (!response.ok) throw new Error("Game initialization failed");

            const gameState = await response.json();
            console.log("🎮 Game initialized:", gameState);

            // ✅ Navigate with gameId
            navigate("/game");

        } catch (error) {
            console.error(error);
            alert("❌ Error occurred. Try again.");
        }
    };

    return (
        <>
            <Header />

            <div className="homePage">
                <h2>Welcome to Checkers!</h2>
                <p>Join us for a game of strategy and skill.</p>
                <button className="start-game" onClick={() => setIsModalOpen(true)}>
                    Start Game
                </button>
            </div>

            {isModalOpen && (
                <div className="game-modal" onClick={(e) => e.target.className === "game-modal" && setIsModalOpen(false)}>
                    <div className="game-modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
                        <h3>Enter player info</h3>

                        <div className="players-container">
                            {/* Player 1 */}
                            <div className="player-section">
                                <h4>Player 1</h4>
                                <input
                                    type="text"
                                    placeholder="Enter name..."
                                    id="player1Name"
                                    value={player1Name}
                                    onChange={(e) => setPlayer1Name(e.target.value)}
                                />
                                <div className="avatar-section">
                                    <label>Choose Avatar:</label>
                                    <div className="avatar-selector">
                                        <button onClick={prevAvatar1}>&#8592;</button>
                                        <img src={avatars[index1]} alt="Avatar 1" />
                                        <button onClick={nextAvatar1}>&#8594;</button>
                                    </div>
                                </div>
                            </div>

                            {/* Player 2 */}
                            <div className="player-section">
                                <h4>Player 2</h4>
                                <input
                                    type="text"
                                    placeholder="Enter name..."
                                    id="player2Name"
                                    value={player2Name}
                                    onChange={(e) => setPlayer2Name(e.target.value)}
                                />
                                <div className="avatar-section">
                                    <label>Choose Avatar:</label>
                                    <div className="avatar-selector">
                                        <button onClick={prevAvatar2}>&#8592;</button>
                                        <img src={avatars[index2]} alt="Avatar 2" />
                                        <button onClick={nextAvatar2}>&#8594;</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button id="confirmSelection" onClick={handleConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}