import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';

const empty = { name: '', email: '', role: 'employee', department: '', position: '', phone: '' };

export default function Employees() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [q, setQ] = useState('');
  const [err, setErr] = useState('');

  const load = () => api.get('/employees').then(r => setList(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      editId ? await api.put(`/employees/${editId}`, form) : await api.post('/employees', form);
      setForm(empty); setEditId(null); load();
    } catch (x) { setErr(errMsg(x)); }
  };
  const del = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try { await api.delete(`/employees/${id}`); load(); } catch (x) { alert(errMsg(x)); }
  };
  const shown = list.filter(u => (u.name + u.email + u.department).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <h4>Employees</h4>
      {isAdmin && (
        <form onSubmit={submit} className="card card-body mb-4">
          <h6>{editId ? 'Edit employee' : 'Add employee (default password: Welcome@123)'}</h6>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <div className="row g-2">
            <div className="col-md-3"><input className="form-control" placeholder="Name" value={form.name} onChange={set('name')} required /></div>
            <div className="col-md-3"><input className="form-control" type="email" placeholder="Email" value={form.email} onChange={set('email')} required /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Department" value={form.department} onChange={set('department')} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Position" value={form.position} onChange={set('position')} /></div>
            <div className="col-md-2">
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option>employee</option><option>manager</option><option>admin</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2">{editId ? 'Update' : 'Add'}</button>
            {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      )}
      <input className="form-control mb-3" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="table-responsive"><table className="table table-hover align-middle">
        <thead><tr><th>Name</th><th>Email</th><th>Dept</th><th>Position</th><th>Role</th><th>Leave bal.</th>{isAdmin && <th></th>}</tr></thead>
        <tbody>{shown.map(u => (
          <tr key={u._id}>
            <td>{u.name}</td><td>{u.email}</td><td>{u.department}</td><td>{u.position}</td>
            <td><span className="badge bg-secondary">{u.role}</span></td><td>{u.leaveBalance}</td>
            {isAdmin && <td className="text-end">
              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => { setEditId(u._id); setForm({ name: u.name, email: u.email, role: u.role, department: u.department, position: u.position, phone: u.phone || '' }); window.scrollTo(0, 0); }}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => del(u._id)}>Delete</button>
            </td>}
          </tr>))}</tbody>
      </table></div>
    </>
  );
}
