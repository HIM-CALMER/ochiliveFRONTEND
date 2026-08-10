import { followProfile, unfollowProfile } from '../../api/dashboardApi';
import { useState } from 'react';

function FollowButton({ username, relationship, onChange, onTryComedy }) {
  const [following, setFollowing] = useState(Boolean(relationship?.isFollowing));
  const [loading, setLoading] = useState(false);

  if (relationship?.isOwnProfile) {
    if (relationship?.accountType === 'comedian') return <span className="border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300">Comedian profile</span>;
    return <button type="button" onClick={onTryComedy} className="border border-ochi-accent bg-ochi-accent px-7 py-2.5 text-sm font-semibold text-white">Try Comedy</button>;
  }

  const toggle = async () => {
    setLoading(true);
    try {
      const result = following ? await unfollowProfile(username) : await followProfile(username);
      setFollowing(Boolean(result.relationship?.isFollowing));
      onChange?.(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`border px-7 py-2.5 text-sm font-semibold transition-colors ${following ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-ochi-accent/50' : 'border-ochi-accent bg-ochi-accent text-white hover:bg-ochi-accent/80'}`}
      aria-pressed={following}
    >
      {loading ? 'Updating...' : following ? 'Following' : 'Follow'}
    </button>
  );
}

export default FollowButton;