import React, { useState } from 'react';
import axios from 'axios';
import MainNavbar from '../components/mainNavbar';

const AgreementForm = () => {
  const [title, setTitle] = useState('');
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const agreement = {
        serviceTitle: title,
        terms,
      };
      const res = await axios.post(`${API_BASE_URL}/api/agreements`, agreement);
      window.open(`${API_BASE_URL}/api/agreements/${res.data._id}/download`);
    } catch (err) {
      console.error('Failed to submit agreement:', err);
      alert('Error submitting agreement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNavbar />
      <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Service Agreement</h2>

        <div className="flex flex-col gap-4">
          {/* Service Title */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Service Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter service title"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Terms & Conditions</label>
            <textarea
              value={terms}
              onChange={e => setTerms(e.target.value)}
              placeholder="Enter agreement terms..."
              rows="4"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-700 text-white font-medium py-2 rounded-md transition duration-200 text-sm"
          >
            {loading ? 'Submitting...' : 'Submit Agreement'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AgreementForm;
