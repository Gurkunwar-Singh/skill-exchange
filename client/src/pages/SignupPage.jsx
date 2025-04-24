import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('/api/signup', {
        name,
        email,
        password,
        skills: skills.split(',').map(skill => skill.trim()),
        bio,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-grow items-center justify-center px-4 py-8">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm w-full max-w-md">
          <div className="flex justify-center mb-4">
            <svg 
              className="w-10 h-10 text-orange-500"
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Join Freelancer
          </h2>

          {error && (
            <div className="text-red-500 text-center mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              required
            />
            <input
              type="text"
              placeholder="Skills (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
            />
            <textarea
              placeholder="Short Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              rows="3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-500 text-white font-medium text-sm rounded-md hover:bg-orange-600 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-4 text-xs text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-orange-600 hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;