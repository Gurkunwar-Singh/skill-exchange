import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MainNavbar from '../components/mainNavbar';

const DraggableUser = ({ user }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'user',
    item: { user },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 m-2 rounded-lg cursor-move transition-all duration-200 ${
        isDragging ? 'bg-blue-100 opacity-70' : 'bg-white shadow-md hover:shadow-lg'
      } border border-gray-300 hover:border-blue-400`}
    >
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
        <span className="font-medium text-gray-700 text-sm">{user.name}</span>
      </div>
    </div>
  );
};

const DropZone = ({ team, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'user',
    drop: (item) => onDrop(item.user, team),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 m-3 rounded-lg min-w-[220px] transition-colors duration-300 ${
        isOver ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'
      } border-2 border-dashed`}
    >
      <h4 className="text-md font-semibold mb-2 text-gray-800">{team.name}</h4>
      <div className="space-y-2">
        {team.members.map(m => (
          <div key={m._id} className="bg-white p-2 rounded-lg shadow-sm flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-700 text-sm">{m.name}</span>
          </div>
        ))}
        {team.members.length === 0 && (
          <p className="text-gray-400 text-xs italic">Drag users here</p>
        )}
      </div>
    </div>
  );
};

const TeamBuilder = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    axios.get('/api/teams').then(res => setTeams(res.data));
    axios.get('/api/teams/users').then(res => setUsers(res.data));
  }, []);

  const handleDrop = async (user, team) => {
    const updated = await axios.post('/api/teams/addMember', {
      teamId: team._id,
      userId: user._id,
    });
    setTeams(prev => prev.map(t => t._id === team._id ? updated.data : t));
  };

  const handleCreateTeam = async () => {
    if (newTeamName.trim()) {
      const newTeam = await axios.post('/api/teams/create', { name: newTeamName });
      setTeams([...teams, newTeam.data]);
      setNewTeamName('');
    }
  };

  return (
    <>
      <MainNavbar />
      <DndProvider backend={HTML5Backend}>
        <div className="p-6 max-w-5xl mx-auto mt-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Builder</h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Available Users</h3>
                <div className="max-h-[400px] overflow-y-auto">
                  {users.map(user => (
                    <DraggableUser key={user._id} user={user} />
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-3/4">
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Teams</h3>
                <div className="mb-4 flex justify-between items-center">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="New team name"
                  />
                  <button
                    onClick={handleCreateTeam}
                    className="ml-3 bg-orange-500 text-white py-2 px-4 rounded-md text-sm hover:bg-orange-600"
                  >
                    Create Team
                  </button>
                </div>
                <div className="flex flex-wrap">
                  {teams.map(team => (
                    <DropZone key={team._id} team={team} onDrop={handleDrop} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </>
  );
};

export default TeamBuilder;
