import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { updateProfile } from '../api/dashboardApi';

const sections = [
  {
    id: 'account',
    label: 'Account',
    description: 'Your identity, bio, and public presence.',
    accent: 'from-sky-500/25 via-sky-500/10 to-transparent',
    icon: 'user',
    controls: [
      { key: 'publicProfile', label: 'Public profile', description: 'Allow people to discover your page in search', enabled: true },
      { key: 'showEmail', label: 'Show email on profile', description: 'Display contact email publicly', enabled: false },
      { key: 'username', label: 'Username', description: '@creator', action: 'Edit' },
      { key: 'bio', label: 'Bio', description: 'Live creator on Ochi Live', action: 'Edit' },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Manage who can view and interact with your content.',
    accent: 'from-violet-500/25 via-violet-500/10 to-transparent',
    icon: 'shield',
    controls: [
      { key: 'privateMode', label: 'Private mode', description: 'Only approved followers can view your page', enabled: false },
      { key: 'hideLikes', label: 'Hide likes', description: 'Keep engagement metrics private', enabled: true },
      { key: 'restrictDms', label: 'Restrict DMs', description: 'Only followers can message you', enabled: true },
      { key: 'commentFilter', label: 'Comment filter', description: 'Filter spammy or offensive language', enabled: true },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Password protection and account access controls.',
    accent: 'from-emerald-500/25 via-emerald-500/10 to-transparent',
    icon: 'lock',
    controls: [
      { key: 'twoFactor', label: 'Two-factor auth', description: 'Required for sensitive account changes', enabled: true },
      { key: 'password', label: 'Password', description: 'Last changed 2 months ago', action: 'Update' },
      { key: 'sessions', label: 'Active sessions', description: '4 devices currently signed in', action: 'Review' },
      { key: 'backup', label: 'Backup codes', description: 'Used for account recovery', action: 'View' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Control push, email, and creator alerts.',
    accent: 'from-amber-500/25 via-amber-500/10 to-transparent',
    icon: 'bell',
    controls: [
      { key: 'pushAlerts', label: 'Push alerts', description: 'New followers and live reminders', enabled: true },
      { key: 'emailDigest', label: 'Email digest', description: 'Weekly performance digest', enabled: true },
      { key: 'mentions', label: 'Mentions', description: 'When people tag or reply to you', enabled: true },
      { key: 'creatorAlerts', label: 'Creator alerts', description: 'Revenue and audience milestone updates', enabled: true },
    ],
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Theme and interface behavior for your dashboard.',
    accent: 'from-rose-500/25 via-rose-500/10 to-transparent',
    icon: 'sparkles',
    controls: [
      { key: 'darkMode', label: 'Dark mode', description: 'Default app theme', enabled: true },
      { key: 'compactMode', label: 'Compact feed', description: 'Reduce vertical spacing in the dashboard', enabled: false },
      { key: 'highContrast', label: 'High contrast', description: 'Improve readability for long sessions', enabled: false },
      { key: 'language', label: 'Language', description: 'English (default)', action: 'Change' },
    ],
  },
];

const iconMap = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.5-2.7 4-4 7-4s5.5 1.3 7 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3.2 5.5 6v5.2c0 3.6 2 6.9 6.5 9.6 4.5-2.7 6.5-6 6.5-9.6V6L12 3.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9.5 12 1.6 1.6 3.4-3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10V8a3.5 3.5 0 0 1 7 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 3.7-1.5 6-3 6h18c-1.5 0-3-2.3-3-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.8 20a2 2 0 0 1-3.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2.8 13.7 7l4.3 1.7-4.3 1.7L12 15l-1.7-4.6L6 8.7 10.3 7 12 2.8Zm6.5 11.2 1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1 1-2.8ZM5 13.2l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" fill="currentColor" />
    </svg>
  ),
};

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      aria-label="Toggle setting"
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-emerald-500/80 shadow-[0_0_18px_rgba(16,185,129,0.35)]' : 'bg-slate-700'}`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('account');
  const [settings, setSettings] = useState({
    publicProfile: true,
    showEmail: false,
    privateMode: false,
    hideLikes: true,
    restrictDms: true,
    commentFilter: true,
    twoFactor: true,
    pushAlerts: true,
    emailDigest: true,
    mentions: true,
    creatorAlerts: true,
    darkMode: true,
    compactMode: false,
    highContrast: false,
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
      return {
        name: user?.name || 'Ochi Creator',
        username: user?.username || 'creator',
        bio: user?.bio || 'Live creator on Ochi Live',
      };
    } catch {
      return { name: 'Ochi Creator', username: 'creator', bio: 'Live creator on Ochi Live' };
    }
  });

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedId) || sections[0],
    [selectedId],
  );

  const handleToggle = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
    setSaveMessage('Changes saved locally');
    window.clearTimeout(handleToggle.timeoutId);
    handleToggle.timeoutId = window.setTimeout(() => setSaveMessage(''), 1800);
  };

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile({
        name: profileForm.name,
        username: profileForm.username,
        bio: profileForm.bio,
      });

      const nextUser = {
        ...(JSON.parse(sessionStorage.getItem('ochi_user') || '{}')),
        ...(result?.user || {}),
      };

      sessionStorage.setItem('ochi_user', JSON.stringify(nextUser));
      setSaveMessage('Profile updated successfully');
      setEditingProfile(false);
      window.clearTimeout(handleSaveProfile.timeoutId);
      handleSaveProfile.timeoutId = window.setTimeout(() => setSaveMessage(''), 2200);
    } catch (error) {
      setSaveMessage(error?.response?.data?.message || 'Unable to update profile');
      window.clearTimeout(handleSaveProfile.timeoutId);
      handleSaveProfile.timeoutId = window.setTimeout(() => setSaveMessage(''), 2200);
    }
  };

  const handleSaveAll = async () => {
    if (selectedId === 'account') {
      await handleSaveProfile();
      return;
    }

    setSaveMessage('Profile settings saved');
    window.clearTimeout(handleSaveAll.timeoutId);
    handleSaveAll.timeoutId = window.setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('ochi_token');
    sessionStorage.removeItem('ochi_user');
    navigate('/login', { replace: true });
  };

  return (
    <DashboardShell title="Settings" subtitle="Manage your creator profile and account controls" showBack backFallback="/profile">
      <div className="bg-slate-950/40 p-0 sm:p-2">
        {saveMessage ? (
          <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {saveMessage}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.6fr]">
          <div className="space-y-3">
            {sections.map((section) => {
              const isActive = selectedId === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setSelectedId(section.id)}
                  className={`w-full border-b border-slate-800/80 p-3 text-left transition ${
                    isActive
                      ? 'bg-slate-900/80 text-white'
                      : 'bg-transparent hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${section.accent} text-slate-100`}>
                      {iconMap[section.icon]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white">{section.label}</p>
                        <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">{section.controls.length}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{section.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-900/50 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${selectedSection.accent} text-slate-100`}>
                  {iconMap[selectedSection.icon]}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Section</p>
                  <h3 className="text-lg font-semibold text-white">{selectedSection.label}</h3>
                </div>
              </div>
              <button type="button" onClick={handleSaveAll} className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-slate-300 transition hover:border-slate-500 hover:text-white">
                Save
              </button>
            </div>

            <div className="space-y-3">
              {selectedSection.controls.map((control) => {
                const isToggle = typeof control.enabled === 'boolean';

                return (
                  <div key={control.key} className="border-b border-slate-800/80 bg-slate-950/30 p-3 last:border-b-0 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">{control.label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{control.description}</p>
                      </div>

                      {isToggle ? (
                        <Toggle enabled={settings[control.key]} onToggle={() => handleToggle(control.key)} />
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (control.key === 'username' || control.key === 'bio' || control.key === 'password') {
                              setEditingProfile(true);
                            }
                          }}
                          className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-slate-200 transition hover:border-slate-500 hover:text-white"
                        >
                          {control.action}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-400/60 hover:bg-rose-500/15"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingProfile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-slate-700 bg-slate-950 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.8)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Profile identity</p>
                <h3 className="mt-1 text-xl font-semibold text-white">Edit public profile</h3>
              </div>
              <button type="button" onClick={() => setEditingProfile(false)} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-[0.18em] text-slate-500">
                Name
                <input
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500"
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.18em] text-slate-500">
                Username
                <input
                  value={profileForm.username}
                  onChange={(event) => setProfileForm((current) => ({ ...current, username: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500"
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.18em] text-slate-500">
                Bio
                <textarea
                  value={profileForm.bio}
                  onChange={(event) => setProfileForm((current) => ({ ...current, bio: event.target.value }))}
                  rows={4}
                  maxLength={160}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500"
                />
                <span className="mt-1 block text-right text-[10px] uppercase tracking-[0.14em] text-slate-500">{profileForm.bio.length}/160</span>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button type="button" onClick={() => setEditingProfile(false)} className="rounded-full border border-slate-700 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-300 hover:border-slate-500 hover:text-white">
                Cancel
              </button>
              <button type="button" onClick={handleSaveProfile} className="rounded-full border border-sky-500/40 bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200 transition hover:bg-sky-500/20">
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}

export default SettingsPage;
