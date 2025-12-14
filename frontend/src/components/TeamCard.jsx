import React from 'react';
import { Check, X, Clock } from 'lucide-react';

const TeamCard = ({ request, onApprove, onReject }) => {
  const statusIcons = {
    pending: <Clock size={18} className="text-yellow-600" />,
    approved: <Check size={18} className="text-green-600" />,
    rejected: <X size={18} className="text-red-600" />,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5" data-testid="team-request-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium text-gray-900" data-testid="request-student-name">
            {request.requester.name}
          </div>
          <div className="text-xs text-gray-500" data-testid="request-date">
            {new Date(request.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div>{statusIcons[request.status]}</div>
      </div>

      {request.message && (
        <p className="text-gray-600 text-sm mb-4" data-testid="request-message">
          {request.message}
        </p>
      )}

      {request.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => onApprove(request._id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            data-testid="approve-request-button"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(request._id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            data-testid="reject-request-button"
          >
            Reject
          </button>
        </div>
      )}

      {request.status === 'approved' && (
        <div className="text-sm text-green-600 font-medium">Approved</div>
      )}

      {request.status === 'rejected' && (
        <div className="text-sm text-red-600 font-medium">Rejected</div>
      )}
    </div>
  );
};

export default TeamCard;