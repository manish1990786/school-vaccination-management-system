
# Vaccination Management System

A comprehensive web application for managing student vaccinations and vaccination drives in educational institutions.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

## Project Structure

```
├── client/          # React frontend with TypeScript
├── server/          # Express backend with TypeScript
```

## Installation

1. Clone the repository and install backend dependencies:
```bash
cd server
npm install
```

2. Set up server environment variables in `server/.env`:
```env
# Database Configuration
DATABASE_URL=postgres://postgres:root@0.0.0.0:5432/postgres
PGHOST=0.0.0.0
PGUSER=postgres
PGPASSWORD=root
PGDATABASE=postgres
PGPORT=5432

# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5000

# Authentication
JWT_SECRET=vaccination-portal-secret
SESSION_SECRET=your-session-secret

# CSV Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=text/csv

# PDF Generation
PDF_TEMP_DIR=./temp
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Set up client environment variables in `client/.env`:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_NAME=Vaccination Portal
REACT_APP_VERSION=1.0.0
REACT_APP_DESCRIPTION=Student Vaccination Management System
```

## Database Setup

1. Initialize database and run migrations:
```bash
cd server
npm run migration:run
```

2. Seed initial data (creates admin user):
```bash
npm run seed:run
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend application:
```bash
cd client
npm start
```

## Default Login Credentials

- Admin User:
  - Username: admin
  - Password: admin123

## Available Scripts

### Backend (server/)

```bash
npm start           # Start development server
npm run build      # Build for production
npm run serve      # Run production build
npm run migration:generate  # Generate new migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
npm run seed:run          # Run database seeds
```

### Frontend (client/)

```bash
npm start           # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from create-react-app
npm run lint       # Run ESLint
```

## Core Features

1. **User Authentication**
   - JWT-based authentication
   - Role-based access control
   - Secure password hashing

2. **Student Management**
   - Add/Edit/Delete students
   - Bulk import via CSV
   - Search and filter capabilities
   - View vaccination history

3. **Vaccination Drive Management**
   - Schedule vaccination drives
   - Track available doses
   - Mark completion status
   - Set eligibility criteria

4. **Reports Generation**
   - PDF vaccination reports
   - CSV data export
   - Customizable date ranges
   - Filter by vaccine type/class

5. **Dashboard Analytics**
   - Vaccination coverage stats
   - Drive completion rates
   - Student vaccination status
   - Upcoming drives overview

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Students
- GET `/api/students` - List all students
- POST `/api/students` - Create student
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student
- POST `/api/students/import` - Import CSV

### Vaccination Drives
- GET `/api/vaccination-drives` - List drives
- POST `/api/vaccination-drives` - Create drive
- PUT `/api/vaccination-drives/:id` - Update drive
- DELETE `/api/vaccination-drives/:id` - Delete drive
- PATCH `/api/vaccination-drives/:id/complete` - Complete drive

### Vaccinations
- GET `/api/vaccinations` - List vaccinations
- POST `/api/vaccinations` - Record vaccination
- GET `/api/vaccinations/report` - Generate report
- GET `/api/vaccinations/export` - Export data

### Dashboard
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/vaccination-stats` - Get analytics

## Error Handling

- Global error middleware
- Structured error responses
- Client-side validation
- Proper HTTP status codes
- Detailed error logging

## Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention
- Rate limiting

## Database Schema

### Students
- id: Primary Key
- name: String
- class: String
- dateOfBirth: Date
- parentContact: String

### VaccinationDrives
- id: Primary Key
- vaccineName: String
- scheduledDate: Date
- availableDoses: Number
- isCompleted: Boolean

### Vaccinations
- id: Primary Key
- studentId: Foreign Key
- driveId: Foreign Key
- vaccinationDate: Date
- notes: String

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI components
- React Query for state management
- React Router for navigation
- React Hook Form for validation
- Recharts for data visualization

### Backend
- Node.js with Express
- TypeScript implementation
- PostgreSQL with TypeORM
- JWT authentication
- PDFKit for PDF generation
- CSV parsing/generation
