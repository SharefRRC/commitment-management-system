# Commitment Management System API

A back-end capstone project built with Node.js, TypeScript, Express, Firebase Firestore, and Firebase Authentication.

## Project Overview

This API helps users manage commitments in a more realistic way than a normal to-do list.

Each commitment includes both:
- a due date
- a must-start-by date

The goal is to help users avoid late starts, rushed deadlines, and overdue items.

## Main Features

- Authentication with Firebase
- Role-based authorization with Firebase custom claims
- Commitments CRUD
- Categories CRUD
- Reminders CRUD
- Activity log tracking
- Productivity analytics
- Joi validation
- Swagger API documentation
- Jest unit tests
- GitHub Actions CI workflow

## Tech Stack

- Node.js
- TypeScript
- Express
- Firebase Firestore
- Firebase Authentication
- Joi
- Swagger / OpenAPI
- Jest
- GitHub Actions

## Folder Structure

```txt
src/
  config/
  controllers/
  docs/
  middleware/
  models/
  repositories/
  routes/
  services/
  types/
  utils/
  validators/
tests/
.github/workflows/
```

## Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file

```env
PORT=3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

4. Start development server

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm test
```

## API Documentation

Swagger UI is available at:

```txt
http://localhost:3000/api-docs
```

## Main Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- PATCH `/api/auth/users/:id/promote-admin`

### Commitments
- GET `/api/commitments`
- GET `/api/commitments/:id`
- POST `/api/commitments`
- PUT `/api/commitments/:id`
- PATCH `/api/commitments/:id/status`
- DELETE `/api/commitments/:id`

### Categories
- GET `/api/categories`
- GET `/api/categories/:id`
- POST `/api/categories`
- PUT `/api/categories/:id`
- DELETE `/api/categories/:id`

### Reminders
- GET `/api/reminders`
- GET `/api/reminders/:id`
- POST `/api/reminders`
- PUT `/api/reminders/:id`
- DELETE `/api/reminders/:id`

### Activity Logs
- GET `/api/activity-logs`
- GET `/api/activity-logs/:id`
- GET `/api/commitments/:id/activity-logs`

### Analytics
- GET `/api/analytics/summary`
- GET `/api/analytics/categories`
- GET `/api/analytics/delays`

## Testing

Run tests with:

```bash
npm test
```

## Architecture

This project follows a layered architecture:
- Routes layer
- Controllers layer
- Services layer
- Repository layer

## New Component

The researched back-end component is Productivity Analytics.

It adds:
- total commitments completed
- late starts
- overdue items
- category delay analysis
- average delay in days