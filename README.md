# Checkers Monolith Application

This project implements a classic Checkers game as a monolithic application. It serves as a comprehensive example and a direct comparison point against a microservices architecture, highlighting the architectural characteristics and trade-offs inherent in a monolithic design.

## Architecture Overview

The application is structured as a traditional monolith, integrating both backend and frontend components within a single deployable unit (though developed in separate sub-projects for clarity). Key characteristics include:

*   **Single Codebase:** All functionalities, from user management to game logic, reside in one repository and are compiled together.
*   **Layered Design:** The backend follows a standard layered architecture (Controller, Service, Repository, Entity, DTO) typical for Spring Boot applications.
*   **Shared Database:** All logical domains (Users, Games, Scores, Comments, Ratings) are designed to interact with a single, unified database.
*   **In-Process Communication:** Components within the application communicate directly via method calls, avoiding network overhead.
*   **Unified Deployment:** The entire application is designed to be deployed as a single artifact.

This design consciously embraces the strengths of a monolith – simplicity in development and deployment for small to medium-sized projects, strong data consistency, and high performance due to internal process calls – while providing a clear architectural contrast to distributed systems.

## Features

*   User registration and authentication
*   Checkers game logic
*   Score tracking and leaderboard
*   Game rating system
*   Comment section for games

## Technologies

*   **Backend:**
    *   Java 17+
    *   Spring Boot (Web, Data JPA)
    *   Maven
    *   H2 Database (for development/in-memory)
*   **Frontend:**
    *   React 18+
    *   JavaScript (ES6+)
    *   Vite
    *   npm / Yarn

## Getting Started

To get the Checkers Monolith application up and running on your local machine, follow these steps:

### Prerequisites

Ensure you have the following installed:

*   Java Development Kit (JDK) 17 or higher
*   Apache Maven 3.6.3 or higher
*   Node.js (LTS version)
*   npm (comes with Node.js) or Yarn

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Build the backend application (this will also download dependencies):
    ```bash
    mvn clean install
    ```
3.  Run the Spring Boot application:
    ```bash
    mvn spring-boot:run
    ```
    The backend will typically start on `http://localhost:8080`.

### Frontend Setup

1.  Open a new terminal window and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the frontend dependencies:
    ```bash
    npm install # or yarn install
    ```
3.  Start the React development server:
    ```bash
    npm start # or yarn dev
    ```
    The frontend will typically start on `http://localhost:5173` (Vite's default) or `http://localhost:3000`.

### Accessing the Application

Once both backend and frontend are running, open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173` or `http://localhost:3000`).

## Project Structure

```
.
├── pom.xml                   # Maven parent project configuration
├── backend/                  # Spring Boot backend application
│   ├── pom.xml               # Backend Maven configuration
│   └── src/                  # Backend source code
│       └── main/java/sk/tuke/gamestudio/checkersmonolith/
│           ├── CheckersMonolithApplication.java # Main Spring Boot class
│           ├── controller/   # REST controllers
│           ├── dto/          # Data Transfer Objects
│           ├── entity/       # JPA Entities
│           ├── game/         # Core game logic
│           ├── repository/   # Spring Data JPA repositories
│           └── service/      # Business logic services
├── frontend/                 # React frontend application
│   ├── package.json          # Frontend dependencies and scripts
│   ├── vite.config.js        # Vite configuration
│   └── src/                  # Frontend source code
│       ├── App.jsx           # Main React component
│       ├── main.jsx          # Entry point for React application
│       ├── components/       # Reusable React components
│       ├── images/           # Static assets
│       └── pages/            # Page-level React components
└── ... (other build/IDE files)
```

## License

[MIT License](LICENSE) - *Replace with actual license or remove if not applicable*