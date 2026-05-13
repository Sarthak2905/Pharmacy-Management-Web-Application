import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { login as loginRequest } from '../api/authApi';
import { setCredentials } from '../features/auth/authSlice';

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@pharmacy.local', password: 'Admin@123' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginRequest(form);
      dispatch(setCredentials(response.data));
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to login. Start the backend API and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="grid max-w-5xl gap-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:grid-cols-[1.1fr,0.9fr]">
        <div className="hidden p-10 lg:block">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Pharmacy Management SaaS</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Run billing, stock, and pharmacy reporting from one modern dashboard.</h1>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li>• JWT auth with role-based access for admin, staff, cashier, and manager.</li>
            <li>• Fast medicine search, low-stock tracking, and expiry alerts.</li>
            <li>• SaaS-ready architecture for future multi-store rollout.</li>
          </ul>
        </div>
        <div className="bg-white p-8 text-slate-950">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Use the seeded demo admin to explore the starter dashboard.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium">
              Email
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </label>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
            >
              {isLoading ? 'Signing in...' : 'Login to dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
