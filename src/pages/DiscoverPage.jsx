import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import SponsoredBanner from '../components/discovery/SponsoredBanner';
import screenLogo from '../assets/animations/screen.png';
import LiveSection from '../components/discovery/LiveSection';
import UpcomingShowsSection from '../components/discovery/UpcomingShowsSection';
import PopularClipsSection from '../components/discovery/PopularClipsSection';
import RecommendedSection from '../components/discovery/RecommendedSection';
import FreshOnTheMicSection from '../components/discovery/FreshOnTheMicSection';
import { getDiscoverItems, searchProfiles, followProfile, unfollowProfile } from '../api/dashboardApi';

const RECENT_SEARCH_KEY = 'ochi_recent_searches';

function DiscoverPage() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('ochi_user') || 'null');
    } catch {
      return null;
    }
  })();
  const currentUsername = String(sessionUser?.username || sessionUser?.email?.split('@')[0] || '').trim().toLowerCase();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    getDiscoverItems().catch(() => {});
  }, []);

  useEffect(() => {
    setSelectedResultIndex(0);
  }, [searchResults.length, searchTerm]);

  useEffect(() => {
    const q = searchTerm.trim();
    if (!q) {
      setSearchResults([]);
      setSearchError('');
      return undefined;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const response = await searchProfiles(q);
        setSearchResults(response.results || []);
      } catch (error) {
        setSearchError('We could not find any profiles matching that search.');
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const saveRecentSearch = (value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return;

    const next = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(next);
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearch = async (event) => {
    if (event) event.preventDefault();
    const q = searchTerm.trim();
    if (!q) {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    saveRecentSearch(q);
    setSearchLoading(true);
    setSearchError('');
    try {
      const response = await searchProfiles(q);
      setSearchResults(response.results || []);
    } catch (error) {
      setSearchError('We could not find any profiles matching that search.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (!searchTerm.trim()) {
      if (event.key === 'ArrowDown' && recentSearches.length) {
        event.preventDefault();
        setSelectedResultIndex(0);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedResultIndex((current) => Math.min(current + 1, Math.max(searchResults.length - 1, 0)));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedResultIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchResults[selectedResultIndex]) {
        const selectedProfile = searchResults[selectedResultIndex];
        saveRecentSearch(selectedProfile.username);
        navigate(`/profile/${selectedProfile.username}`);
        return;
      }
      handleSearch(event);
    }
  };

  const handleFollowToggle = async (profile) => {
    try {
      const result = profile.isFollowing ? await unfollowProfile(profile.username) : await followProfile(profile.username);
      setSearchResults((current) => current.map((item) => (item.username === profile.username ? {
        ...item,
        isFollowing: Boolean(result.relationship?.isFollowing),
        stats: {
          ...item.stats,
          followers: result.stats?.followers ?? item.stats?.followers ?? 0,
        },
      } : item)));
    } catch (error) {
      setSearchError('Unable to update that follow status right now.');
    }
  };

  const placeholder = screenLogo;

  return (
    <>
      <DashboardShell
        title="Discover"
        subtitle="Curated and trending content"
        className="px-0"
        searchValue={searchTerm}
        onSearchChange={handleInputChange}
        onSearchSubmit={handleSearch}
        onSearchKeyDown={handleSearchKeyDown}
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          {searchError ? <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{searchError}</div> : null}

          {!searchLoading && searchTerm.trim() && !searchResults.length ? (
            <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 md:p-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-lg text-slate-200 sm:h-12 sm:w-12 sm:text-xl">⌕</div>
                <div className="min-w-0 flex-1">
                  {currentUsername && searchTerm.trim().toLowerCase() === currentUsername ? (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs">Your profile</p>
                      <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">This matches your own profile.</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Search excludes your own account in discovery, so view your profile directly from here.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="mt-4 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-slate-500 hover:text-white"
                      >
                        Go to my profile
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs">No creator found</p>
                      <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">No results for “{searchTerm.trim()}”</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Try a username, full name, or a broader keyword. Profiles are shown only when the creator is already registered on Ochi Live.
                      </p>
                    </>
                  )}
                  {recentSearches.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {recentSearches.slice(0, 4).map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchTerm(term)}
                          className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:text-white"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

        {searchResults.length ? (
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">Creator results</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{searchResults.length} matches</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((profile) => {
                const isMutual = Boolean(profile.relationship?.isMutual || profile.isMutual);
                const isFollowedBy = Boolean(profile.relationship?.isFollowedBy || profile.isFollowedBy);
                const isFollowing = Boolean(profile.relationship?.isFollowing || profile.isFollowing);

                return (
                  <article key={profile.username} className="rounded-[1.5rem] border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.28)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-100">
                        {profile.profilePictureUrl ? <img src={profile.profilePictureUrl} alt={profile.name || profile.username} className="h-full w-full object-cover" /> : (profile.name?.charAt(0)?.toUpperCase() || profile.username?.charAt(0)?.toUpperCase() || '@')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold text-white">{profile.name}</p>
                          {isMutual ? <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-violet-200">Mutual</span> : null}
                        </div>
                        <p className="truncate text-sm text-slate-400">@{profile.username}</p>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{profile.bio || 'Creator on Ochi Live.'}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>{(profile.stats?.followers || 0).toLocaleString()} followers</span>
                      <span>{(profile.stats?.following || 0).toLocaleString()} following</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button type="button" onClick={() => navigate(`/profile/${profile.username}`)} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500">
                        View profile
                      </button>
                      <button type="button" onClick={() => handleFollowToggle(profile)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${isMutual || isFollowing ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-ochi-accent/60' : 'border-ochi-accent bg-ochi-accent text-white hover:bg-ochi-accent/90'}`}>
                        {isMutual ? 'Following' : isFollowedBy ? 'Follow back' : isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

          <SponsoredBanner image={placeholder} />
          <LiveSection />
          <UpcomingShowsSection />
          <PopularClipsSection />
          <RecommendedSection />
          <FreshOnTheMicSection />
        </div>
      </DashboardShell>

      {(searchTerm.trim() || recentSearches.length) ? (
        <div className="fixed inset-x-0 top-16 z-50 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-[0_20px_80px_rgba(15,23,42,0.6)] backdrop-blur-xl">
            {!searchTerm.trim() && recentSearches.length ? (
              <div className="mb-2 flex flex-wrap gap-2 px-2 pt-1">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchTerm(term);
                      saveRecentSearch(term);
                    }}
                    className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>
            ) : null}

            {searchLoading ? (
              <div className="px-3 py-2 text-sm text-slate-400">Searching creators...</div>
            ) : searchResults.length ? (
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((profile, index) => (
                  <button
                    key={profile.username}
                    type="button"
                    onClick={() => {
                      saveRecentSearch(profile.username);
                      navigate(`/profile/${profile.username}`);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition ${index === selectedResultIndex ? 'bg-slate-900/90 ring-1 ring-slate-700' : 'hover:bg-slate-900/80'}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {profile.profilePictureUrl ? (
                        <img src={profile.profilePictureUrl} alt={profile.name || profile.username} className="h-9 w-9 rounded-full object-cover border border-slate-700" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-100">
                          {profile.name?.charAt(0)?.toUpperCase() || profile.username?.charAt(0)?.toUpperCase() || '@'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{profile.name}</p>
                        <p className="truncate text-xs text-slate-400">@{profile.username}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {profile.stats?.followers ? `${profile.stats.followers.toLocaleString()} fol` : 'creator'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-slate-400">No creators match “{searchTerm.trim()}”.</div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default DiscoverPage;

