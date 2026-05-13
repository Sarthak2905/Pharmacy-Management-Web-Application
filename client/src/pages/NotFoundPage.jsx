import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-slate-300">Return to the dashboard to continue managing the pharmacy workspace.</p>
        <Link className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-950" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
