import React, { useState, useEffect, useContext, useMemo } from 'react';
import AuthContext from '../context/AuthContext'; 
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import api from '../api/api'; 
import { Filter, TrendingUp } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const DashboardAdmin = () => {
  const { user } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIdeas();
  }, [filter]); // ← Re-fetch when filter changes

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data);
    } catch (error) {
      toast.error('Failed to fetch ideas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (filter === 'all') return true;
      return idea.status === filter;
    });
  }, [ideas, filter]);

  const stats = useMemo(() => {
    return {
      total: ideas.length,
      pending: ideas.filter(i => i.status === 'pending').length,
      approved: ideas.filter(i => i.status === 'approved').length,
      rejected: ideas.filter(i => i.status === 'rejected').length,
    };
  }, [ideas]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: 'Playfair Display, serif' }}
              data-testid="admin-dashboard-title"
            >
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-total">
              <div className="text-sm text-gray-600 mb-1">Total Ideas</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-pending">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-approved">
              <div className="text-sm text-gray-600 mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="stat-rejected">
              <div className="text-sm text-gray-600 mb-1">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <Filter size={20} className="text-gray-600" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-all"
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-pending"
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-approved"
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rejected'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
              }`}
              data-testid="admin-filter-rejected"
            >
              Rejected
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="admin-ideas-grid">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600">No ideas found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardAdmin;