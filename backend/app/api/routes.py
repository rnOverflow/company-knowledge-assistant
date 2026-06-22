from backend.app.services.insights import extract_insights
from backend.app.services.quiz_generator import generate_quiz
from backend.app.services.summarizer import summarize_document
from pydantic import BaseModel
from backend.app.rag.ingest import ingest_document
from backend.app.rag.retriever import retrieve_documents
from backend.app.rag.qa_chain import generate_answer

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "backend/app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# Add the class HERE
class ChatRequest(BaseModel):
    question: str


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunks = ingest_document(file_path)

    return {
        "message": "File uploaded and indexed successfully",
        "filename": file.filename,
        "chunks_created": chunks
    }


# Add the chat endpoint BELOW the upload endpoint
@router.post("/chat")
async def chat(request: ChatRequest):

    docs = retrieve_documents(request.question)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    answer = generate_answer(
        request.question,
        context
    )

    return {
        "question": request.question,
        "answer": answer
    }

@router.get("/summarize")
async def summarize():

    docs = retrieve_documents("Summarize the entire document", k=10)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    summary = summarize_document(context)

    return {
        "summary": summary
    }

@router.get("/generate-quiz")
async def quiz():

    docs = retrieve_documents(
        "Generate questions from the document",
        k=10
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    questions = generate_quiz(context)

    return {
        "quiz_questions": questions
    }

@router.get("/extract-insights")
async def insights():

    docs = retrieve_documents(
        "Extract key insights from the document",
        k=10
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    insights = extract_insights(context)

    return {
        "insights": insights
    }