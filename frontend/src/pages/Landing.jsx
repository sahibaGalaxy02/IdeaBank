import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lightbulb, Users, Award } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">IB</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Idea Bank</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                data-testid="landing-login-button"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                data-testid="landing-register-button"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 
            className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Transform Ideas Into
            <br />
            Innovation Reality
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A collaborative platform for students to submit, review, and develop innovative ideas with mentors and peers.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-lg"
            data-testid="landing-hero-cta"
          >
            <span>Start Your Journey</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Image */}
        <div className="mb-20">
          <img
            src="https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNvbGxhYm9yYXRpb258ZW58MHx8fHwxNzY0MTUwODQ3fDA&ixlib=rb-4.1.0&q=85"
            alt="Students collaborating"
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div 
            className="text-center p-8 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-lg transition-all duration-300" 
            data-testid="feature-card-submit"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Lightbulb size={32} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Ideas</h3>
            <p className="text-gray-600">
              Share your innovative concepts and get valuable feedback from mentors and peers.
            </p>
          </div>

          <div 
            className="text-center p-8 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-lg transition-all duration-300" 
            data-testid="feature-card-collaborate"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users size={32} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborate</h3>
            <p className="text-gray-600">
              Form teams with like-minded students and work together on approved projects.
            </p>
          </div>

          <div 
            className="text-center p-8 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-lg transition-all duration-300" 
            data-testid="feature-card-compete"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Award size={32} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Compete</h3>
            <p className="text-gray-600">
              Showcase your ideas on the leaderboard and gain recognition for excellence.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <h2 
            className="text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Ready to innovate?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join hundreds of students already transforming their ideas into reality.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            data-testid="landing-footer-cta"
          >
            Join Idea Bank Today
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          © 2025 Idea Bank. Empowering student innovation.
        </div>
      </footer>
    </div>
  );
};

export default Landing;