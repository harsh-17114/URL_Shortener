# URL Shortener

A full-stack URL shortening application built with **React**, **Node.js**, **Express.js**, and **MongoDB**. It creates short links, supports authenticated custom slugs, redirects visitors to the original destination, and tracks link clicks.

## Features

* Automatic short URL generation
* Custom short URLs for authenticated users
* User registration, login, logout, and protected dashboard
* JWT authentication with HTTP-only cookies
* Guest URL shortening
* URL validation and duplicate slug detection
* Click counting for redirects
* Clipboard copying for short URLs
* Loading states and clear frontend error messages
* RESTful API architecture
* CORS and dotenv configuration
* Responsive React frontend

## Tech Stack

### Frontend

* **React** – UI library
* **TanStack Router** – Client-side routing
* **TanStack React Query** – Server-state fetching and caching
* **Redux Toolkit** – Authentication state management
* **Axios** – HTTP requests
* **Tailwind CSS** – Styling
* **Vite** – Development and build tool

### Backend

* **Node.js** – JavaScript runtime
* **Express.js** – Backend framework
* **MongoDB** – Database
* **Mongoose** – MongoDB object modeling
* **nanoid** – Short ID generation
* **jsonwebtoken** – JWT authentication
* **bcryptjs** – Password hashing
* **cookie-parser** – Cookie handling
* **cors** – Cross-origin resource sharing
* **dotenv** – Environment variables

## Project Structure

```text
URL_Shortener/
│
├── Backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── shortUrl.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── attachUser.middleware.js
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── shortUrl.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── shortUrl.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   └── app.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── shortUrl.api.js
│   │   │   └── user.api.js
│   │   │
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── UrlForm.jsx
│   │   │   └── UserUrl.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── HomePage.jsx
│   │   │
│   │   ├── redux/
│   │   │   ├── features/
│   │   │   │   └── authSlice.js
│   │   │   └── store.js
│   │   │
│   │   ├── routing/
│   │   │   ├── auth.route.js
│   │   │   ├── dashboard.js
│   │   │   ├── homepage.js
│   │   │   └── routeTree.js
│   │   │
│   │   ├── utils/
│   │   │   ├── axiosInstance.js
│   │   │   └── helper.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Getting Started

### Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
APP_URL=http://localhost:3000/
```

Start the backend:

```bash
node server.js
```

The backend runs on `http://localhost:3000`.

### Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Authentication API

Base URL: `/api/auth`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/register` | Register a new user |
| POST | `/login` | Log in an existing user |
| POST | `/logout` | Clear the authentication cookie |
| GET | `/get-me` | Fetch the authenticated user |

### Register

**POST** `/api/auth/register`

```json
{
  "username": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

The server generates a JWT and stores it in an HTTP-only cookie.

### Logout

**POST** `/api/auth/logout`

The authentication cookie is cleared after confirmation in the frontend.

### Get Current User

**GET** `/api/auth/get-me`

This endpoint requires authentication.

## URL APIs

### Create Automatic Short URL

**POST** `/api/create/urls`

Available to guests and authenticated users.

```json
{
  "url": "https://example.com/long-page"
}
```

### Create Custom Short URL

**POST** `/api/create/custom`

Requires authentication.

```json
{
  "url": "https://example.com/long-page",
  "slug": "my-link"
}
```

Duplicate slugs return `409 Conflict`.

### Redirect to the Original URL

**GET** `/:id`

The backend validates the stored destination, increments the click count, and returns a `302` redirect.

### Fetch User URLs

**GET** `/api/user/urls`

Requires authentication and returns the user's saved URLs and click counts.

## URL Validation

* HTTP and HTTPS URLs are accepted.
* URLs without a protocol are normalized with `https://`.
* Unsupported protocols such as `ftp:` and `javascript:` are rejected.
* Empty or malformed values return `400 Bad Request`.

## Database Models

### User Model

```text
User
├── username
├── email
├── password
└── avatar
```

Passwords are hashed with bcrypt and excluded from normal queries.

### Short URL Model

```text
ShortUrl
├── full_url
├── short_url
├── clicks
└── user
```

The `short_url` field is unique and indexed for fast lookup.

## Application Flow

```text
                 ┌──────────────────┐
                 │    React UI      │
                 └────────┬─────────┘
                          │ Axios
                          ▼
                 ┌──────────────────┐
                 │   Express API    │
                 └───────┬──────────┘
                         │
                 ┌───────┴────────┐
                 │                │
                 ▼                ▼
          ┌─────────────┐  ┌──────────────┐
          │   MongoDB   │  │  HTTP Cookie │
          │             │  │  JWT Session │
          └─────────────┘  └──────────────┘
```

## URL Shortening Flow

1. The user enters a destination URL.
2. React sends it to the Express API.
3. The backend validates and normalizes it.
4. The backend generates an ID or checks the custom slug.
5. MongoDB stores the short URL.
6. The API returns the short link.
7. A visitor opens the link.
8. The backend increments clicks and redirects to the destination.

## Authentication Flow

```text
User
 │
 ▼
Login or Register
 │
 ▼
JWT Generated
 │
 ▼
HTTP-only Cookie
 │
 ▼
Authentication Middleware
 │
 ▼
Protected Dashboard and API Access
```

## Frontend Pages

### Home Page

Allows guests to create automatic short URLs.

### Authentication Page

Provides login and registration forms with validation, loading feedback, and clear errors.

### Dashboard Page

Allows authenticated users to create automatic or custom links, view saved URLs, see click counts, copy links, and log out with confirmation.

## Error Handling

The frontend displays errors for failed authentication, invalid URLs, duplicate slugs, unauthorized access, and failed URL loading.

The backend uses:

* `400` for invalid input
* `401` for missing or invalid authentication
* `404` for unknown short URLs
* `409` for duplicate users or slugs
* `500` for unexpected errors

## Scaling Considerations

The current application is a modular monolith. Possible production improvements include Redis caching, multiple stateless backend instances behind a load balancer, background click analytics, rate limiting, MongoDB replicas, centralized logging, and monitoring.

## Main Files

* `server.js` connects to MongoDB and starts Express.
* `app.js` configures middleware and routes.
* `auth.controller.js` handles registration, login, logout, and current-user requests.
* `shortUrl.controller.js` handles URL creation, validation, redirects, and click counting.
* `auth.middleware.js` protects authenticated routes.
* `LoginForm.jsx` and `RegisterForm.jsx` provide authentication forms.
* `UrlForm.jsx` creates automatic or custom links.
* `UserUrl.jsx` displays saved links and click counts.

## Conclusion

URL Shortener is a full-stack project demonstrating React, Express REST APIs, MongoDB persistence, JWT authentication, URL validation, custom slugs, redirects, and click tracking. It also provides a foundation for discussing caching, load balancing, horizontal scaling, and production performance improvements.
