import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Training from './pages/Training';

function Private({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/employees" element={<Private roles={['admin', 'manager']}><Employees /></Private>} />
      <Route path="/leaves" element={<Private><Leaves /></Private>} />
      <Route path="/attendance" element={<Private><Attendance /></Private>} />
      <Route path="/announcements" element={<Private><Announcements /></Private>} />
      <Route path="/training" element={<Private><Training /></Private>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
