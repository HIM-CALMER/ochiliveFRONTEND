import FollowButton from './FollowButton';

function ProfileHeader({ user, relationship, onFollowChange, onShare, onTryComedy }) {
  const name = user?.name || 'Ochi Creator';
  const username = user?.username || 'creator';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const accountLabel = user?.accountType === 'comedian' ? 'Comedian' : user?.tier || 'Creator';
  const statusLabel = relationship?.isMutual ? 'Mutual' : relationship?.isFollowing && relationship?.isFollowedBy ? 'Follow back' : relationship?.isFollowing ? 'Following' : relationship?.isFollowedBy ? 'Follow back' : 'Public profile';
  const statusClasses = relationship?.isMutual
    ? 'border-violet-400/30 bg-violet-500/10 text-violet-200'
    : relationship?.isFollowing || relationship?.isFollowedBy
      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
      : 'border-slate-700 bg-slate-900 text-slate-300';

  return (
    <header className="overflow-hidden rounded-[1.7rem] border border-slate-800 bg-slate-950/80 shadow-[0_24px_70px_rgba(15,23,42,0.38)]">
      <div className="h-28 bg-gradient-to-r from-[#f97316]/25 via-[#8b5cf6]/25 to-[#0f172a]" />
      <div className="px-4 pb-5 pt-0 sm:px-6">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-slate-950 bg-slate-900 text-2xl font-semibold tracking-wide text-rose-200 shadow-[0_18px_44px_rgba(15,23,42,0.45)] sm:h-28 sm:w-28 sm:text-3xl">
              {user?.profilePictureUrl ? <img src={user.profilePictureUrl} alt={`${name} profile`} className="h-full w-full object-cover" /> : <span>{initials}</span>}
              <span className="absolute -bottom-1 -right-1 h-4 w-4 border-4 border-slate-950 bg-emerald-400" aria-label="Online" />
            </div>

            <div className="min-w-0 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{accountLabel}</p>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${statusClasses}`}>
                  {statusLabel}
                </span>
              </div>
              <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-white sm:text-4xl">{name}</h2>
              <p className="mt-1 text-sm text-slate-400">@{username}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FollowButton username={username} relationship={{ ...relationship, accountType: user?.accountType }} onChange={onFollowChange} onTryComedy={onTryComedy} />
            <button type="button" onClick={onShare} className="border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">Share</button>
          </div>
        </div>

        <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">{user?.bio || 'Live creator on Ochi Live.'}</p>
      </div>
    </header>
  );
}

export default ProfileHeader;