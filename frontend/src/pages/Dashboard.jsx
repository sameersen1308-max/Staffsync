import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const [ann, setAnn] = useState([]);
  const [stats, setStats] = useState({});
  const staff = user.role !== 'employee';

  useEffect(() => {
    api.get('/auth/me').then(r => setMe(r.data));
    api.get('/announcements').then(r => setAnn(r.data.slice(0, 5)));
    if (staff) Promise.all([api.get('/employees'), api.get('/leaves')]).then(([e, l]) =>
      setStats({ employees: e.data.length, pending: l.data.filter(x => x.status === 'pending').length }));
  }, []);

  const Card = ({ label, value, cls }) => (
    <div className="col-md-4"><div className={`card text-white bg-${cls}`}><div className="card-body">
      <div className="small">{label}</div><div className="fs-2 fw-bold">{value ?? '-'}</div>
    </div></div></div>
  );
  return (
    <>
      <h4 className="mb-3">Welcome, {user.name}</h4>
      <div className="row g-3 mb-4">
        <Card label="Leave balance (days)" value={me?.leaveBalance} cls="success" />
        {staff && <Card label="Total employees" value={stats.employees} cls="primary" />}
        {staff && <Card label="Pending leave requests" value={stats.pending} cls="warning" />}
      </div>
      <h5>Latest announcements</h5>
      {ann.length === 0 && <p className="text-muted">No announcements.</p>}
      {ann.map(a => (
        <div key={a._id} className="card mb-2"><div className="card-body py-2">
          <strong>{a.title}</strong><div>{a.message}</div>
          <small className="text-muted">{a.postedBy?.name} · {new Date(a.createdAt).toLocaleDateString()}</small>
        </div></div>
      ))}
    </>
  );
}
