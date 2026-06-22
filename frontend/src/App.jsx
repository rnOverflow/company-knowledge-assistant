import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const uploadFile = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const askQuestion = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        {
          question: question,
        }
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      alert("Error asking question");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Company Knowledge Assistant</h1>

      <hr />

      <h2>Upload Document</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadFile}>
        Upload
      </button>

      <hr />

      <h2>Ask Questions</h2>

      <input
        type="text"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "300px" }}
      />

      <button onClick={askQuestion}>
        Ask
      </button>

      <h3>Answer:</h3>

      <p>{answer}</p>
    </div>
  );
}

export default App;