from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def extract_deadlines(context):

    prompt = f"""
You are an expert company document analyst.

Extract all important dates, deadlines, timelines,
milestones, renewal dates, meeting dates,
submission dates, and due dates from the document.

Rules:
1. Only include dates explicitly present in the document.
2. Include associated event or task if available.
3. Return concise bullet points.
4. If no dates or deadlines exist, respond:

"No deadlines or important dates found."

Document:
{context}
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