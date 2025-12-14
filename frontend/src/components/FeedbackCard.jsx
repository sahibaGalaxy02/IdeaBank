import React from 'react';
import { Star } from 'lucide-react';

const FeedbackCard = ({ rating }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="feedback-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium text-gray-900" data-testid="feedback-reviewer-name">
            {rating.user?.name || 'Anonymous'}
          </div>
          <div className="text-xs text-gray-500" data-testid="feedback-date">
            {new Date(rating.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating.rating ? 'text-yellow-500' : 'text-gray-300'}
              fill={i < rating.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      </div>
      {rating.comment && (
        <p className="text-gray-600 text-sm mt-2" data-testid="feedback-comment">
          {rating.comment}
        </p>
      )}
    </div>
  );
};

export default FeedbackCard;