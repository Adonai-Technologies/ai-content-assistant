import { useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async () => {
    if (!user?.username) {
      alert("You are not logged in.");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:3001/ai/summarize", {
        content: input,
        user: user.username,
      });
      setSummary(res.data.summary);
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">AI Content Assistant</h2>

        <textarea
          rows={6}
          placeholder="Paste your content here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition cursor-pointer"
        >
          Summarize with AI
        </button>

        {summary && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Summary</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
