import os
from groq import Groq
from dotenv import load_dotenv
from backend.app.services.chat_memory import get_chat_history

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question, context):



    history = get_chat_history()

    prompt = f"""

You are an enterprise knowledge assistant.

Previous Conversation:

{history}

Document Context:

{context}

Current Question:

{question}

Answer based on both the conversation history

and the document context.

Use ONLY the provided document context.

If the answer is not present in the document,

say:

"I could not find this information in the uploaded document."

Provide a detailed answer when information is available.

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