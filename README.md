YouTube Clone - MERN Stack

A full-stack YouTube clone built with MongoDB, Express.js, React (Vite), and Node.js.


Features

- Browse videos on a YouTube-style home page
- Search videos by title using the search bar
- Filter videos by category (11 filter buttons)
- User registration and login with JWT authentication
- Input validation with error messages on all forms
- Video player page with like and dislike buttons
- Comment section with full CRUD (add, edit, delete)
- Channel management (create channel, upload, edit, delete videos)
- Responsive design for mobile, tablet, and desktop


Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Authentication | JWT + bcryptjs |
| Version Control | Git + GitHub |


Project Structure

Setup Instructions

Prerequisites
- Node.js v18+
- Git
- MongoDB Atlas account (free tier)

1. Clone the repository
```bash
git clone https://github.com/kalyandeep7/youtube-clone-mern.git
cd youtube-clone-mern
```

2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

Start the backend:
```bash
npm run dev
```

3. Seed the Database
```bash
cd backend
node seed.js
```

This creates sample videos, a channel, and a test user.

4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

5. Open the app
Go to `http://localhost:5173` in your browser.

---

Sample Login Credentials

After running the seed script you can log in with:

| Field | Value |
|-------|-------|
| Email | john@example.com |
| Password | 123456 |

API Endpoints

Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |

Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/videos | Get all videos (search + filter) |
| GET | /api/videos/:id | Get single video |
| POST | /api/videos | Upload video (auth required) |
| PUT | /api/videos/:id | Update video (auth required) |
| DELETE | /api/videos/:id | Delete video (auth required) |
| PUT | /api/videos/:id/like | Like a video (auth required) |
| PUT | /api/videos/:id/dislike | Dislike a video (auth required) |

Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/channels | Create a channel (auth required) |
| GET | /api/channels/my | Get my channel (auth required) |
| GET | /api/channels/:id | Get channel by ID |

Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/comments/:videoId | Add comment (auth required) |
| GET | /api/comments/:videoId | Get all comments for a video |
| PUT | /api/comments/comment/:id | Edit comment (auth required) |
| DELETE | /api/comments/comment/:id | Delete comment (auth required) |


Screenshots

Home Page
- YouTube-style header with search bar
- Collapsible sidebar with navigation
- Category filter buttons
- Responsive video grid

Video Player
- HTML5 video player
- Like and dislike buttons
- Full comment CRUD

Channel Page
- Create and manage your channel
- Upload, edit, and delete videos

Submission Details
- GitHub Repository: https://github.com/kalyandeep7/youtube-clone-mern
- Video Demo: [Add your demo link here]