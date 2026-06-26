from backend.app.rag.retriever import retrieve_documents
from backend.app.rag.qa_chain import generate_answer

def compare_documents(doc1, doc2):

    docs1 = retrieve_documents(
        "Summarize document",
        k=10,
        document_name=doc1
    )

    docs2 = retrieve_documents(
        "Summarize document",
        k=10,
        document_name=doc2
    )

    context1 = "\n".join(
        [doc.page_content for doc in docs1]
    )

    context2 = "\n".join(
        [doc.page_content for doc in docs2]
    )

    prompt = f"""
Compare these two documents.

Document 1:
{context1}

Document 2:
{context2}

Provide:
1. Main purpose of each document.
2. Similarities.
3. Differences.
4. Important changes.
5. Final summary.
"""

    return generate_answer(
        "Compare both documents",
        prompt
    )