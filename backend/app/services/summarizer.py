import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def summarize_document(context):

    prompt = f"""
You are an expert document analyst.

Generate a concise summary of the following document.

Document:
{context}

Summary:
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content