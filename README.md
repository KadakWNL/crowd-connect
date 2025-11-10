# CrowdConnect - Local Events Platform

A MERN stack web application where users can discover, create, and host local events with interactive maps.

## Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Host System**: Users can toggle host status to create events
- **Interactive Maps**: Leaflet maps showing all events with clickable markers
- **Event Creation**: Hosts can create events by dropping pins on a map or using geolocation
- **Event Discovery**: Browse events on an interactive map and in card format
- **Responsive Design**: Fully responsive layout using vanilla CSS and media queries

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS enabled for local development

**Frontend:**
- React (Vite)
- React Router for navigation
- Leaflet & react-leaflet for maps
- Axios for API calls
- Vanilla CSS (no UI libraries)

## Project Structure
(subject to change)
```
crowdconnect/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── events.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── EventCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   └── HostToggle.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── Navbar.css
│   │   │   ├── EventCard.css
│   │   │   ├── Home.css
│   │   │   ├── Auth.css
│   │   │   ├── EventDetail.css
│   │   │   ├── CreateEvent.css
│   │   │   └── HostToggle.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
```

The backend API will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user (protected)
- `PATCH /api/users/toggle-host` - Toggle host status (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (protected, host only)
- `PUT /api/events/:id` - Update event (protected, owner only)
- `DELETE /api/events/:id` - Delete event (protected, owner only)

## Usage

1. **Sign Up**: Create an account on the signup page
2. **Become a Host**: Go to Host Settings and toggle "Become a Host"
3. **Create Event**: As a host, click "Create Event" and fill in the details
4. **Select Location**: Either click on the map to drop a pin or use "Use My Location"
5. **Browse Events**: View all events on the interactive map or browse event cards
6. **View Details**: Click on any event to see full details and location

## Development Notes

- The frontend uses Vite for fast development and hot module replacement
- Maps are powered by Leaflet with OpenStreetMap tiles (no API key required)
- Authentication tokens are stored in localStorage
- All routes that modify data are protected with JWT middleware
- Only users with `isHost: true` can create events

