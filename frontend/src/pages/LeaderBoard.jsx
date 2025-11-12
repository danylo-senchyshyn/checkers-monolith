import React, { useEffect, useState } from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/leaderboard.css";

export default function LeaderBoard() {
    const [scores, setScores] = useState([]);
    const [usersMap, setUsersMap] = useState({}); // nickname -> avatarUrl
    const maxPlayers = 10;

    // Загружаем топ игроков с ScoreService
    useEffect(() => {
        fetch("/api/scores/top")
            .then(res => {
                if (!res.ok) throw new Error("Не удалось загрузить лидерборд");
                return res.json();
            })
            .then(setScores)
            .catch(err => console.error("Failed to load leaderboard:", err));
    }, []);

    // Загружаем пользователей с UserService, чтобы получить аватарки
    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(users => {
                const map = {};
                users.forEach(user => {
                    map[user.nickname] = user.avatarUrl || "/images/board/empty_black.png";
                });
                setUsersMap(map);
            })
            .catch(err => console.error("Failed to load users:", err));
    }, []);

    return (
        <>
            <Header />

            <div className="leaderboard-container">
                <h2 className="leaderboard-title">🏆 Leaderboard</h2>

                {Array.from({ length: maxPlayers }, (_, i) => {
                    const score = i < scores.length ? scores[i] : null;

                    if (!score) {
                        return <div key={i} className={`player shade-${i}`} />;
                    }

                    const avatarSrc = usersMap[score.nickname] || "/images/board/empty_black.png";

                    return (
                        <div key={i} className={`player shade-${i}`}>
                            <img className="avatar" src={avatarSrc} alt="avatar" />
                            <span className="nickname">{score.nickname}</span>
                            <span className="points">{score.totalPoints}</span>
                        </div>
                    );
                })}
            </div>

            <Footer />
        </>
    );
}