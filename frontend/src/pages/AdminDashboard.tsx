import { useEffect, useState } from "react";
import axios from "axios";

interface Summary {
  id: number;
  content: string;
  summary: string;
  author: string;
  status: string;
}

const AdminDashboard = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchSummaries = async () => {
    try {
      const res = await axios.get("https://ai-content-assistant-07ej.onrender.com/review", {
        params: { user: user.username },
      });
      setSummaries(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to fetch summaries");
    }
  };

  const handleAction = async (id: number, action: "approved" | "rejected") => {
    try {
      await axios.post(`https://ai-content-assistant-07ej.onrender.com/review/${id}`, {
        user: user.username,
        action,
      });
      fetchSummaries(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.error || "Action failed");
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Admin Review Panel</h2>

        {summaries.length === 0 ? (
          <p className="text-center text-gray-500">No pending summaries</p>
        ) : (
          summaries.map((s) => (
            <div key={s.id} className="border border-gray-300 p-4 rounded-md space-y-2">
              <p className="text-sm text-gray-500">Submitted by: {s.author}</p>
              <p className="font-semibold text-gray-800">Original:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{s.content}</p>

              <p className="font-semibold text-gray-800 mt-2">AI Summary:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{s.summary}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAction(s.id, "approved")}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(s.id, "rejected")}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
