from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def extract_action_items(context):

    prompt = f"""
You are an AI assistant helping employees understand company documents.

Extract all actionable items, responsibilities, required employee actions,

tasks, obligations, or compliance requirements from the document.

Rules:

- Include explicit tasks.

- Include employee responsibilities.

- Include policy obligations.

- Return concise bullet points.

If nothing actionable exists, respond:

"No action items found."

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