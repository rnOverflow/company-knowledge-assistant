import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question, context):

    prompt = f"""
You are an AI assistant.

Answer ONLY using the information provided in the context.

If the answer is not present in the context, respond with:

"I could not find this information in the uploaded document."

Do not make assumptions.

Do not invent information.

Do not use external knowledge.

Context:
{context}

Question:
{question}

Answer:
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