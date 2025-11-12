import React from 'react';
import Footer from "../components/Footer.jsx";
import "../styles/about.css";
import Header from "../components/Header.jsx";

export default function About() {
    return (
        <>
            <Header />

            <div className="about">
                <h2>About This Project</h2>

                <p>
                    This project was developed by <strong>Danylo Senchyshyn</strong>, a student of the Technical University of Košice (TUKE), as part of my bachelor's thesis.
                    The thesis topic is <em>"Webová aplikácia pre hru Dáma: porovnanie monolitickej a mikroservisnej architektúry"</em> (Web Application for the Game of Checkers: Comparison of Monolithic and Microservice Architecture).
                </p>

                <h3>Project Aim</h3>
                <p>
                    The goal of this project is to create an interactive checkers game using a <strong>microservice architecture</strong> that allows users to enjoy a strategic game of checkers.
                    The project showcases various programming concepts such as object-oriented programming, UI design, backend integration, and microservice communication.
                </p>

                <h3>Technologies Used</h3>
                <p>
                    The project was developed using <strong>Java</strong> for the backend and frontend, integrated with <strong>Spring Boot</strong> for the server-side functionality.
                    {" "} <strong>PostgreSQL</strong> is used for storing data such as user scores, comments, and ratings. The architecture follows a microservice approach to separate concerns for better scalability and maintainability.
                </p>

                <h3>Key Features</h3>
                <p>
                    Key features include a local two-player game, nickname-based player management, avatar selection, score tracking, ratings, and comments.
                    Each microservice handles a specific part of the application, demonstrating the benefits of a microservice architecture even for a local game.
                </p>
            </div>

            <Footer />
        </>
    );
}