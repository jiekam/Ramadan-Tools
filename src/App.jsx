import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getData } from './utils/storage';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import DashboardPage from './pages/DashboardPage';
import ProgressPage from './pages/ProgressPage';
import CalendarPage from './pages/CalendarPage';
import SummaryPage from './pages/SummaryPage';
import AITodoPage from './pages/AITodoPage';
import TrackerPage from './pages/TrackerPage';
import ExplorePage from './pages/ExplorePage';
import RamadhanInfoPage from './pages/RamadhanInfoPage';

function ProtectedRoute({ children }) {
  const data = getData();
  if (!data.setupComplete) {
    return <Navigate to="/setup" replace />;
  }
  return children;
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <SummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-todo"
          element={
            <ProtectedRoute>
              <AITodoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <TrackerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ramadhan-info"
          element={
            <ProtectedRoute>
              <RamadhanInfoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
