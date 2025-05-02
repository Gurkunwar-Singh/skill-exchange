

import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import MainNavbar from "../components/mainNavbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [credits, setCredits] = useState(0);
  const [newRequest, setNewRequest] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
  useEffect(() => {
    fetchDashboardData();
    const newSocket = setupWebSocket();
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(data.profile);
      setMatches(data.matches);
      setRequests(data.requests);
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const apiUrl =import.meta.env.VITE_PROD_BASE_URL;;
  const setupWebSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(apiUrl);
    newSocket.emit("join", token);

    newSocket.on("updateMatches", (newMatches) => setMatches(newMatches));
    newSocket.on("updateRequests", (updatedRequests) => setRequests(updatedRequests));

    return newSocket;
  };

  const createServiceRequest = async () => {
    if (!newRequest.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/service-requests`,
        { description: newRequest },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
      setNewRequest("");
    } catch (error) {
      console.error("Error creating request:", error);
      setError("Failed to create service request.");
    }
  };
  console.log(requests);
console.log(requests.length);
  const updateRequestStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/service-requests/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating request:", error);
      setError("Failed to update request status.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Profile Section */}
        <section className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h2>
          {profile ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Skills:</strong> {profile.skills?.join(", ")||"None"}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </section>

        {/* Skill Matches */}
        <section className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skill Matches</h2>
          {matches.length > 0 ? (
            <ul className="space-y-3">
              {matches.map((match) => (
                <li key={match._id} className="p-4 rounded-lg bg-slate-100">
                  <strong>{match.name}</strong> – {match.skills.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p>No matches found.</p>
          )}
        </section>

        {/* Service Requests */}
        <section className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Requests</h2>

          <div className="flex items-center space-x-3 mb-4">
            <input
              type="text"
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              placeholder="Describe your request..."
              className="flex-1 px-4 py-2 rounded-md focus:outline-none border border-gray-300"
            />
            <button
              onClick={createServiceRequest}
              className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              Add
            </button>
          </div>

          {requests.length > 0 ? (
            <ul className="space-y-3">
              {requests.map((request,index) => (
                <li key={request._id||index} className="p-4 rounded-lg flex justify-between items-center bg-slate-100">
                  <span>
                    {request.description} – <strong>{request.status}</strong>
                  </span>
                  <div className="space-x-2">
                    {request.status === "pending" && (
                      <button
                        onClick={() => updateRequestStatus(request._id, "accepted")}
                        className="bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-600 text-white"
                      >
                        Accept
                      </button>
                    )}
                    {request.status === "accepted" && (
                      <button
                        onClick={() => updateRequestStatus(request._id, "completed")}
                        className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600 text-white"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No service requests available.</p>
          )}
        </section>

        {/* Skill Credits */}
        <section className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skill Credits</h2>
          <p>You have <strong>{credits}</strong> credits.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
