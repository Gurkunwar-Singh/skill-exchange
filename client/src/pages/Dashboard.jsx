// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import MainNavbar from "../components/mainNavbar";
// import { io } from "socket.io-client";

// const Dashboard = () => {
//   const [profile, setProfile] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [credits, setCredits] = useState(0);
//   const [newRequest, setNewRequest] = useState(""); 
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null); // Store socket in state

//   useEffect(() => {
//     fetchDashboardData();
//     const newSocket = setupWebSocket();
//     setSocket(newSocket); // Store socket for cleanup

//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found");
//         return;
//       }

//       const { data } = await axios.get("/api/dashboard", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setProfile(data.profile);
//       setMatches(data.matches);
//       setRequests(data.requests);
//       setCredits(data.credits);
//     } catch (error) {
//       console.error("Error fetching dashboard:", error);
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupWebSocket = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const newSocket = io("http://localhost:5000");

//     newSocket.emit("join", token);

//     newSocket.on("updateMatches", (newMatches) => {
//       console.log("New matches received:", newMatches);
//       setMatches(newMatches);
//     });

//     newSocket.on("updateRequests", (updatedRequests) => {
//       console.log("Updated requests received:", updatedRequests);
//       setRequests(updatedRequests);
//     });

//     return newSocket;
//   };

//   const createServiceRequest = async () => {
//     if (!newRequest.trim()) return;

//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.post(
//         "/api/service-requests",
//         { description: newRequest },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // 🔹 Fetch updated list from backend instead of adding manually
//       fetchDashboardData();
//       setNewRequest("");
//     } catch (error) {
//       console.error("Error creating request:", error);
//       setError("Failed to create service request.");
//     }
//   };

//   const updateRequestStatus = async (id, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `/api/service-requests/${id}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // 🔹 Fetch updated list instead of modifying local state manually
//       fetchDashboardData();
//     } catch (error) {
//       console.error("Error updating request:", error);
//       setError("Failed to update request status.");
//     }
//   };

//   if (loading) return <p className="text-center text-lg text-blue-500 mt-10">Loading dashboard...</p>;

//   return (
//     <div className="bg-gray-900 text-white min-h-screen">
//       <MainNavbar />

//       <div className="p-10 flex flex-col space-y-6">
//         {error && <p className="text-red-500">{error}</p>}

//         {/* Profile Section */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 w-full">
//           <h1 className="text-3xl font-bold text-blue-400">Dashboard</h1>
//           {profile ? (
//             <div className="mt-4 text-left">
//               <h2 className="text-xl font-semibold text-blue-300">Profile</h2>
//               <p><strong>Name:</strong> {profile.name}</p>
//               <p><strong>Email:</strong> {profile.email}</p>
//               <p><strong>Bio:</strong> {profile.bio}</p>
//               <p><strong>Skills:</strong> {profile.skills.join(", ")}</p>
//             </div>
//           ) : (
//             <p className="text-gray-400">Loading profile...</p>
//           )}
//         </div>

//         {/* Skill Matches Section */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 w-full">
//           <h2 className="text-xl font-semibold text-green-300">Skill Matches</h2>
//           {matches.length > 0 ? (
//             <ul>
//               {matches.map((match) => (
//                 <li key={match._id} className="py-1">
//                   <strong>{match.name}</strong> - {match.skills.join(", ")}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-400">No matches found.</p>
//           )}
//         </div>

//         {/* Service Requests Section */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 w-full">
//           <h2 className="text-xl font-semibold text-yellow-300">Service Requests</h2>

//           {/* Create new service request */}
//           <div className="flex items-center space-x-3">
//             <input
//               type="text"
//               value={newRequest}
//               onChange={(e) => setNewRequest(e.target.value)}
//               placeholder="Describe your request..."
//               className="bg-gray-700 text-white p-2 rounded-md w-full"
//             />
//             <button
//               onClick={createServiceRequest}
//               className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
//             >
//               Add
//             </button>
//           </div>

//           {/* Display service requests */}
//           {requests.length > 0 ? (
//             <ul className="mt-4">
//               {requests.map((request) => (
//                 <li key={request._id} className="py-2 flex justify-between items-center">
//                   <span>{request.description} - <strong>{request.status}</strong></span>

//                   {/* Update status buttons */}
//                   <div className="space-x-2">
//                     {request.status === "pending" && (
//                       <button
//                         onClick={() => updateRequestStatus(request._id, "accepted")}
//                         className="bg-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-600"
//                       >
//                         Accept
//                       </button>
//                     )}
//                     {request.status === "accepted" && (
//                       <button
//                         onClick={() => updateRequestStatus(request._id, "completed")}
//                         className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
//                       >
//                         Complete
//                       </button>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-400">No service requests available.</p>
//           )}
//         </div>

//         {/* Skill Credits Section */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 w-full">
//           <h2 className="text-xl font-semibold text-purple-300">Skill Credits</h2>
//           <p>You have <strong>{credits}</strong> credits.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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

      const { data } = await axios.get("/api/dashboard", {
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

  const setupWebSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:5000");
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
        "/api/service-requests",
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
              <p><strong>Skills:</strong> {profile.skills.join(", ")}</p>
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
              {requests.map((request) => (
                <li key={request._id} className="p-4 rounded-lg flex justify-between items-center bg-slate-100">
                  <span>
                    {request.description} – <strong>{request.status}</strong>
                  </span>
                  <div className="space-x-2">
                    {request.status === "pending" && (
                      <button
                        onClick={() => updateRequestStatus(request._id, "accepted")}
                        className="px-3 py-1 rounded-md font-semibold bg-green-500 hover:bg-green-600 text-white"
                      >
                        Accept
                      </button>
                    )}
                    {request.status === "accepted" && (
                      <button
                        onClick={() => updateRequestStatus(request._id, "completed")}
                        className="px-3 py-1 rounded-md font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No service requests yet.</p>
          )}
        </section>

        {/* Skill Credits */}
        <section className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Skill Credits</h2>
          <p className="text-lg">
            You have <span className="font-bold">{credits}</span> credits available.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
