# 📰 Personalized News Aggregator API

This is a RESTful API built with **Node.js** and **Express.js** that
lets users register, log in, set their news preferences, and fetch
personalized news articles.\
It uses **JWT authentication**, **bcrypt for password hashing**, and
integrates with the external [NewsAPI](https://newsapi.org) to fetch
real news articles.

The project is designed as a learning exercise for practicing **API
development**, **authentication**, **caching**, and **error handling**
in Node.js.

------------------------------------------------------------------------

## 🚀 Features

-   **User Authentication**
    -   Register with email + password (hashed using bcrypt)
    -   Login with JWT-based authentication
-   **Preferences**
    -   Save preferred categories and language
    -   Retrieve or update preferences
-   **News Feed**
    -   Fetch personalized news articles from NewsAPI
    -   Caching mechanism to reduce API calls
    -   Periodic background updates
-   **Article Management**
    -   Mark articles as **read**
    -   Mark articles as **favorite**
    -   Retrieve read or favorite articles
-   **Search**
    -   Search cached articles by keyword

------------------------------------------------------------------------

## ⚙️ Tech Stack

-   **Node.js** + **Express.js**
-   **bcrypt** (secure password hashing)
-   **jsonwebtoken (JWT)** (authentication)
-   **axios** (fetch external APIs)
-   **dotenv** (environment variables)

------------------------------------------------------------------------

## 📦 Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/your-username/news-aggregator-api.git
    cd news-aggregator-api
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Create a `.env` file in the root folder:

        PORT=3000
        JWT_SECRET=your_secret_key
        NEWS_API_KEY=your_newsapi_key

4.  Start the server:

    ``` bash
    node app.js
    ```

    Or, if you have `nodemon`:

    ``` bash
    npx nodemon app.js
    ```

------------------------------------------------------------------------

## 🧪 API Endpoints

### Authentication

-   `POST /register` → Register a new user\
-   `POST /login` → Login and get a JWT token

### Preferences

-   `GET /preferences` → Get user preferences\
-   `PUT /preferences` → Update preferences

### News

-   `GET /news` → Get personalized news (requires token)\
-   `POST /news/:id/read` → Mark article as read\
-   `POST /news/:id/favorite` → Mark article as favorite\
-   `GET /news/read` → Get all read articles\
-   `GET /news/favorites` → Get all favorite articles\
-   `GET /news/search/:keyword` → Search articles by keyword

------------------------------------------------------------------------

## 🔑 Authentication

All protected routes require the JWT token.\
Send it in the request header:

    Authorization: Bearer <your_token>

------------------------------------------------------------------------

## 🧰 Example Workflow

1.  **Register**

    ``` json
    { "username": "test@example.com", "password": "mypassword" }
    ```

2.  **Login** → receive a token

3.  **Set Preferences**

    ``` json
    { "categories": ["technology", "sports"], "language": "en" }
    ```

4.  **Fetch News**

    -   `GET /news` → returns personalized articles

5.  **Mark an Article as Favorite**

    -   `POST /news/1/favorite`

------------------------------------------------------------------------

## 📝 Notes

-   This project uses **in-memory storage** (data is lost when the
    server restarts).\
-   For real projects, connect it to a database (MongoDB, PostgreSQL,
    etc).\
-   Get a free API key from [NewsAPI](https://newsapi.org) to fetch
    news.

------------------------------------------------------------------------

