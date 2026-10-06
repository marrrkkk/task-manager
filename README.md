# Task Manager

A simple Task Manager web app: React frontend + Django REST Framework backend + SQLite.

## Features

- View a list of tasks
- Create a new task
- Update an existing task (title + description via PUT)
- Mark a task as completed (via PATCH)
- Delete a task
- Loading, error, and empty states

## Tech Stack

Backend:

- Django
- Django REST Framework
- SQLite

Frontend:

- React (Hooks)
- Vite
- Fetch API
- Plain CSS

## Project Structure

```text
backend/    Django project (config) + tasks app
frontend/   Vite + React app
```

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/tasks/`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).
API calls to `/tasks/` are proxied to `http://127.0.0.1:8000`
(see `vite.config.js`), so run the backend first.

## API Endpoints

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | /tasks/      | List all tasks              |
| POST   | /tasks/      | Create task                 |
| GET    | /tasks/{id}/ | Retrieve task               |
| PUT    | /tasks/{id}/ | Update title and description |
| PATCH  | /tasks/{id}/ | Update completed status      |
| DELETE | /tasks/{id}/ | Delete task                 |

Example task:

```json
{
  "id": 1,
  "title": "Buy milk",
  "description": "2 liters",
  "completed": false,
  "created_at": "2026-10-06T08:46:57.353738Z"
}
```

## Assumptions

- PATCH accepts `completed` only. Any other field (or combination) in a
  PATCH body returns `400`. Use PUT for title/description.
- PUT accepts `title` and `description` only. Sending anything else
  (e.g. `completed`) returns `400`. Use PATCH for completed status.
- SQLite is used as required; no other database or service is needed.
- The Vite dev proxy handles local frontend/backend communication, so
  no CORS package is installed.
- `title` cannot be blank or whitespace-only (validated in the API and
  in the form). `description` may be empty.
- No authentication, pagination, filtering, or search (out of scope).
