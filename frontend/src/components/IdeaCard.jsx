import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

const IdeaCard = ({ idea }) => {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const handleClick = (e) => {
    // Prevent navigation if clicking inside interactive elements
    if (e.target.closest('button, a, input, textarea, select')) return;
    navigate(`/view-idea/${idea._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer"
      data-testid={`idea-card-${idea._id}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 pr-2" data-testid="idea-card-title">
          {idea.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[idea.status]}`}
          data-testid="idea-card-status"
        >
          {idea.status}
        </span>
      </div>

      <p
        className="text-gray-600 text-sm mb-4 line-clamp-2"
        data-testid="idea-card-description"
      >
        {idea.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {idea.technologies.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
            data-testid="idea-card-tech"
          >
            {tech}
          </span>
        ))}
        {idea.technologies.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            +{idea.technologies.length - 3}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-500" fill="currentColor" />
            <span data-testid="idea-card-rating">
              {idea.averageRating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} className="text-gray-600" />
            <span data-testid="idea-card-team-count">
              {(idea.teamMembers?.length || 0) + 1}
            </span>
          </div>
        </div>
        <div
          className="text-xs text-gray-600 truncate max-w-[100px]"
          title={idea.owner.name}
          data-testid="idea-card-student"
        >
          {idea.owner.name}
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;