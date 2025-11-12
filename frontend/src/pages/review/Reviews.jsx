import React, {useEffect, useState} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Modal from ".//Modal.jsx";
import "../../styles/reviews.css";

export default function Reviews() {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [playerName, setPlayerName] = useState(""); // новый state

    // 📥 Получение отзывов, рейтинга и пользователей
    useEffect(() => {
        fetch("/api/users")
            .then((res) => res.json())
            .then(setUsers)
            .catch(() => setUsers([]));

        fetch("/api/comments/all")
            .then((res) => res.json())
            .then(setComments)
            .catch(() => setComments([]));

        fetch("/api/ratings/all") // предполагается, что API возвращает список всех рейтингов
            .then(res => res.json())
            .then(setRatings)
            .catch(() => setRatings([]));

        fetch("/api/ratings/average")
            .then((res) => res.json())
            .then(setAverageRating)
            .catch(() => setAverageRating(0));

        fetch("/api/ratings/count")
            .then(res => res.json())
            .then(setRatingCount)
            .catch(() => setRatingCount(0));
    }, []);

    // 📝 Отправка нового комментария
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        // Проверяем, что игрок есть в users
        const player = playerName.trim();
        if (!users.some(u => u.nickname === player)) {
            alert("❌ This player does not exist in the database!");
            return;
        }

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    player,
                    comment
                }),
            });

            if (response.ok) {
                console.log("✅ Comment added successfully!");
                setComment("");
                setIsCommentModalOpen(false);

                const newComments = await fetch("/api/comments/all").then(res => res.json());
                setComments(newComments);
            } else {
                console.log("❌ Failed to add comment");
            }
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    // 📝 Отправка нового рейтинга
    const handleSubmitRating = async (e) => {
        e.preventDefault();

        const player = playerName.trim();
        if (!users.some(u => u.nickname === player)) {
            alert("❌ This player does not exist in the database!");
            return;
        }

        try {
            const response = await fetch("/api/ratings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({player, rating}),
            });

            if (response.ok) {
                console.log("✅ Rating added successfully!");
                setRating(5);
                setIsRatingModalOpen(false);

                const allRatings = await fetch("/api/ratings/all").then(res => res.json());
                setRatings(allRatings);

                const newAverageRating = await fetch("/api/ratings/average").then(res => res.json());
                setAverageRating(newAverageRating);

                const newRatingCount = await fetch("/api/ratings/count").then(res => res.json());
                setRatingCount(newRatingCount);
            } else {
                console.log("❌ Failed to add rating");
            }
        } catch (err) {
            console.error("Error adding rating:", err);
        }
    };

    return (
        <>
            <Header/>

            <main className="reviews-page">
                <div className="reviews-container">
                    {/* 📊 Сводка рейтинга */}
                    <div className="review-summary">
                        <div className="summary-content">
                            <div className="summary-line">
                                <span>
                                    Based on <strong>{ratingCount}</strong> {ratingCount === 1 ? "review" : "reviews"} {" "}
                                    <strong>{Number.isInteger(averageRating) ? averageRating : averageRating.toFixed(1)}</strong> {" "}
                                    out of 5
                                </span>
                                <div className="stars-inline">
                                    {Array.from({length: 5}, (_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i + 1 <= Math.round(averageRating)
                                                    ? "text-yellow-300"
                                                    : "text-gray-300"
                                            }`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 20"
                                        >
                                            <path
                                                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="add-buttons">
                            <button
                                className="add-comment-button"
                                onClick={() => setIsCommentModalOpen(true)}
                            >
                                Add Comment
                            </button>
                            <button
                                className="add-review-button"
                                onClick={() => setIsRatingModalOpen(true)}
                            >
                                Add Rating
                            </button>
                        </div>
                    </div>

                    <section className="reviews-section">
                        {/* 💬 Комментарии слева */}
                        <div className="comments-list">
                            <h3>Comments</h3>
                            {comments.length === 0 ? (
                                <p>No comments yet.</p>
                            ) : (
                                comments.map((c, i) => {
                                    const user = users.find(u => u.nickname === c.player);
                                    const avatar = user ? user.avatarUrl : "/images/board/empty_black.png";

                                    return (
                                        <div className="comment-item" key={i}>
                                            <div className="comment-avatar-name">
                                                <img className="avatar" src={avatar} alt="avatar" />
                                                <span className="player-name">{c.player}</span>
                                            </div>


                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <span className="comment-date">{new Date(c.commentedOn).toLocaleString()}</span>
                                                </div>
                                                <p className="comment-body">{c.comment}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* ⭐ Рейтинги справа */}
                        <div className="ratings-list">
                            <h3>Ratings</h3>
                            {ratings.length === 0 ? (
                                <p>No ratings yet.</p>
                            ) : (
                                ratings.map((r, i) => {
                                    const user = users.find(u => u.nickname === r.player);
                                    const avatar = user ? user.avatarUrl : "/images/board/empty_black.png";

                                    return (
                                        <div className="rating-item" key={i}>
                                            <img className="avatar small" src={avatar} alt="avatar" />
                                            <div className="rating-content">
                                                <div className="rating-left">
                                                    <span className="player-name">{r.player}</span>
                                                    <span className="player-rating">
                                                        {Array.from({ length: r.rating }, (_, idx) => (
                                                            <span key={idx} className="star">★</span>
                                                        ))}
                                                    </span>
                                                </div>
                                                <span className="rating-date">{new Date(r.ratedOn).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>


                {/* Модалка добавления комментария */}
                <Modal
                    isOpen={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                    title="Add Your Comment"
                >
                    <form onSubmit={handleSubmitComment}>
                        <label>Nickname:</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your nickname"
                            required
                        />

                        <label>Comment:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Your comment..."
                            required
                        />

                        <button type="submit" className="submit-review-btn">Submit Comment</button>
                    </form>
                </Modal>

                {/* Модалка добавления рейтинга */}
                <Modal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    title="Add Your Rating"
                >
                    <form onSubmit={handleSubmitRating}>
                        <label>Nickname:</label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your nickname"
                            required
                        />

                        <label>Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            required
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num} {"★".repeat(num)}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="submit-review-btn">Submit Rating</button>
                    </form>
                </Modal>
            </main>

            <Footer/>
        </>
    );
}