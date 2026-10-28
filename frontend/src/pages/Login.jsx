import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { login, register } = useAuth();
  const [isReg, setIsReg] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try { isReg ? await register(f.name, f.email, f.password) : await login(f.email, f.password); }
    catch (x) { setErr(errMsg(x)); }
  };
  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <div className="card shadow-sm"><div className="card-body p-4">
        <h3 className="text-primary fw-bold">StaffSync</h3>
        <p className="text-muted">{isReg ? 'Create an account' : 'Sign in to continue'}</p>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <form onSubmit={submit}>
          {isReg && <input className="form-control mb-3" placeholder="Full name" value={f.name} onChange={set('name')} required />}
          <input className="form-control mb-3" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
          <input className="form-control mb-3" type="password" placeholder="Password (min 6)" value={f.password} onChange={set('password')} required minLength={6} />
          <button className="btn btn-primary w-100">{isReg ? 'Register' : 'Login'}</button>
        </form>
        <button className="btn btn-link w-100 mt-2" onClick={() => setIsReg(!isReg)}>
          {isReg ? 'Have an account? Login' : 'New here? Register'}
        </button>
      </div></div>
    </div>
  );
}
