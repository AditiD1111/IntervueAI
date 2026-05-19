# IntervueAI

IntervueAI is an interview preparation app with a React frontend and an Express backend.

## What is in the project now

- A landing page and placeholder auth pages in the frontend
- A new chatbot screen at `/chat`
- Backend API routes for auth, sessions, questions, and AI
- Groq-powered endpoints for chatbot replies, question generation, and concept explanations

## Environment setup

- Backend variables are listed in `backend/.env.example`
- Frontend variables are listed in `frontend/.env.example`

## Groq setup

1. Create a free API key at https://console.groq.com
2. Add `GROQ_API_KEY` and `GROQ_MODEL=llama-3.1-8b-instant` to `backend/.env`
3. Restart the backend after changing environment variables
