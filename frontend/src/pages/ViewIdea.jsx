import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FeedbackCard from '../components/FeedbackCard';
import TeamCard from '../components/TeamCard';
import api from '../api/api';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Star, Users, Calendar } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const ViewIdea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [idea, setIdea] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [ratingData, setRatingData] = useState({ rating: 5, comment: '' });
  const [joinMessage, setJoinMessage] = useState('');

  useEffect(() => {
    if (id) fetchIdea();
  }, [id]);

  useEffect(() => {
    if (idea) {
      fetchRatings();
      if (user && idea.owner._id === user._id) {
        fetchTeamRequests();
      }
    }
  }, [idea, user]);

  const fetchIdea = async () => {
    try {
      const res = await api.get(`/ideas/${id}`);
      setIdea(res.data);
    } catch (error) {
      toast.error('Idea not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get(`/ratings/${id}`);
      setRatings(res.data);
    } catch (error) {
      console.error('Ratings error:', error);
    }
  };

  const fetchTeamRequests = async () => {
    try {
      const res = await api.get(`/teams/requests/${id}`);
      setTeamRequests(res.data);
    } catch (error) {
      console.error('Team requests error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this idea?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      toast.success('Idea deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleApprove = async () => {
    try {
      await api.put(`/ideas/approve/${id}`);
      toast.success('Idea approved!');
      fetchIdea();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/ideas/reject/${id}`);
      toast.success('Idea rejected');
      fetchIdea();
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/ratings/${id}`, {
        rating: parseInt(ratingData.rating),
        comment: ratingData.comment,
      });
      toast.success('Rating submitted!');
      setShowRatingForm(false);
      setRatingData({ rating: 5, comment: '' });
      fetchRatings();
      fetchIdea();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/teams/request/${id}`, { message: joinMessage });
      toast.success('Request sent!');
      setShowJoinForm(false);
      setJoinMessage('');
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await api.put(`/teams/approve/${requestId}`);
      toast.success('Approved!');
      fetchTeamRequests();
      fetchIdea();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await api.put(`/teams/deny/${requestId}`);
      toast.success('Rejected');
      fetchTeamRequests();
    } catch (error) {
      toast.error('Failed to reject');
    }
  };

  if (loading || !idea) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const isOwner = user?._id === idea.owner._id;
  const canEdit = isOwner && idea.status === 'pending';
  const canDelete = (isOwner && idea.status === 'pending') || user?.role === 'admin';
  const canReview = (user?.role === 'mentor' || user?.role === 'admin') && idea.status === 'pending';
  const canRate = (user?.role === 'mentor' || user?.role === 'admin') && idea.status === 'approved';
  const isTeamMember = idea.teamMembers.some(m => m._id === user?._id);
  const canJoin = user?.role === 'student' && !isOwner && !isTeamMember && idea.status === 'approved';

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {idea.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{idea.owner.name}</span>
                  <span className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[idea.status]}`}>
                {idea.status}
              </span>
            </div>

            <div className="flex items-center space-x-6 mb-6 text-sm">
              <div className="flex items-center space-x-2">
                <Star size={18} className="text-yellow-500" fill="currentColor" />
                <span className="font-medium">{idea.averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({ratings.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-gray-600" />
                <span className="font-medium">{idea.teamMembers.length + 1}</span>
                <span className="text-gray-500">members</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900 leading-relaxed">{idea.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded">{idea.category}</span>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {idea.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded">{tech}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              {canEdit && (
                <button
                  onClick={() => navigate(`/idea/${id}/edit`)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              )}
              {canReview && (
                <>
                  <button
                    onClick={handleApprove}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle size={18} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={handleReject}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle size={18} />
                    <span>Reject</span>
                  </button>
                </>
              )}
              {canRate && (
                <button
                  onClick={() => setShowRatingForm(!showRatingForm)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <Star size={18} />
                  <span>Add Rating</span>
                </button>
              )}
              {canJoin && (
                <button
                  onClick={() => setShowJoinForm(!showJoinForm)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <Users size={18} />
                  <span>Join Team</span>
                </button>
              )}
            </div>
          </div>

          {/* Rating Form */}
          {showRatingForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Rating</h3>
              <form onSubmit={handleSubmitRating} className="space-y-4">
                <select
                  value={ratingData.rating}
                  onChange={(e) => setRatingData({ ...ratingData, rating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {[5,4,3,2,1].map(n => (
                    <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <textarea
                  value={ratingData.comment}
                  onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Your feedback..."
                />
                <div className="flex space-x-3">
                  <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                    Submit
                  </button>
                  <button type="button" onClick={() => setShowRatingForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Join Form */}
          {showJoinForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Team Request</h3>
              <form onSubmit={handleJoinTeam} className="space-y-4">
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Why do you want to join?"
                />
                <div className="flex space-x-3">
                  <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                    Send Request
                  </button>
                  <button type="button" onClick={() => setShowJoinForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ratings */}
          {ratings.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
              <div className="space-y-4">
                {ratings.map(rating => (
                  <FeedbackCard key={rating._id} rating={rating} />
                ))}
              </div>
            </div>
          )}

          {/* Team Requests */}
          {isOwner && teamRequests.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Requests</h3>
              <div className="space-y-4">
                {teamRequests.map(req => (
                  <TeamCard
                    key={req._id}
                    request={req}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewIdea;