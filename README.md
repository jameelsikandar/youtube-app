# YouTubeApp – Full Stack Video Sharing Platform (Backend)

This repository contains the backend code for **YouTubeApp**, a scalable video-sharing platform inspired by YouTube. It includes support for video uploads, user authentication, likes, comments, subscriptions, playlists, and more. The backend is built using **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

---

## Features

### User Management

- User registration and login
- JWT-based authentication
- Role-based access control (admin/user)
- Avatar upload via Cloudinary

### Video Management

- Upload videos and thumbnails (via Multer & Cloudinary)
- Fetch all videos (paginated and sorted)
- Get video by ID
- Update/delete videos (by owner only)
- Toggle publish status
- Like/unlike videos

### Comments

- Add comments to videos
- Edit and delete own comments
- Get paginated comments for a video
- Like/unlike comments

### Tweets

- Post short status messages (tweets)
- Get all tweets
- Get tweets by user
- Like/unlike tweets

### Subscriptions

- Subscribe/unsubscribe to a channel (another user)
- View subscribers of a channel
- View channels a user has subscribed to

### Playlists

- Create, update, and delete playlists
- Add/remove videos from playlists
- Get all playlists by a user
- Get playlist by ID

### Channel Dashboard

- View videos uploaded by the user
- Access channel statistics (subscribers, video count, etc.)

### Healthcheck

- `/api/v1/healthcheck` – Basic server status endpoint for monitoring

---

## Tech Stack

- **Node.js** + **Express** – Server and routing
- **MongoDB** + **Mongoose** – Database and modeling
- **JWT** – Authentication
- **Multer** – File uploads
- **Cloudinary** – Media storage
- **dotenv** – Environment variable management
- **Nodemon** – Development server auto-reloader

---

## Folder Structure

```
src/
├── controllers/         # Business logic
├── models/              # Mongoose schemas
├── routes/              # API routes
├── middlewares/         # Auth and Multer middlewares
├── utils/               # Custom utilities (ApiResponse, Error handling, etc.)
├── db/                  # Database connection
├── app.js               # Express app setup
└── index.js             # Entry point
```

---

## Installation & Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas (or local)
- Cloudinary account

### Clone the Repo

```bash
git clone https://github.com/yourusername/youtubeapp-backend.git
cd youtubeapp-backend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Run Development Server

```bash
npm run dev
```

---

## API Overview

**Base URL:** `/api/v1`

| Resource          | Routes                                                                        |
| ----------------- | ----------------------------------------------------------------------------- |
| **Auth/User**     | `/auth/register`, `/auth/login`, `/users/:id`                                 |
| **Videos**        | `/videos/`, `/videos/:videoId`, `/videos/upload`                              |
| **Comments**      | `/comments/:videoId`, `/comments/:commentId`                                  |
| **Tweets**        | `/tweets/`, `/tweets/:tweetId`                                                |
| **Likes**         | `/likes/video/:videoId`, `/likes/comment/:commentId`, `/likes/tweet/:tweetId` |
| **Playlists**     | `/playlists/`, `/playlists/:playlistId`                                       |
| **Subscriptions** | `/subscriptions/:channelId`, `/subscriptions/user/:subscriberId`              |
| **Dashboard**     | `/dashboard/channel/:channelId`                                               |
| **Healthcheck**   | `/healthcheck`                                                                |

---

## Notes

- All protected routes require JWT authentication.
- Only resource owners can perform update/delete actions.
- Subscriptions are modeled as user-to-user relationships.
- Playlists are independent documents, not embedded in user schema.
- Pagination and aggregation pipelines are used for performance.

---

## License

This project is licensed under the **JamesDev License**.
