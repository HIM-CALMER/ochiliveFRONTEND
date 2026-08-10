import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { getProfileSummary, getProfilePosts, getProfileReshares } from '../api/dashboardApi';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsBar from '../components/profile/StatsBar';
import TabsSection from '../components/profile/TabsSection';
import WalletLink from '../components/profile/WalletLink';
import ContentGrid from '../components/profile/ContentGrid';
import ProfileEditor from '../components/profile/ProfileEditor';
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
    getProfileSummary(routeUsername)
      .then((data) => {
        setProfileError('');
        setProfile({
          ...fallbackProfile,
          ...data,
          user: { ...fallbackProfile.user, ...data?.user },
          stats: { ...fallbackProfile.stats, ...data?.stats },
        });
      })
      .catch(() => setProfileError('Profile details are unavailable.'))
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
    setProfile((current) => ({ ...current, stats: result.stats, relationship: result.relationship }));
  };

  const handleProfileSaved = (result) => {
    setProfile((current) => ({ ...current, ...result }));
    if (result.user) sessionStorage.setItem('ochi_user', JSON.stringify(result.user));
  };

  const handleComedyComplete = (result) => {
    setProfile((current) => ({ ...current, ...result, user: { ...current.user, ...result.user, accountType: 'comedian' }, relationship: { ...current.relationship, ...result.relationship } }));
    if (result.user) sessionStorage.setItem('ochi_user', JSON.stringify(result.user));
    setShowComedyOnboarding(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: profile.user.name, text: `View @${profile.user.username} on Ochi Live`, url });
    else await navigator.clipboard?.writeText(url);
  };

  const handleStatSelect = (stat) => {
    if (stat === 'posts') setActiveTab('posts');
  };

  return (
    <DashboardShell
      title="Profile"
      subtitle="Your presence on Ochi Live"
    >
      {loading ? (
        <div className="border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading profile details...</div>
      ) : profileError ? (
        <div className="border border-rose-500/20 bg-slate-950 p-8"><p className="text-sm text-rose-300">{profileError}</p><button type="button" onClick={() => window.location.reload()} className="mt-4 border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900">Retry</button></div>
      ) : (
        <div className="border border-slate-800 bg-slate-950">
          <div className="flex justify-end border-b border-slate-800 px-4 py-3 sm:px-8">
            <WalletLink />
          </div>
          <div className="px-4 pb-8 pt-7 sm:px-8 sm:pt-10">
            <ProfileHeader user={profile.user} relationship={profile.relationship} onFollowChange={handleFollowChange} onShare={handleShare} onTryComedy={() => setShowComedyOnboarding(true)} />
            {profile.relationship?.isOwnProfile ? <ProfileEditor profile={profile.user} onSaved={handleProfileSaved} /> : null}
            <StatsBar stats={profile.stats} onSelect={handleStatSelect} />
            <TabsSection activeTab={activeTab} onChange={setActiveTab} />
            {activeTab === 'about' ? <div className="border-t border-slate-800 py-8"><p className="text-sm leading-7 text-slate-300">{profile.user.bio || 'No bio added yet.'}</p><p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">@{profile.user.username}</p></div> : contentLoading ? <div className="border-t border-slate-800 py-12 text-center text-sm text-slate-500">Loading {activeTab}...</div> : contentError ? <div className="border-t border-slate-800 py-12 text-center"><p className="text-sm text-rose-300">{contentError}</p><button type="button" onClick={() => { setContentError(''); setContentRequestKey((key) => key + 1); }} className="mt-4 text-sm text-slate-300 underline">Retry</button></div> : <ContentGrid items={content[activeTab]} tab={activeTab} isOwnProfile={profile.relationship?.isOwnProfile} />}
          </div>
        </div>
      )}
      {showComedyOnboarding ? <ComedyOnboarding onComplete={handleComedyComplete} onClose={() => setShowComedyOnboarding(false)} /> : null}
    </DashboardShell>
  );
}

export default ProfilePage;


