# Social Media Community Platform - MERN Stack

A modern, full-stack social interaction platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring TypeScript and Tailwind CSS.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with role management (User/Admin)
- **Post Creation**: Authenticated users can create posts with title, content, and optional images
- **Comments System**: Any user can comment on posts
- **Admin Moderation**: Special admin replies that are visually distinct and marked as official
- **Like System**: Users can like/unlike posts with real-time updates

### Technical Highlights
- **Modern UI/UX**: Beautiful, responsive design using Tailwind CSS with glassmorphism effects
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **Secure**: Password hashing with bcrypt, JWT authentication, role-based access control
- **RESTful API**: Well-structured Express.js backend with proper error handling
- **Real-time Updates**: Dynamic feed updates without page refresh

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- TypeScript
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Context API for state management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd SocialMedia
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (you can copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

3. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post with comments and admin replies
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner or admin)
- `POST /api/posts/:id/like` - Like/unlike post (protected)

### Comments
- `POST /api/comments` - Create comment (protected)
- `GET /api/comments/post/:postId` - Get comments for a post
- `DELETE /api/comments/:id` - Delete comment (protected, owner or admin)

### Admin Replies
- `POST /api/admin-replies` - Create admin reply (protected, admin only)
- `GET /api/admin-replies/post/:postId` - Get admin replies for a post
- `DELETE /api/admin-replies/:id` - Delete admin reply (protected, admin only)

## Project Structure

```
SocialMedia/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   ├── Comment.ts
│   │   │   └── AdminReply.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── postController.ts
│   │   │   ├── commentController.ts
│   │   │   └── adminReplyController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── postRoutes.ts
│   │   │   ├── commentRoutes.ts
│   │   │   └── adminReplyRoutes.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── PostCard.tsx
    │   │   ├── CreatePostForm.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── utils/
    │   │   └── dateUtils.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

## Features in Detail

### User Roles
- **User**: Can create posts, comment, and like content
- **Admin**: All user permissions plus ability to post official admin replies and delete any content

### Post Interaction
- Create posts with rich content
- Upload images via URL
- Like/unlike functionality
- View like counts
- Real-time feed updates

### Comments & Admin Replies
- Regular users can comment on any post
- Admin replies are visually distinct with special badges
- Both comments and admin replies show timestamps
- Authors can delete their own content
- Admins can delete any content

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Role-based authorization

## Design Features
- Modern glassmorphism UI
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Responsive design for all devices
- Custom Tailwind CSS components
- Inter font for clean typography

## License
MIT

## Author
Built with ❤️ using the MERN Stack
