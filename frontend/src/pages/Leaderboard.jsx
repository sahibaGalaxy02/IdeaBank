import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { Trophy, Star, Users } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/ideas/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index) => {
    if (index === 0) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (index === 1) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (index === 2) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-white';
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={24} className="text-yellow-600" />;
    if (index === 1) return <Trophy size={24} className="text-gray-500" />;
    if (index === 2) return <Trophy size={24} className="text-orange-600" />;
    return <span className="text-gray-600 font-semibold">#{index + 1}</span>;
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-10">
            <h1
              className="text-4xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
              data-testid="leaderboard-title"
            >
              Leaderboard
            </h1>
            <p className="text-gray-600">Top-rated innovative ideas from our community</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-4" data-testid="leaderboard-list">
              {leaderboard.map((idea, index) => (
                <div
                  key={idea._id}
                  onClick={() => navigate(`/view-idea/${idea._id}`)}
                  className={`border-2 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all ${getRankColor(index)}`}
                  data-testid={`leaderboard-item-${index}`}
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(index)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="leaderboard-idea-title">
                        {idea.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-testid="leaderboard-idea-description">
                        {idea.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-500" fill="currentColor" />
                          <span className="font-semibold" data-testid="leaderboard-idea-rating">
                            {idea.averageRating.toFixed(1)} {/* FIXED */}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 text-gray-600">
                          <Users size={16} />
                          <span data-testid="leaderboard-idea-team-count">
                            {(idea.teamMembers?.length || 0) + 1} members {/* FIXED */}
                          </span>
                        </div>

                        <span className="text-gray-500" data-testid="leaderboard-idea-category">
                          | {idea.category}
                        </span>

                        <span className="text-gray-500" data-testid="leaderboard-idea-student">
                          | by {idea.owner.name} {/* FIXED */}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {idea.technologies.slice(0, 4).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            data-testid="leaderboard-idea-tech"
                          >
                            {tech}
                          </span>
                        ))}
                        {idea.technologies.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{idea.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Trophy size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas yet</h3>
              <p className="text-gray-600">Be the first to submit an innovative idea!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;