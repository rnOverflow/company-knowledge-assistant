chat_history = []

def add_to_history(question, answer):

    chat_history.append({
        "question": question,
        "answer": answer
    })

    # keep only latest 5 exchanges

    if len(chat_history) > 5:
        chat_history.pop(0)


def get_chat_history():

    history_text = ""

    for item in chat_history:

        history_text += (
            f"User: {item['question']}\n"
            f"Assistant: {item['answer']}\n\n"
        )

    return history_text