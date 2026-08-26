import { followProfile, unfollowProfile } from '../../api/dashboardApi';
import { useState, useEffect } from 'react';

function FollowButton({ username, relationship, onChange, onTryComedy }) {
  const [state, setState] = useState({
    isFollowing: Boolean(relationship?.isFollowing),
    isFollowedBy: Boolean(relationship?.isFollowedBy),
    isMutual: Boolean(relationship?.isMutual),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setState({
      isFollowing: Boolean(relationship?.isFollowing),
      isFollowedBy: Boolean(relationship?.isFollowedBy),
      isMutual: Boolean(relationship?.isMutual),
    });
  }, [relationship?.isFollowing, relationship?.isFollowedBy, relationship?.isMutual]);

  if (relationship?.isOwnProfile) {
    if (relationship?.accountType === 'comedian') return <span className="border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300">Comedian profile</span>;
    return <button type="button" onClick={onTryComedy} className="border border-ochi-accent bg-ochi-accent px-7 py-2.5 text-sm font-semibold text-white">Try Comedy</button>;
  }

  const label = state.isMutual ? 'Following' : state.isFollowedBy ? 'Follow back' : state.isFollowing ? 'Following' : 'Follow';
  const buttonClasses = state.isMutual || state.isFollowing
    ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-ochi-accent/50'
    : state.isFollowedBy
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400/50'
      : 'border-ochi-accent bg-ochi-accent text-white hover:bg-ochi-accent/80';

  const toggle = async () => {
    setLoading(true);
    try {
      const result = state.isFollowing ? await unfollowProfile(username) : await followProfile(username);
      const nextRelationship = result?.relationship || {};
      const nextState = {
        isFollowing: Boolean(nextRelationship.isFollowing),
        isFollowedBy: Boolean(nextRelationship.isFollowedBy),
        isMutual: Boolean(nextRelationship.isMutual),
      };
      setState(nextState);
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
      className={`border px-7 py-2.5 text-sm font-semibold transition-colors ${buttonClasses}`}
      aria-pressed={state.isFollowing || state.isMutual}
    >
      {loading ? 'Updating...' : label}
    </button>
  );
}

export default FollowButton;