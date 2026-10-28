import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

const badge = { pending: 'warning', approved: 'success', rejected: 'danger' };
const d = (x) => new Date(x).toLocaleDateString();

export default function Leaves() {
  const { user } = useAuth();
  const staff = user.role !== 'employee';
  const [mine, setMine] = useState([]);
  const [all, setAll] = useState([]);
  const [f, setF] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });
  const [err, setErr] = useState('');

  const load = () => {
    api.get('/leaves/my').then(r => setMine(r.data));
    if (staff) api.get('/leaves').then(r => setAll(r.data));
  };
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const apply = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/leaves', f); setF({ type: 'casual', startDate: '', endDate: '', reason: '' }); load(); }
    catch (x) { setErr(errMsg(x)); }
  };
  const review = async (id, status) => {
    try { await api.put(`/leaves/${id}/status`, { status }); load(); } catch (x) { alert(errMsg(x)); }
  };

  return (
    <>
      <h4>Leave management</h4>
      <form onSubmit={apply} className="card card-body mb-4">
        <h6>Apply for leave</h6>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <div className="row g-2">
          <div className="col-md-2">
            <select className="form-select" value={f.type} onChange={set('type')}>
              <option>casual</option><option>sick</option><option>annual</option><option>unpaid</option>
            </select>
          </div>
          <div className="col-md-2"><input type="date" className="form-control" value={f.startDate} onChange={set('startDate')} required /></div>
          <div className="col-md-2"><input type="date" className="form-control" value={f.endDate} onChange={set('endDate')} required /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Reason" value={f.reason} onChange={set('reason')} /></div>
          <div className="col-md-2"><button className="btn btn-primary w-100">Apply</button></div>
        </div>
      </form>

      <h5>My requests</h5>
      <table className="table mb-4"><thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
        <tbody>{mine.map(l => <tr key={l._id}><td>{l.type}</td><td>{d(l.startDate)}</td><td>{d(l.endDate)}</td><td>{l.days}</td>
          <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td></tr>)}</tbody></table>

      {staff && (<>
        <h5>All requests</h5>
        <table className="table"><thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th></th></tr></thead>
          <tbody>{all.map(l => <tr key={l._id}>
            <td>{l.employee?.name}</td><td>{l.type}</td><td>{d(l.startDate)} – {d(l.endDate)}</td><td>{l.days}</td><td>{l.reason}</td>
            <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td>
            <td>{l.status === 'pending' && <>
              <button className="btn btn-sm btn-success me-1" onClick={() => review(l._id, 'approved')}>Approve</button>
              <button className="btn btn-sm btn-danger" onClick={() => review(l._id, 'rejected')}>Reject</button></>}</td>
          </tr>)}</tbody></table>
      </>)}
    </>
  );
}
