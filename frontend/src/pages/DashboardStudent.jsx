import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import api from '../api/api';
import { Plus, Lightbulb } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const DashboardStudent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) fetchIdeas();
  }, [user]);

  const fetchIdeas = async () => {
    try {
      let endpoint = '/ideas';
      if (filter === 'my') endpoint = '/ideas/my';

      const response = await api.get(endpoint);
      setIdeas(response.data);
    } catch (error) {
      toast.error('Failed to fetch ideas');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filter changes
  useEffect(() => {
    if (user) fetchIdeas();
  }, [filter, user]);

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === 'my') return idea.owner._id === user._id; // FIXED: owner._id
    if (filter === 'approved') return idea.status === 'approved';
    return true;
  });

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: 'Playfair Display, serif' }}
                data-testid="dashboard-title"
              >
                Student Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => navigate('/student/submit')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              data-testid="submit-new-idea-button"
            >
              <Plus size={20} />
              <span>Submit New Idea</span>
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="filter-all-button"
            >
              All Ideas
            </button>
            <button
              onClick={() => setFilter('my')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'my'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="filter-my-button"
            >
              My Ideas
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="filter-approved-button"
            >
              Approved Ideas
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="ideas-grid">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Lightbulb size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas found</h3>
              <p className="text-gray-600 mb-6">Start by submitting your first innovative idea!</p>
              <button
                onClick={() => navigate('/student/submit')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} />
                <span>Submit Idea</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardStudent;