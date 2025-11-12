// src/pages/Game.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/game.css";
import whiteChecker from "../../images/board/white_checker.png";
import whiteKing from "../../images/board/white_king.png";
import blackChecker from "../../images/board/black_checker.png";
import blackKing from "../../images/board/black_king.png";
import emptyWhite from "../../images/board/empty_white.png";
import emptyBlack from "../../images/board/empty_black.png";

export default function Game() {
    const navigate = useNavigate();

    const [state, setState] = useState(null); // GameStateDTO
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null); // {row, col}
    const [possibleMoves, setPossibleMoves] = useState([]); // [{row,col},...]
    const [error, setError] = useState(null);
    const [showGameOver, setShowGameOver] = useState(false);
    const [scoreSaved, setScoreSaved] = useState(false);

    // загрузить текущее состояние игры
    const loadState = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/game");
            if (res.status === 404) {
                setError("Игра завершена или не запущена");
                setState({ state: "FINISHED" });
                setShowGameOver(true);
                return;
            }
            if (!res.ok) throw new Error("Не удалось получить состояние игры");
            const dto = await res.json();
            setState(dto);
            setShowGameOver(dto.state !== "PLAYING");
        } catch (err) {
            console.error(err);
            setError("Ошибка при загрузке игры.");
        } finally {
            setLoading(false);
            // сброс выделения/возможных ходов при обновлении
            setSelected(null);
            setPossibleMoves([]);
        }
    };

    useEffect(() => {
        loadState()
    }, []);

    useEffect(() => {
        if (state && state.state !== "PLAYING" && !scoreSaved) {
            const winner = state.state === "WHITE_WON" ? state.whitePlayer?.nickname : state.blackPlayer?.nickname;
            const winnerScore = state.state === "WHITE_WON" ? state.whiteScore : state.blackScore;

            if (winner) {
                fetch("/api/scores", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        nickname: winner,
                        points: winnerScore
                    })
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Не удалось сохранить счет");
                    }
                    setScoreSaved(true);
                })
                .catch(err => {
                    console.error(err);
                    setError("Ошибка при сохранении счета");
                });
            }
        }
    }, [state, scoreSaved]);


    // пользователь кликнул на клетку
    const onCellClick = async (r, c) => {
        if (!state) return;

        // если сейчас модалка "конец игры" — ничего не делать
        if (state.state !== "PLAYING") return;

        // если уже выбрана клетка и пользователь кликнул по одной из возможных — сделать ход
        const found = possibleMoves.find(m => m[0] === r && m[1] === c);
        if (selected && found) {
            await makeMove(selected.row, selected.col, r, c);
            return;
        }

        // если кликнули по пустой клетке или по чужой фигуре — сброс
        const tile = state.board[r][c];
        const isEmpty = tile.startsWith("EMPTY");
        const whiteTurn = state.currentTurn === "WHITE";
        const pieceIsWhite = tile === "WHITE" || tile === "WHITE_KING";
        const pieceIsBlack = tile === "BLACK" || tile === "BLACK_KING";

        // Если кликнули на свою фигуру — запрос возможных ходов
        if (!isEmpty && ((whiteTurn && pieceIsWhite) || (!whiteTurn && pieceIsBlack))) {
            setSelected({ row: r, col: c });
            // fetch possible moves
            try {
                const res = await fetch(`/api/game/moves?row=${r}&col=${c}`);
                if (!res.ok) throw new Error("Не удалось получить возможные ходы");
                const dto = await res.json();
                setPossibleMoves(dto.moves || []);
            } catch (err) {
                console.error(err);
                setError("Ошибка при получении возможных ходов");
                setPossibleMoves([]);
            }
        } else {
            // сброс выделения
            setSelected(null);
            setPossibleMoves([]);
        }
    };

    // отправка хода на бек
    const makeMove = async (fromRow, fromCol, toRow, toCol) => {
        try {
            const res = await fetch("/api/game/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fromRow, fromCol, toRow, toCol })
            });
            if (!res.ok) {
                // попытка получить текст ошибки
                const txt = await res.text().catch(() => null);
                throw new Error(txt || "Invalid move");
            }
            // после успешного хода запросим состояние заново
            await loadState();
        } catch (err) {
            console.error("Move error:", err);
            setError(err.message || "Ошибка при выполнении хода");
        } finally {
            setSelected(null);
            setPossibleMoves([]);
        }
    };

    const handleResign = async () => {
        if (!state) return;
        const player = window.confirm("Сдаться? Нажмите OK чтобы подтвердить. (Победит другой игрок)");
        if (!player) return;
        // определим имя сдающегося: текущий ход — тот, кто должен ходить.
        // Обычно сдается текущий игрок (но можно сделать выбор). Мы спросим у юзера:
        const resigningPlayer = window.prompt("Введите ник игрока, который сдается:");
        if (!resigningPlayer) return;
        try {
            const res = await fetch(`/api/game/resign?player=${encodeURIComponent(resigningPlayer)}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Не удалось сдаться");
            await loadState();
        } catch (err) {
            console.error(err);
            setError("Ошибка при сдаче");
        }
    };

    const renderBoard = () => {
        if (!state) return null;
        const size = state.board.length;
        const rows = [];

        for (let r = 0; r < size; r++) {
            const cols = [];
            for (let c = 0; c < size; c++) {
                const tileName = state.board[r][c];
                const isSelected = selected && selected.row === r && selected.col === c;
                const isPossible = possibleMoves.some(m => m[0] === r && m[1] === c);

                // фон клетки
                const cellBg = (r + c) % 2 === 0 ? emptyWhite : emptyBlack;

                // определяем картинку шашки
                let pieceImg = null;
                switch (tileName) {
                    case "WHITE":
                        pieceImg = whiteChecker;
                        break;
                    case "BLACK":
                        pieceImg = blackChecker;
                        break;
                    case "WHITE_KING":
                        pieceImg = whiteKing;
                        break;
                    case "BLACK_KING":
                        pieceImg = blackKing;
                        break;
                    default:
                        pieceImg = null;
                }

                cols.push(
                    <div
                        key={`c-${r}-${c}`}
                        id={`tile-${r}-${c}`}
                        className={`cell ${isSelected ? "selected" : ""} ${isPossible ? "possible" : ""}`}
                        onClick={() => onCellClick(r, c)}
                        style={{ position: "relative", width: 106, height: 106 }}
                    >
                        {/* фон клетки */}
                        <img
                            src={cellBg}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />

                        {/* шашка поверх клетки */}
                        {pieceImg && (
                            <img
                                src={pieceImg}
                                alt=""
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: (tileName.includes("KING") ? "70px" : "150px"),
                                    height: (tileName.includes("KING") ? "70px" : "150px"),
                                    objectFit: "contain",
                                    pointerEvents: "none"
                                }}
                            />
                        )}
                    </div>
                );
            }

            rows.push(
                <div key={`r-${r}`} className="board-row" style={{ display: "flex" }}>
                    {cols}
                </div>
            );
        }

        return <div className="board">{rows}</div>;
    };

    if (!state) {
        return (
            <>
                <Header />
                <main className="main-checkers">
                    <p>Игра не запущена. Вернуться на главную и начать новую игру.</p>
                    <button onClick={() => navigate("/")}>На главную</button>
                </main>
                <Footer />
            </>
        );
    }

    if (state.state !== "PLAYING") {
        const winner = state.state === "WHITE_WON" ?
            state.whitePlayer?.nickname || "White"
            :
            state.blackPlayer?.nickname || "Black";
        const bgColor = state.state === "WHITE_WON" ? "#cce6ff" : "#003366";
        const textColor = state.state === "WHITE_WON" ? "#003366" : "#cce6ff";

        return (
            <>
                <Header />

                <main className="main-checkers">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "80vh",
                            textAlign: "center",
                            padding: "2rem",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: bgColor,
                                color: textColor,
                                padding: "3rem",
                                borderRadius: "20px",
                                boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                                maxWidth: "400px",
                                width: "90%",
                                animation: "fadeIn 0.8s ease-in-out",
                            }}
                        >
                            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉 Игра окончена!</h1>
                            <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                                Результат: <b>{state.state === "WHITE_WON" ? "Победа Белых" : "Победа Чёрных"}</b>
                            </p>
                            <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                                Победитель: <b>{winner}</b>
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                style={{
                                    padding: "0.8rem 1.5rem",
                                    fontSize: "1rem",
                                    borderRadius: "10px",
                                    border: "none",
                                    cursor: "pointer",
                                    background: "#3399ff",
                                    color: "#fff",
                                    transition: "transform 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                На главную
                            </button>
                        </div>
                    </div>
                </main>

                <Footer />

                <style>
                    {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}
                </style>
            </>
        );
    }

    const white = state.whitePlayer || { nickname: "White", avatarUrl: "" };
    const black = state.blackPlayer || { nickname: "Black", avatarUrl: "" };

    return (
        <>
            <Header />


            <div
                className="center-test-line-vertical"
                style={{
                    position: "fixed",
                    top: 0,
                    left: "50%",
                    width: "2px",
                    height: "100vh",
                    background: "red",
                    zIndex: 9999,
                    pointerEvents: "none"
                }}
            ></div>


            <main className="main-checkers">
                <div className="game-container-vertical">
                    <div className={`player-block top-player ${state.currentTurn === "BLACK" ? "active-player" : ""}`}>
                        <div className="score" id="player2-block">
                            {black.avatarUrl && <img src={black.avatarUrl} alt="Black Avatar" className="avatar" />}
                            <div className="player-name">{black.nickname}</div>
                            <div className="player-points"> {state.blackScore} </div>
                        </div>
                    </div>

                    <div className="game-main">
                        <div className="game-section">
                            <div className="board-wrapper">
                                {renderBoard()}
                            </div>
                        </div>

                        <div className="side-panel">
                            <button className="new" onClick={() => { navigate("/"); }}>
                                Back to Home
                            </button>

                            <button className="resign" onClick={handleResign}>
                                Resign
                            </button>
                        </div>

                        <ul className="moves-list">
                            {state.movesLog?.map((m, idx) => {
                                let css = "move-normal";
                                if (m.captured && m.becameKing) css = "move-captured-kinged";
                                else if (m.captured) css = "move-captured";
                                else if (m.becameKing) css = "move-kinged";

                                const player = m.player === "WHITE" ? "White" : "Black";

                                return (
                                    <li key={idx} className={css}>
                                        {player}: ({m.fromRow}, {m.fromCol}) → ({m.toRow}, {m.toCol})
                                    </li>
                                );
                            }) || []}
                        </ul>
                    </div>

                    <div className={`player-block bottom-player ${state.currentTurn === "WHITE" ? "active-player" : ""}`}>
                        <div className="score" id="player1-block">
                            {white.avatarUrl && <img src={white.avatarUrl} alt="White Avatar" className="avatar" />}
                            <div className="player-name">{white.nickname}</div>
                            <div className="player-points"> {state.whiteScore} </div>
                        </div>
                    </div>
                </div>
            </main>

            {error && (
                <div className="error-notification">
                    <p>{error}</p>
                    <div className="error-btns">
                        <button onClick={() => setError(null)}>Закрыть</button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}