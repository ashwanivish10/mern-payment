import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const token = localStorage.getItem("token");

  return (
    // This div uses Tailwind classes for the background color.
    // If you see a light gray background, it means Tailwind is working!
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={!token ? <Auth /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;