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
      relationship: { isOwnProfile: true, isFollowing: false },
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
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    getProfileSummary(routeUsername)
      .then((data) => {
        setProfile({
          ...fallbackProfile,
          ...data,
          user: { ...fallbackProfile.user, ...data?.user },
          stats: { ...fallbackProfile.stats, ...data?.stats },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [routeUsername]);

  useEffect(() => {
    const username = profile.user?.username;
    if (!username) return;
    setContentLoading(true);
    const request = activeTab === 'posts' ? getProfilePosts(username) : getProfileReshares(username);
    request.then((items) => setContent((current) => ({ ...current, [activeTab]: items }))).catch(() => setContent((current) => ({ ...current, [activeTab]: [] }))).finally(() => setContentLoading(false));
  }, [activeTab, profile.user?.username]);

  const handleFollowChange = (result) => {
    setProfile((current) => ({ ...current, stats: result.stats, relationship: result.relationship }));
  };

  const handleProfileSaved = (result) => {
    setProfile((current) => ({ ...current, ...result }));
    if (result.user) sessionStorage.setItem('ochi_user', JSON.stringify(result.user));
  };

  return (
    <DashboardShell
      title="Profile"
      subtitle="Your presence on Ochi Live"
    >
      {loading ? (
        <div className="border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading profile details...</div>
      ) : (
        <div className="border border-slate-800 bg-slate-950">
          <div className="flex justify-end border-b border-slate-800 px-4 py-3 sm:px-8">
            <WalletLink />
          </div>
          <div className="px-4 pb-8 pt-7 sm:px-8 sm:pt-10">
            <ProfileHeader user={profile.user} relationship={profile.relationship} onFollowChange={handleFollowChange} />
            {profile.relationship?.isOwnProfile ? <ProfileEditor profile={profile.user} onSaved={handleProfileSaved} /> : null}
            <StatsBar stats={profile.stats} />
            <TabsSection activeTab={activeTab} onChange={setActiveTab} />
            {contentLoading ? <div className="border-t border-slate-800 py-12 text-center text-sm text-slate-500">Loading {activeTab}...</div> : <ContentGrid items={content[activeTab]} tab={activeTab} />}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default ProfilePage;


