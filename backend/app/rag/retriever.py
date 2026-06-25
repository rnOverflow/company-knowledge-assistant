from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

CHROMA_PATH = "backend/app/database/chroma_db"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = Chroma(
    persist_directory=CHROMA_PATH,
    embedding_function=embeddings
)

def retrieve_documents(
    query: str,
    k: int = 10,
    document_name: str = None
):

    if document_name:
        docs = vectorstore.similarity_search(
            query,
            k=k,
            filter={"source": document_name}
        )
    else:
        docs = vectorstore.similarity_search(
            query,
            k=k
        )

    return docs