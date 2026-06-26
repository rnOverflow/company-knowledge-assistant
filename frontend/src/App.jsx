import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function App() {
  const [file, setFile] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState("");
  const [insights, setInsights] = useState("");

  const [loading, setLoading] = useState(false);
  const [actionItems, setActionItems] = useState("");
  const [entities, setEntities] = useState("");
  const [deadlines, setDeadlines] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [compareDoc1, setCompareDoc1] = useState("");
  const [compareDoc2, setCompareDoc2] = useState("");
  const [comparison, setComparison] = useState("");

const uploadFile = async () => {

    const formData = new FormData();

    for (let i = 0; i < file.length; i++) {
        formData.append("files", file[i]);
    }

    try {
        setLoading(true);

        const response = await axios.post(
            "http://127.0.0.1:8000/upload",
            formData
        );

        alert(response.data.message);
        const names = Array.from(file).map(f => f.name);

        setUploadedDocs(prev => [
            ...new Set([...prev, ...names])
        ]);

        if (names.length > 0) {
            setSelectedDocument(names[0]);
        }

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

  const askQuestion = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/chat",
        { question,
          document_name: selectedDocument }
      );

      setAnswer(response.data.answer);
      setSources(response.data.sources || []);
      setChatHistory((prev) => [
        ...prev,
        {
          question: question,
          answer: response.data.answer,
          sources: response.data.sources || [],
        },
      ]);
    } catch (error) {
      console.log(error);
      alert("Error asking question");
    } finally {
      setLoading(false);
    }
  };

  const summarizeDocument = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/summarize"
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/generate-quiz"
      );

      setQuiz(response.data.quiz_questions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const extractInsights = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/extract-insights"
      );

      setInsights(response.data.insights);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getActionItems = async () => {

  try {

    setLoading(true);

    const response = await axios.get(
      "http://127.0.0.1:8000/action-items"
    );

    setActionItems(response.data.action_items);

  } catch (error) {

    console.log(error);
    alert("Failed to extract action items");

  } finally {

    setLoading(false);
  }
};

const getEntities = async () => {

  try {

    setLoading(true);

    const response = await axios.get(
      "http://127.0.0.1:8000/entities"
    );

    setEntities(response.data.entities);

  } catch (error) {

    console.log(error);
    alert("Failed to extract entities");

  } finally {

    setLoading(false);
  }
};

const getDeadlines = async () => {

  try {

    setLoading(true);

    const response = await axios.get(
      "http://127.0.0.1:8000/deadlines"
    );

    setDeadlines(response.data.deadlines);

  } catch (error) {

    console.log(error);
    alert("Failed to extract deadlines");

  } finally {

    setLoading(false);
  }
};

const compareDocuments = async () => {

  if (!compareDoc1 || !compareDoc2) {
  alert("Please select both documents");
  return;
  }
  
  if (compareDoc1 === compareDoc2) {
    alert("Please select two different documents");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.get(
      "http://127.0.0.1:8000/compare",
      {
        params: {
          doc1: compareDoc1,
          doc2: compareDoc2
        }
      }
    );

    setComparison(response.data.comparison);

  } catch (error) {
    console.log(error);
    alert("Failed to compare documents");
  } finally {
    setLoading(false);
  }
};

  const downloadSummary = () => {

  if (!summary) {
    alert("Generate a summary first!");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Company Knowledge Assistant", 20, 20);

  doc.setFontSize(14);
  doc.text("Document Summary", 20, 35);

  doc.setFontSize(11);

  const splitText = doc.splitTextToSize(summary, 170);

  doc.text(splitText, 20, 50);

  doc.save("document-summary.pdf");
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-10">
           Company Knowledge Assistant
        </h1>

        {/* Upload Section */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
             Upload Document
          </h2>

          <div className="flex gap-4">
            <input
                type="file"
                multiple
                onChange={(e) => setFile(e.target.files)}
            />
            <p className="mt-2 text-gray-300">
              {file && Array.from(file).map((f) => f.name).join(", ")}
            </p>

            <button
                onClick={uploadFile}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {uploadedDocs.length > 0 && (
          <div className="mt-4 mb-4">
            <label className="block mb-2 text-lg font-semibold">
              Select Document
            </label>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-800 border border-gray-600"
            >
              {uploadedDocs.map((doc, index) => (
                <option key={index} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>
        )}
        </div>

{/* Compare Documents */}

{uploadedDocs.length >= 2 && (

<div className="bg-slate-900 rounded-xl p-6 mb-6">

  <h2 className="text-2xl font-bold mb-4">
    Compare Documents
  </h2>

  <div className="grid grid-cols-2 gap-4 mb-4">

    <select
      value={compareDoc1}
      onChange={(e) => setCompareDoc1(e.target.value)}
      className="p-3 rounded-lg bg-slate-800"
    >
      <option value="">Select Document 1</option>

      {uploadedDocs.map((doc, index) => (
        <option key={index} value={doc}>
          {doc}
        </option>
      ))}

    </select>

    <select
      value={compareDoc2}
      onChange={(e) => setCompareDoc2(e.target.value)}
      className="p-3 rounded-lg bg-slate-800"
    >
      <option value="">Select Document 2</option>

      {uploadedDocs.map((doc, index) => (
        <option key={index} value={doc}>
          {doc}
        </option>
      ))}

    </select>

  </div>

  <button
    onClick={compareDocuments}
    disabled={!compareDoc1 || !compareDoc2}
    className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
  >
    Compare
  </button>

</div>

)}

        {/* Chat */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
             Ask Questions
          </h2>

          <div className="flex gap-4">
            <input
              type="text"
              multiple
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 p-3 rounded bg-slate-800 border"
            />

            <button
              onClick={askQuestion}
              className="bg-green-600 px-6 rounded hover:bg-green-700"
            >
              Ask
            </button>
          </div>


          {chatHistory.length > 0 && (
  <div className="mt-6">
    <h3 className="text-2xl font-bold mb-4">
       Chat History
    </h3>

<button
  onClick={() => setChatHistory([])}
  className="bg-red-600 px-4 py-2 rounded"
>
   Clear Chat
</button>

    {chatHistory.map((chat, index) => (
      <div
        key={index}
        className="bg-slate-800 p-5 rounded-xl mb-4"
      >
        <p className="font-bold text-green-400">
          You:
        </p>

        <p className="mb-4">
          {chat.question}
        </p>

        <p className="font-bold text-blue-400">
          AI:
        </p>

        <p>{chat.answer}</p>

        {chat.sources.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">
               Sources:
            </p>

            <ul className="list-disc ml-6 text-gray-300">
              {chat.sources.map((src, idx) => (
                <li key={idx}>{src}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
)}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <button
            onClick={summarizeDocument}
            className="bg-purple-600 p-4 rounded-xl hover:bg-purple-700"
          >
             Generate Summary
          </button>

          <button
            onClick={generateQuiz}
            className="bg-pink-600 p-4 rounded-xl hover:bg-pink-700"
          >
             Generate Quiz
          </button>

          <button
            onClick={extractInsights}
            className="bg-orange-600 p-4 rounded-xl hover:bg-orange-700"
          >
             Extract Insights
          </button>

          <button
            onClick={getActionItems}
            className="bg-yellow-600 px-4 py-2 rounded-xl hover:bg-yellow-700"
          >
            Extract Action Items
          </button>

          <button
            onClick={getEntities}
            className="bg-cyan-600 px-4 py-2 rounded-xl hover:bg-cyan-700"
          >
            Extract Entities
          </button>

          <button
            onClick={getDeadlines}
            className="bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700"
          >
            Extract Deadlines
          </button>
        </div>

        {/* Results */}
        {summary && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">
            <h2 className="text-2xl font-bold mb-4">
               Summary
            </h2>
            <p>{summary}</p>
          </div>
        )}

        {quiz && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">
            <h2 className="text-2xl font-bold mb-4">
               Quiz
            </h2>
            <pre className="whitespace-pre-wrap">{quiz}</pre>
          </div>
        )}

        {insights && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">
            <h2 className="text-2xl font-bold mb-4">
               Insights
            </h2>
            <pre className="whitespace-pre-wrap">
              {insights}
            </pre>
          </div>
        )}

        {comparison && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Document Comparison
            </h2>

            <pre className="whitespace-pre-wrap leading-8 text-gray-200">
              {comparison}
            </pre>
          </div>
        )}

        {actionItems && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-xl font-bold mb-4">
              Action Items
            </h2>

            <pre className="whitespace-pre-wrap">
              {actionItems}
            </pre>

          </div>
        )}

        {entities && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-xl font-bold mb-4">
              Entities
            </h2>

            <pre className="whitespace-pre-wrap">
              {entities}
            </pre>

          </div>
        )}

        {deadlines && (
          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-xl font-bold mb-4">
              Deadlines & Important Dates
            </h2>

            <pre className="whitespace-pre-wrap">
              {deadlines}
            </pre>

          </div>
        )}

        {loading && (
          <h2 className="text-center text-2xl mt-8">
             Processing...
          </h2>
        )}

      </div>
      <button
  onClick={downloadSummary}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4"
>
  Download Summary PDF
</button>
    </div>
  );
}

export default App;