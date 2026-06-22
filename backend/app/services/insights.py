import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def extract_insights(context):

    prompt = f"""
You are an expert document analyst.

Analyze the following document and extract:

1. Important Points
2. Key Entities (people, organizations, etc.)
3. Action Items
4. Deadlines or Dates mentioned

Document:
{context}

Return the response in a clean structured format.
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