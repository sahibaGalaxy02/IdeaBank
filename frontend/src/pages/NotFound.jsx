import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          404
        </h1>
        <p className="text-2xl text-gray-600 mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          data-testid="go-home-button"
        >
          <Home size={20} />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
