import FollowButton from './FollowButton';

function ProfileHeader({ user, relationship, onFollowChange }) {
  const name = user?.name || 'Ochi Creator';
  const username = user?.username || 'creator';
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center border border-ochi-accent/40 bg-ochi-accent-10 text-2xl font-semibold tracking-wide text-rose-200 sm:h-32 sm:w-32 sm:text-3xl">
        {user?.profilePictureUrl ? <img src={user.profilePictureUrl} alt={`${name} profile`} className="h-full w-full object-cover" /> : <span>{initials}</span>}
        <span className="absolute -bottom-2 -right-2 h-4 w-4 border-4 border-slate-950 bg-emerald-400" aria-label="Online" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{user.tier || 'Creator'}</p>
        <h2 className="mt-2 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl">{name}</h2>
        <p className="mt-1 text-sm text-slate-400">@{username}</p>
        <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300">{user?.bio || 'Live creator on Ochi Live.'}</p>
        <div className="mt-5"><FollowButton username={username} relationship={relationship} onChange={onFollowChange} /></div>
      </div>
    </header>
  );
}

export default ProfileHeader;