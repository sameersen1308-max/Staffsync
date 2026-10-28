import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const links = [
    ['/', 'Dashboard'],
    ...(user.role !== 'employee' ? [['/employees', 'Employees']] : []),
    ['/leaves', 'Leaves'], ['/attendance', 'Attendance'],
    ['/announcements', 'Announcements'], ['/training', 'Training']
  ];
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">StaffSync</span>
          <div className="navbar-nav me-auto flex-row flex-wrap gap-2">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className="nav-link px-2">{label}</NavLink>
            ))}
          </div>
          <span className="text-white me-3 small">{user.name} <span className="badge bg-light text-primary">{user.role}</span></span>
          <button className="btn btn-sm btn-outline-light" onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </div>
      </nav>
      <main className="container py-4">{children}</main>
    </>
  );
}
