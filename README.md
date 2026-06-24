# IngredientIQ — Smart Food Safety Scanner

A web-based Progressive Web App (PWA) that lets users scan food ingredient labels using their device camera and receive an instant AI-powered safety verdict.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router v7 |
| OCR | Tesseract.js v7 |
| AI | Google Gemini 2.5 Flash-Lite |
| Backend | Node.js + Express 5 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Email | Resend |

## Project Structure

~~~
ingredientiq/
├── frontend/   # React + Vite PWA
├── backend/    # Node.js + Express API
└── shared/     # Code shared by both sides
~~~

## Getting Started

### Frontend
~~~bash
cd frontend
npm install
npm run dev
~~~

### Backend
~~~bash
cd backend
npm install
npm run dev
~~~

## Environment Variables

Copy `.env.example` to `.env` in both `frontend/` and `backend/` and fill in the values.