import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { getProfileSummary } from '../api/dashboardApi';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileSummary()
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell
      title="Your creator profile"
      subtitle="Review your performance, edit your presence, and keep your brand polished on every broadcast."
    >
      {loading ? (
        <div className="rounded-2xl bg-slate-900/95 p-8 text-slate-400">Loading profile details...</div>
      ) : (
        <div className="rounded-2xl bg-slate-900/95 p-6">
          <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl bg-slate-950/95 p-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 text-2xl font-semibold text-rose-300">{profile.user.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{profile.user.tier}</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{profile.user.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{profile.user.bio}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Followers', value: profile.stats.followers.toLocaleString() },
                  { label: 'Streams', value: profile.stats.streams },
                  { label: 'Engagement', value: profile.stats.engagement },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-950/95 p-5">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950/95 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Account details</p>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-900/95 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Username</p>
                  <p className="mt-2 font-semibold text-white">@{profile.user.username}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/95 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Member since</p>
                  <p className="mt-2 font-semibold text-white">{profile.user.joinedAt || '2024'}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/95 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                  <p className="mt-2 inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-sm font-semibold text-rose-300">Verified creator</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                <button className="rounded-full bg-rose-500/15 px-5 py-4 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20">
                  Edit profile
                </button>
                <button className="rounded-full bg-slate-900/90 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-900/80">
                  View analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default ProfilePage;


