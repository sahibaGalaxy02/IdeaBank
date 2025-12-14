import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardStudent from './pages/DashboardStudent';
import DashboardMentor from './pages/DashboardMentor';
import DashboardAdmin from './pages/DashboardAdmin';
import SubmitIdea from './pages/SubmitIdea';
import EditIdea from './pages/EditIdea';
import ViewIdea from './pages/ViewIdea';
import Leaderboard from './pages/Leaderboard';
import TeamRequests from './pages/TeamRequests';
import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {(user) => {
                if (user.role === 'student') return <DashboardStudent />;
                if (user.role === 'mentor') return <DashboardMentor />;
                if (user.role === 'admin') return <DashboardAdmin />;
                return <Navigate to="/" />;
              }}
            </ProtectedRoute>
          } />
          <Route path="/student/submit" element={<ProtectedRoute roles={['student']}><SubmitIdea /></ProtectedRoute>} />
          <Route path="/idea/:id/edit" element={<ProtectedRoute roles={['student']}><EditIdea /></ProtectedRoute>} />
          <Route path="/view-idea/:id" element={<ProtectedRoute><ViewIdea /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/team-requests/:ideaId" element={<ProtectedRoute roles={['student']}><TeamRequests /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;