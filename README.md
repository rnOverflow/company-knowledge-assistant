Company Knowledge Assistant

A RAG-based enterprise knowledge assistant built to help employees search, analyze and compare internal company documents.

Features

* Multi-document upload
* Question answering with source citations
* Document comparison
* Automatic summaries
* Quiz generation
* Entity extraction
* Action item extraction
* Deadline extraction
* Conversation history support

Tech Stack

Frontend

* React
* Axios
* Vite

Backend

* FastAPI
* Groq API
* ChromaDB
* LangChain

Getting Started

Clone the repository:

git clone https://github.com/rnOverflow/company-knowledge-assistant.git

Backend:

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app.main:app --reload

Frontend:

cd frontend
npm install
npm run dev

Open:

http://localhost:5173

Future Improvements

* Role-based assistants
* Smart document categorization
* Docker support
* Cloud deployment
