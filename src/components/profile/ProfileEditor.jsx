import { useState } from 'react';
import { updateProfile, updateProfilePicture } from '../../api/dashboardApi';

export default function ProfileEditor({ profile, onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: profile.name || '',
    username: profile.username || '',
    bio: profile.bio || '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const result = await updateProfile(form);
      onSaved(result);
      setMessage('Profile updated.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePicture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setMessage('');
    try {
      const result = await updateProfilePicture(file);
      onSaved(result);
      setMessage('Profile picture updated.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to update your profile picture.');
    } finally {
      setSaving(false);
      event.target.value = '';
    }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900">
        Edit profile
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <form onSubmit={handleSubmit} className="w-full max-w-lg border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Account identity</p><h2 id="edit-profile-title" className="mt-1 text-xl font-semibold text-white">Edit profile</h2></div>
          <button type="button" onClick={() => setOpen(false)} className="text-slate-500 hover:text-white" aria-label="Close editor">X</button>
        </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none focus:border-ochi-accent" />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Username
          <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="mt-2 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none focus:border-ochi-accent" />
        </label>
      </div>
      <label className="mt-4 block text-xs uppercase tracking-[0.18em] text-slate-500">
        Bio
        <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} maxLength={160} rows={3} className="mt-2 w-full resize-none border border-slate-700 bg-slate-900 px-3 py-2 text-sm normal-case tracking-normal text-white outline-none focus:border-ochi-accent" />
      </label>
      <p className="mt-2 text-right text-xs text-slate-500">{form.bio.length}/160</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900">
          Change picture
          <input type="file" accept="image/*" onChange={handlePicture} className="sr-only" />
        </label>
        <button type="submit" disabled={saving} className="border border-ochi-accent bg-ochi-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? 'Saving...' : 'Save profile'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
        {message ? <span className="text-sm text-slate-400">{message}</span> : null}
      </div>
      </form>
    </div>
  );
}
