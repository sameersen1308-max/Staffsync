import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

const t = (x) => (x ? new Date(x).toLocaleTimeString() : '-');

export default function Attendance() {
  const { user } = useAuth();
  const staff = user.role !== 'employee';
  const [mine, setMine] = useState([]);
  const [all, setAll] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [msg, setMsg] = useState('');

  const load = () => {
    api.get('/attendance/my').then(r => setMine(r.data));
    if (staff) api.get('/attendance', { params: { date } }).then(r => setAll(r.data));
  };
  useEffect(() => { load(); }, [date]);

  const act = async (fn) => {
    setMsg('');
    try { await fn(); load(); } catch (x) { setMsg(errMsg(x)); }
  };
  return (
    <>
      <h4>Attendance</h4>
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={() => act(() => api.post('/attendance/checkin'))}>Check in</button>
        <button className="btn btn-outline-danger" onClick={() => act(() => api.put('/attendance/checkout'))}>Check out</button>
        {msg && <span className="text-danger ms-3">{msg}</span>}
      </div>
      <h5>My records</h5>
      <table className="table mb-4"><thead><tr><th>Date</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
        <tbody>{mine.map(a => <tr key={a._id}><td>{a.date}</td><td>{t(a.checkIn)}</td><td>{t(a.checkOut)}</td><td>{a.status}</td></tr>)}</tbody></table>
      {staff && (<>
        <div className="d-flex align-items-center gap-3 mb-2"><h5 className="mb-0">Team attendance</h5>
          <input type="date" className="form-control w-auto" value={date} onChange={e => setDate(e.target.value)} /></div>
        <table className="table"><thead><tr><th>Employee</th><th>Dept</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
          <tbody>{all.map(a => <tr key={a._id}><td>{a.employee?.name}</td><td>{a.employee?.department}</td><td>{t(a.checkIn)}</td><td>{t(a.checkOut)}</td><td>{a.status}</td></tr>)}</tbody></table>
      </>)}
    </>
  );
}
