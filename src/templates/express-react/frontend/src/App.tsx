import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="items"
          element={user ? <Items /> : <Navigate to="/login" replace />}
        />
        <Route
          path="profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
