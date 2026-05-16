# IntervueAI

IntervueAI is an interview preparation app with a React frontend and an Express backend.

## What is in the project now

- A landing page and placeholder auth pages in the frontend
- A new chatbot screen at `/chat`
- Backend API routes for auth, sessions, questions, and AI
- Ollama-powered endpoints for chatbot replies, question generation, and concept explanations

## Environment setup

- Backend variables are listed in `backend/.env.example`
- Frontend variables are listed in `frontend/.env.example`

## Ollama setup

1. Install Ollama for Windows: https://docs.ollama.com/windows
2. Pull a model, for example: `ollama pull qwen2.5:3b`
3. Make sure Ollama is running locally on `http://localhost:11434`
