from app.services.insights import extract_insights
from app.services.quiz_generator import generate_quiz
from app.services.summarizer import summarize_document
from pydantic import BaseModel
from app.services.action_items import extract_action_items
from app.services.entities import extract_entities
from app.services.deadlines import extract_deadlines


class QuestionRequest(BaseModel):
    question: str
    document_name: str | None = None
from app.rag.ingest import ingest_document
from app.rag.retriever import retrieve_documents
from app.rag.qa_chain import generate_answer

from app.services.document_comparison import compare_documents
from app.services.chat_memory import add_to_history
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


from typing import List

@router.post("/upload")
async def upload_document(
    files: List[UploadFile] = File(...)
):

    total_chunks = 0

    for file in files:

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        chunks = ingest_document(file_path)
        total_chunks += chunks

    return {
        "message": "Documents uploaded and indexed successfully",
        "chunks_created": total_chunks
    }


# Add the chat endpoint BELOW the upload endpoint
@router.post("/chat")
async def chat(request: QuestionRequest):

    docs = retrieve_documents(
        request.question,
        k=10,
        document_name=request.document_name
    )

    answer = generate_answer(request.question, docs)

    add_to_history(
    request.question,
    answer
)

    sources = []

    for doc in docs:
        filename = doc.metadata.get(
            "source",
            "Unknown"
        )

        page = doc.metadata.get(
            "page_number",
            "N/A"
        )

        sources.append(
            f"{filename} - Page {page}"
        )

    return {
        "answer": answer,
        "sources": sources
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
        "company names people departments technologies policies dates",
        k=10
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    insights = extract_insights(context)

    return {
        "insights": insights
    }

@router.get("/compare")
async def compare(doc1: str, doc2: str):

    result = compare_documents(doc1, doc2)

    return {
        "comparison": result
    }

@router.get("/action-items")
async def action_items():

    docs = retrieve_documents(
        "Extract all action items from the document",
        k=10
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    items = extract_action_items(context)

    return {
        "action_items": items
    }

@router.get("/entities")
async def entities():

    docs = retrieve_documents(
        "Extract important entities from the document",
        k=10
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    entities = extract_entities(context)

    return {
        "entities": entities
    }

@router.get("/deadlines")
async def deadlines():

    docs = retrieve_documents(
        "Extract all deadlines, due dates, meetings, milestones and important dates",
        k=10
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    result = extract_deadlines(context)

    return {
        "deadlines": result
    }