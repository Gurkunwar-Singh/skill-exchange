import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainNavbar from '../components/mainNavbar';

function MilestoneTracker({ tradeId }) {
  const [milestones, setMilestones] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  useEffect(() => {
    if (tradeId) {
      fetchMilestones();
    }
  }, [tradeId]);

  const fetchMilestones = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/milestones/${tradeId}`);
      setMilestones(res.data);
    } catch (error) {
      console.error("Error fetching milestones:", error.message);
    }
  };

  const addMilestone = async () => {
    if (!tradeId) {
      console.error("tradeId is missing");
      return;
    }

    const newMilestone = { tradeId, title, description, dueDate };
    console.log("Sending milestone:", newMilestone);

    try {
      await axios.post(`${API_BASE_URL}/api/milestones`, newMilestone);

      setTitle('');
      setDescription('');
      setDueDate('');
      fetchMilestones();
    } catch (error) {
      console.error("Error adding milestone:", error.response?.data || error.message);
    }
  };

  const toggleMilestone = async (id) => {
    try {
      await axios.patch(`/api/milestones/${id}/toggle`);
      fetchMilestones();
    } catch (error) {
      console.error("Error toggling milestone:", error.message);
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 max-w-3xl mx-auto mt-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Milestones</h3>

        {/* Milestone Input */}
        <div className="flex flex-col gap-4 mb-4">
          <input
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Milestone Title"
          />
          <textarea
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Milestone Description"
          />
          <input
            type="date"
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <button
            onClick={addMilestone}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm rounded-md transition duration-200"
          >
            Add Milestone
          </button>
        </div>

        {/* Milestone List */}
        <ul className="space-y-2">
          {milestones.map(m => (
            <li key={m._id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() => toggleMilestone(m._id)}
                className="h-4 w-4 bg-orange-500 rounded focus:ring-orange-500 mr-2"
              />
              <span className={`flex-1 text-sm ${m.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {m.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default MilestoneTracker;
