Document Analysis Assistant

An AI-powered document analysis platform that enables organizations to upload documents, extract insights, generate summaries, compare documents, and interact with enterprise knowledge using natural language.

Built with FastAPI, React, LangChain, ChromaDB, and Groq LLMs.

⸻

Features

* Document upload and processing
* Retrieval-Augmented Generation (RAG) based document chat
* AI-powered document summarization
* Automatic key insight extraction
* Multi-document comparison
* Semantic search across documents
* Fast responses using Groq LLMs
* Modern React-based user interface

⸻

Tech Stack

Frontend

* React
* Vite
* Axios

Backend

* FastAPI
* LangChain
* ChromaDB
* Sentence Transformers
* Groq API
* Uvicorn

⸻

Project Structure

company-knowledge-assistant/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── rag/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── chroma_db/
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── docs/
├── README.md
└── .env

⸻

Architecture

User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
LangChain
  ↓
ChromaDB Vector Store
  ↓
Groq LLM

⸻

Installation and Setup

1. Clone the Repository

git clone https://github.com/rnOverflow/company-knowledge-assistant.git
cd company-knowledge-assistant

2. Create a Virtual Environment

python -m venv venv

Activate the virtual environment:

macOS/Linux

source venv/bin/activate

Windows

venv\Scripts\activate

3. Install Backend Dependencies

pip install -r requirements.txt

4. Configure Environment Variables

Create a .env file inside the backend directory.

GROQ_API_KEY=your_groq_api_key_here

Get your Groq API key from:

https://console.groq.com/keys

⸻

Running the Backend

Navigate to the backend directory:

cd backend

Start the FastAPI server:

uvicorn app.main:app --reload

Backend will run at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

⸻

Running the Frontend

Open a new terminal.

Navigate to the frontend directory:

cd frontend

Install frontend dependencies:

npm install

Start the development server:

npm run dev

Frontend will run at:

http://localhost:5173

⸻

API Endpoints

Endpoint	Method	Description
/upload	POST	Upload and process documents
/chat	POST	Ask questions about uploaded documents
/summarize	POST	Generate document summaries
/insights	POST	Extract key insights
/compare	POST	Compare multiple documents

⸻

Future Improvements

* User authentication and authorization
* Conversation history
* Role-based access control
* Document versioning
* Dashboard analytics
* Cloud deployment support
* Multi-user collaboration

⸻

License

This project is licensed under the MIT License.

⸻

Author

Aaryan Pal

GitHub: https://github.com/rnOverflow
