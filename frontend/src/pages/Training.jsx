import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

const empty = { title: '', description: '', trainer: '', startDate: '', endDate: '' };
const d = (x) => (x ? new Date(x).toLocaleDateString() : '-');

export default function Training() {
  const { user } = useAuth();
  const staff = user.role !== 'employee';
  const [list, setList] = useState([]);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');
  const load = () => api.get('/training').then(r => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/training', f); setF(empty); load(); } catch (x) { setErr(errMsg(x)); }
  };
  const enroll = async (id) => { try { await api.post(`/training/${id}/enroll`); load(); } catch (x) { alert(errMsg(x)); } };
  const del = async (id) => { await api.delete(`/training/${id}`); load(); };

  return (
    <>
      <h4>Training & development</h4>
      {staff && (
        <form onSubmit={create} className="card card-body mb-4">
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" placeholder="Title" value={f.title} onChange={set('title')} required /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Trainer" value={f.trainer} onChange={set('trainer')} /></div>
            <div className="col-md-2"><input type="date" className="form-control" value={f.startDate} onChange={set('startDate')} /></div>
            <div className="col-md-2"><input type="date" className="form-control" value={f.endDate} onChange={set('endDate')} /></div>
            <div className="col-12"><input className="form-control" placeholder="Description" value={f.description} onChange={set('description')} /></div>
          </div>
          <div className="mt-3"><button className="btn btn-primary">Create program</button></div>
        </form>
      )}
      <div className="row g-3">
        {list.map(t => {
          const joined = t.enrolled.includes(user._id);
          return (
            <div key={t._id} className="col-md-6"><div className="card h-100"><div className="card-body">
              <h6>{t.title}</h6>
              <p className="mb-1">{t.description}</p>
              <small className="text-muted d-block">Trainer: {t.trainer || '-'} · {d(t.startDate)} → {d(t.endDate)} · {t.enrolled.length} enrolled</small>
              <div className="mt-2">
                <button className="btn btn-sm btn-success me-2" disabled={joined} onClick={() => enroll(t._id)}>{joined ? 'Enrolled' : 'Enroll'}</button>
                {staff && <button className="btn btn-sm btn-outline-danger" onClick={() => del(t._id)}>Delete</button>}
              </div>
            </div></div></div>
          );
        })}
      </div>
    </>
  );
}
