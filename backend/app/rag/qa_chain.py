import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question, context):

    prompt = f"""
You are an AI assistant that answers questions using ONLY the provided context.

Instructions:

- Use the context to answer the question clearly and completely.

- If the context contains relevant information, answer in detail.

- Do not use outside knowledge.

- If the answer truly does not exist in the context, say:

  "I could not find this information in the uploaded document."
  

Context:

{context}

Question:

{question}

Detailed Answer:

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