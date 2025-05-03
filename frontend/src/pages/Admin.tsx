import { useEffect, useState } from "react";
import axios from "axios";

interface Summary {
  id: string;
  content: string;
  summary: string;
  status: "pending" | "approved" | "rejected" | "published";
  user: string;
}

export default function Admin() {
  const [summaries, setSummaries] = useState<Summary[]>([]);

  const fetchSummaries = async () => {
    const res = await axios.get("https://ai-content-assistant-07ej.onrender.com/ai/review");
    setSummaries(res.data);
  };

  const handleAction = async (id: string, action: "approve" | "reject" | "publish") => {
    try {
      await axios.post(`https://ai-content-assistant-07ej.onrender.com/ai/${action}`, { id });
      fetchSummaries(); // Refresh the list
    } catch (err: any) {
      alert(err.response?.data?.error || "Action failed");
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Review Dashboard</h2>

      {summaries.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="grid gap-4">
          {summaries.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow">
              <p className="text-sm text-gray-500 mb-1">Submitted by: {item.user}</p>
              <p className="font-semibold mb-2">Original:</p>
              <p className="mb-2 text-gray-700">{item.content}</p>
              <p className="font-semibold mb-2">AI Summary:</p>
              <p className="mb-2 text-gray-800">{item.summary}</p>

              <p className="text-sm mb-3">
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{item.status}</span>
              </p>

              <div className="flex gap-2">
                {item.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}

                {item.status === "approved" && (
                  <button
                    onClick={() => handleAction(item.id, "publish")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
