import React from 'react';
import {NavLink, useLocation} from "react-router-dom";
import "./footer.css"

export default function Footer() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <footer className={isHome ? 'footer home-footer' : 'footer'}>
            <div className="footer-content">
                <p>&copy; 2025 Checkers. All rights reserved.</p>
                <div className="social-icons">
                    <a href="https://github.com/danylo-senchyshyn"
                       target="_blank"
                       aria-label="GitHub"
                       rel="noopener noreferrer"
                    >
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/senchyshyn-danylo-a49a9735b/"
                       target="_blank"
                       aria-label="LinkedIn"
                       rel="noopener noreferrer"
                    >
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}