import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

export default function Announcements() {
  const { user } = useAuth();
  const staff = user.role !== 'employee';
  const [list, setList] = useState([]);
  const [f, setF] = useState({ title: '', message: '' });
  const [err, setErr] = useState('');
  const load = () => api.get('/announcements').then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const post = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/announcements', f); setF({ title: '', message: '' }); load(); } catch (x) { setErr(errMsg(x)); }
  };
  const del = async (id) => { await api.delete(`/announcements/${id}`); load(); };

  return (
    <>
      <h4>Announcements</h4>
      {staff && (
        <form onSubmit={post} className="card card-body mb-4">
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <input className="form-control mb-2" placeholder="Title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required />
          <textarea className="form-control mb-2" rows={3} placeholder="Message" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} required />
          <div><button className="btn btn-primary">Post</button></div>
        </form>
      )}
      {list.map(a => (
        <div key={a._id} className="card mb-2"><div className="card-body">
          <div className="d-flex justify-content-between"><h6>{a.title}</h6>
            {staff && <button className="btn btn-sm btn-outline-danger" onClick={() => del(a._id)}>Delete</button>}</div>
          <div>{a.message}</div>
          <small className="text-muted">{a.postedBy?.name} · {new Date(a.createdAt).toLocaleString()}</small>
        </div></div>
      ))}
    </>
  );
}
