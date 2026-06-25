from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def extract_entities(context):

    prompt = f"""
You are an expert company knowledge assistant.

Analyze the document and extract ALL important named entities.

Return the result in EXACTLY the following format:

People:

- ...

Organizations:

- ...

Departments:

- ...

Technologies:

- ...

Dates:

- ...

Policies / Projects / Products:

- ...

Rules:

1. Only extract entities explicitly present in the document.

2. Do NOT invent entities.

3. If no entities exist in a category, write:

   None

4. Do NOT explain your answers.

5. Return only bullet points.

6. Organization names such as companies, institutions, or firms must appear under Organizations.

7. Employee groups such as Compliance, HR, Legal, Engineering should appear under Departments.

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