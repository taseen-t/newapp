import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Spinner } from './components/ui.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Study from './pages/Study.jsx';
import DeckStudy from './pages/DeckStudy.jsx';
import Chat from './pages/Chat.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Milestones from './pages/Milestones.jsx';
import Questions from './pages/Questions.jsx';
import QuestionDetail from './pages/QuestionDetail.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (!user) return <Login />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/study" element={<Study />} />
        <Route path="/study/deck/:id" element={<DeckStudy />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
