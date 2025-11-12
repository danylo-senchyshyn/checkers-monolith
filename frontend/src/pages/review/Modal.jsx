import React, { useEffect, useState } from "react";
import "./modal.css";

export default function Modal({ isOpen, onClose, title, children }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) setShow(true);
        else {
            const timer = setTimeout(() => setShow(false), 300); // match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div className={`modal-overlay ${isOpen ? "open" : "close"}`} onClick={onClose}>
            <div
                className={`modal-container ${isOpen ? "open" : "close"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ✖
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}