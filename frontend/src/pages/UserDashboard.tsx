import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [alert, setAlert] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user?.username) {
      setAlert("⚠️ You are not logged in.");
      return;
    }

    try {
      const res = await axios.post("https://ai-content-assistant-07ej.onrender.com/ai/summarize", {
        content: input,
        user: user.username,
      });

      setSummary(res.data.summary.summary);
      setAlert("✅ Summary successfully created! wait for admin approval.");
      setInput("");
    } catch (err) {
      console.error(err);
      setAlert("❌ " + ((err as any).response?.data?.error || "Something went wrong."));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Or wherever your login page route is
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-6 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md"
        >
          Logout
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center">AI Content Assistant</h2>

        {alert && (
          <div
            className={`p-3 text-center font-medium rounded-md ${
              alert.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {alert}
          </div>
        )}

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
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Summary</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
