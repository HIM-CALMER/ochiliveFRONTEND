import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { getProfileSummary, getProfilePosts, getProfileReshares } from '../api/dashboardApi';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsBar from '../components/profile/StatsBar';
import TabsSection from '../components/profile/TabsSection';
import ContentGrid from '../components/profile/ContentGrid';
import ComedyOnboarding from '../components/profile/ComedyOnboarding';

const fallbackProfile = {
  user: {
    id: 'user_demo',
    name: 'Ochi Creator',
    username: 'creator',
    bio: 'Live creator on Ochi Live.',
    tier: 'Creator Pro',
  },
  stats: {
    followers: 0,
    following: 0,
  },
};

const getSessionProfile = () => {
  try {
    const sessionUser = JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
    if (!sessionUser) return fallbackProfile;

    return {
      ...fallbackProfile,
      user: {
        ...fallbackProfile.user,
        ...sessionUser,
        username: sessionUser.username || sessionUser.email?.split('@')[0] || fallbackProfile.user.username,
      },
      relationship: { isOwnProfile: true, isFollowing: false, accountType: sessionUser.accountType || 'creator' },
    };
  } catch {
    return fallbackProfile;
  }
};

function ProfilePage() {
  const { username: routeUsername } = useParams();
  const [profile, setProfile] = useState(() => getSessionProfile());
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({ posts: [], reshared: [] });
  const [contentLoading, setContentLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [contentError, setContentError] = useState('');
  const [contentRequestKey, setContentRequestKey] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');
  const [showComedyOnboarding, setShowComedyOnboarding] = useState(false);

  useEffect(() => {
    const sessionUser = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
      } catch {
        return null;
      }
    })();

    const rawSessionUsername = sessionUser?.username || sessionUser?.email?.split('@')[0] || '';
    const normalizedRouteUsername = String(routeUsername || '').trim();
    const isOwnProfile = !normalizedRouteUsername || normalizedRouteUsername.toLowerCase() === String(rawSessionUsername || '').toLowerCase();
    const targetUsername = normalizedRouteUsername || rawSessionUsername || 'creator';

    getProfileSummary(targetUsername)
      .then((data) => {
        const normalized = data && typeof data === 'object' ? data : {};
        const normalizedUser = {
          ...fallbackProfile.user,
          ...(sessionUser || {}),
          ...normalized.user,
          username: normalized.user?.username || targetUsername,
        };
        setProfileError('');
        setProfile({
          ...fallbackProfile,
          ...normalized,
          user: normalizedUser,
          stats: { ...fallbackProfile.stats, ...normalized.stats },
          relationship: {
            isOwnProfile,
            isFollowing: Boolean(normalized.relationship?.isFollowing),
            accountType: sessionUser?.accountType || normalized.user?.accountType || normalizedUser.accountType || 'creator',
          },
        });
      })
      .catch(() => {
        const fallbackUser = getSessionProfile().user;
        const fallbackOwnerState = !normalizedRouteUsername || normalizedRouteUsername.toLowerCase() === String((sessionUser?.username || sessionUser?.email?.split('@')[0] || '')).toLowerCase();
        setProfile({
          ...fallbackProfile,
          user: { ...fallbackUser, username: targetUsername },
          stats: { ...fallbackProfile.stats, followers: 0, following: 0, posts: 0 },
          relationship: { isOwnProfile: fallbackOwnerState, isFollowing: false, accountType: fallbackUser.accountType || 'creator' },
        });
        setProfileError(`@${targetUsername} has not published a profile yet. Their page will appear here once they add their first bio, clips, or live setup.`);
      })
      .finally(() => setLoading(false));
  }, [routeUsername]);

  useEffect(() => {
    const username = profile.user?.username;
    if (!username) return;
    setContentLoading(true);
    setContentError('');
    const request = activeTab === 'posts' ? getProfilePosts(username) : getProfileReshares(username);
    request.then((items) => {
      setContent((current) => ({ ...current, [activeTab]: items }));
      if (activeTab === 'posts') setProfile((current) => ({ ...current, stats: { ...current.stats, posts: items.length } }));
    }).catch(() => { setContentError('We could not load this content.'); setContent((current) => ({ ...current, [activeTab]: [] })); }).finally(() => setContentLoading(false));
  }, [activeTab, profile.user?.username, contentRequestKey]);

  const handleFollowChange = (result) => {
    setProfile((current) => ({
      ...current,
      stats: { ...current.stats, ...result?.stats },
      relationship: { ...current.relationship, ...result?.relationship },
      user: { ...current.user, ...result?.user },
    }));
  };

  const handleComedyComplete = (result) => {
    setProfile((current) => ({ ...current, ...result, user: { ...current.user, ...result.user, accountType: 'comedian' }, relationship: { ...current.relationship, ...result.relationship } }));
    if (result.user) sessionStorage.setItem('ochi_user', JSON.stringify(result.user));
    setShowComedyOnboarding(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const safeName = profile?.user?.name || 'Ochi Creator';
    const safeUsername = profile?.user?.username || 'creator';
    if (navigator.share) await navigator.share({ title: safeName, text: `View @${safeUsername} on Ochi Live`, url });
    else await navigator.clipboard?.writeText(url);
  };

  const handleStatSelect = (stat) => {
    if (stat === 'posts') {
      setActiveTab('posts');
      return;
    }

    if (stat === 'followers' || stat === 'following') {
      setActiveTab('about');
      return;
    }

    setActiveTab('posts');
  };

  return (
    <DashboardShell
      title="Profile"
      subtitle="Your presence on Ochi Live"
    >
      {loading ? (
        <div className="border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading profile details...</div>
      ) : (
        <div className="bg-slate-950/20">
          <div className="px-4 pb-8 pt-7 sm:px-8 sm:pt-10">
            {profileError ? (
              <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-400">
                {profileError}
              </div>
            ) : null}
            <ProfileHeader user={profile.user} relationship={profile.relationship} onFollowChange={handleFollowChange} onShare={handleShare} onTryComedy={() => setShowComedyOnboarding(true)} />
            <StatsBar stats={profile.stats} onSelect={handleStatSelect} />
            <TabsSection activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === 'about' ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Bio</p>
                  <p className="mt-4 text-base leading-7 text-slate-200">{profile.user.bio || 'No bio added yet.'}</p>
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Handle</p>
                    <p className="mt-2 text-lg font-medium text-white">@{profile.user.username}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Profile status</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                      <span>Account type</span>
                      <span className="font-medium text-white">{profile.user.accountType || 'creator'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                      <span>Followers</span>
                      <span className="font-medium text-white">{profile.stats.followers?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                      <span>Following</span>
                      <span className="font-medium text-white">{profile.stats.following?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : contentLoading ? <div className="border-t border-slate-800 py-12 text-center text-sm text-slate-500">Loading {activeTab}...</div> : contentError ? <div className="border-t border-slate-800 py-12 text-center"><p className="text-sm text-rose-300">{contentError}</p><button type="button" onClick={() => { setContentError(''); setContentRequestKey((key) => key + 1); }} className="mt-4 text-sm text-slate-300 underline">Retry</button></div> : <ContentGrid items={content[activeTab]} tab={activeTab} isOwnProfile={profile.relationship?.isOwnProfile} />}
          </div>
        </div>
      )}
      {showComedyOnboarding ? <ComedyOnboarding onComplete={handleComedyComplete} onClose={() => setShowComedyOnboarding(false)} /> : null}
    </DashboardShell>
  );
}

export default ProfilePage;


