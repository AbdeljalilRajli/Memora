import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './auth/RequireAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AppPage from './pages/AppPage';
import LandingPageNew from './pages/LandingPageNew';
import SharedNotePage from './pages/SharedNotePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPageNew />} />
        <Route path="/share/:shareId" element={<SharedNotePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
