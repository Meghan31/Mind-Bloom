# Mind-Bloom: Journal & Wellness Application

## Overview

Mind-Bloom is a web-based journaling and mental wellness application designed to help users track their moods, record daily thoughts, and receive personalized affirmations. The application features a clean, intuitive interface for writing journal entries, mood tracking, and viewing past entries through an interactive calendar.

## Features

- **User Authentication**: Secure login and registration system
- **Mood Tracking**: Select from 12 different mood states to record your emotional state
- **Journaling**: Write and save daily journal entries
- **Personalized Affirmations**: Receive mood-based positive affirmations
- **Calendar View**: Visualize and access past journal entries through an interactive calendar

## Technology Stack

### Backend

- **Node.js & Express**: RESTful API server
- **TypeScript**: Type-safe JavaScript
- **PostgreSQL**: Relational database for data persistence
- **Knex.js**: SQL query builder and migration tool
- **JWT**: JSON Web Tokens for authentication
- **Handlebars**: Server-side templating (for non-API views)

### Frontend

- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hook Form**: Form validation
- **React Toastify**: Toast notifications
- **Day.js & date-fns**: Date manipulation libraries
- **Lucide React**: Icon library
- **ShadCN UI**: Component library

## Architecture

Mind-Bloom follows a modern web application architecture with a decoupled frontend and backend:

1. **Frontend**: A React Single Page Application (SPA) that communicates with the backend API
2. **Backend**: An Express.js server that handles API requests, database operations, and business logic
3. **Database**: PostgreSQL for storing user accounts, journal entries, and affirmations

### Data Flow

```
User -> React Frontend -> Express API -> PostgreSQL Database
                       <- JSON Response <-
```

## Project Structure

```
mind-bloom/
├── backend/                 # Express.js API server
│   ├── bin/                 # Executable scripts
│   ├── databases/           # Database migrations and seeds
│   │   ├── migrations/      # Knex migrations
│   │   └── seeds/           # Seed data for the database
│   └── src/                 # Server source code
│       ├── databaseSupport/ # Database interaction
│       ├── public/          # Static files
│       ├── routes/          # API routes
│       ├── views/           # Handlebars templates
│       └── webSupport/      # Server utilities
└── frontend/                # React SPA
    ├── public/              # Static assets
    └── src/                 # Client source code
        ├── api/             # API client
        ├── components/      # Reusable UI components
        ├── context/         # React context providers
        ├── lib/             # Utility functions
        ├── pages/           # Page components
        ├── sections/        # Page sections
        └── types/           # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 17
- Git

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Meghan31/Mind-Bloom.git
   cd mind-bloom
   ```

2. Set up environment variables

   ```bash
   cp backend/.env.example backend/.env
   source backend/.env
   ```

3. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

4. Set up the database

   ```bash
   psql postgres < databases/create_databases.sql
   npm run migrate
   source .env
   DATABASE_URL="postgresql://localhost:5432/capstone_starter_test?user=capstone_starter&password=capstone_starter" npm run migrate

   cd databases
   npx knex seed:run --knexfile knexfile.js
   ```

5. Seed the database with initial affirmations

   ```bash
   npx knex seed:run --knexfile databases/knexfile.js
   ```

6. Install frontend dependencies

   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server

   ```bash
   # In the backend directory
   npm run start
   ```

2. In a new terminal, start the frontend development server

   ```bash
   # In the frontend directory
   npm run dev
   ```

3. Open your browser and navigate to <http://localhost:5173>

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive a JWT token

### Journal Entries

- `POST /api/journal` - Create a new journal entry
- `GET /api/journal` - Get all journal entries for the logged-in user
- `GET /api/journal/:id` - Get a specific journal entry by ID
- `GET /api/journal/date/:date` - Get entries for a specific date

### Affirmations

- `GET /api/affirmation/today?mood=Happy` - Get a random affirmation for the specified mood
- `GET /api/affirmations/:mood` - Get all affirmations for a specific mood

## Testing

Run the backend tests:

```bash
cd backend
npm run test
```

## Deployment

### Docker

Build and run with Docker:

```bash
# Build the container
cd backend
npm run build
docker build -t mind-bloom .

# Run the container
docker run --env-file .env.docker --entrypoint ./app.sh mind-bloom
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [React Hook Form](https://react-hook-form.com/) for form handling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [PostgreSQL](https://www.postgresql.org/) for database
