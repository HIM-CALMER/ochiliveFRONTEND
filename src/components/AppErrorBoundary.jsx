import { Component } from 'react';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
          <section className="w-full max-w-md border border-rose-500/30 bg-slate-900 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-300">Ochi Live error</p>
            <h1 className="mt-3 text-xl font-semibold text-white">This screen could not load.</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Refresh the page to try again. If the problem continues, check the browser console for the component error.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Refresh page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;