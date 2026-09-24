import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
  getVideoFeed,
  incrementView,
  likeVideo,
  commentOnVideo,
  toggleSaveVideo,
  followProfile,
  unfollowProfile,
} from '../api/dashboardApi';
import { getStoredSession } from '../utils/session';

const placeholderImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop&q=80';

const tabs = [
  { key: 'following', label: 'Following' },
  { key: 'for_you', label: 'For You' },
  { key: 'trending', label: 'Trending' },
  { key: 'recent_live', label: 'Recent Live' },
];

function HomePage() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('for_you');
  const [commentSheetVideoId, setCommentSheetVideoId] = useState(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const videoRefs = useRef({});
  const viewedIds = useRef(new Set());
  const viewTimers = useRef(new Map());
  const lastVideoTap = useRef(new Map());
  const tapTimers = useRef(new Map());
  const playbackPositions = useRef(new Map());
  const [mutedVideos, setMutedVideos] = useState({});
  const [heartBurstVideoId, setHeartBurstVideoId] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});

  useEffect(() => {
    setLoading(true);
    getVideoFeed(activeTab)
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => {
        setVideos([]);
        setError('Unable to load the feed. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => {
    if (!videos.length || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.videoId;
        const video = videoRefs.current[id];
        if (!video) return;

        if (entry.isIntersecting) {
          if (!viewTimers.current.has(id)) {
            const timer = window.setTimeout(() => {
              if (!viewedIds.current.has(id)) {
                viewedIds.current.add(id);
                handleIncrementView(id);
              }
            }, 1800);
            viewTimers.current.set(id, timer);
          }

          Object.values(videoRefs.current).forEach((otherVideo) => {
            if (otherVideo && otherVideo !== video && otherVideo.tagName === 'VIDEO') {
              try {
                otherVideo.pause();
              } catch {
                // ignore pause errors
              }
            }
          });

          const savedPosition = playbackPositions.current.get(id);
          if (savedPosition && Number.isFinite(savedPosition) && video.duration && savedPosition < video.duration - 0.5) {
            video.currentTime = savedPosition;
          }
          video.play().catch(() => undefined);
        } else {
          if (Number.isFinite(video.currentTime) && video.currentTime > 0) {
            playbackPositions.current.set(id, video.currentTime);
          }
          const timer = viewTimers.current.get(id);
          if (timer) {
            window.clearTimeout(timer);
            viewTimers.current.delete(id);
          }
          try {
            video.pause();
          } catch {
            // ignore playback pause errors
          }
        }
      });
    }, { threshold: 0.5 });

    videos.forEach((video) => {
      const element = videoRefs.current[video.id];
      if (element?.tagName === 'VIDEO') {
        element.dataset.videoId = video.id;
        element.muted = mutedVideos[video.id] !== false;
        element.playsInline = true;
        observer.observe(element);
      }
    });

    return () => {
      viewTimers.current.forEach((timer) => window.clearTimeout(timer));
      viewTimers.current.clear();
      observer.disconnect();
    };
  }, [videos, mutedVideos]);

  const setVideoState = (id, updater) => {
    setVideos((current) => current.map((video) => (video.id === id ? updater(video) : video)));
  };

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2400);
  };

  const getPreviewImage = (video) => {
    return video?.thumbnailUrl || video?.mediaUrl || placeholderImage;
  };

  const handleSelectTab = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleSwipe = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) return;
    const delta = touchStartX.current - touchEndX.current;
    const verticalDelta = Math.abs(touchStartY.current - touchEndY.current);
    if (Math.abs(delta) < 80 || Math.abs(delta) <= verticalDelta) return;

    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    if (delta > 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    }
    if (delta < 0 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].key);
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const handleToggleLike = async (id) => {
    try {
      const updated = await likeVideo(id);
      setVideoState(id, (video) => ({
        ...video,
        ...updated,
        liked: true,
        likes: Number(updated?.likes ?? Number(video.likes || 0) + 1),
      }));
      showMessage(updated?.message || 'You liked this post.');
    } catch (err) {
      showMessage('Unable to like the post.');
    }
  };

  const handleVideoTap = (event, video) => {
    event.stopPropagation();
    if (video.type === 'live') {
      navigate(`/live/${video.id}`);
      return;
    }

    const now = Date.now();
    const previousTap = lastVideoTap.current.get(video.id) || 0;
    lastVideoTap.current.set(video.id, now);

    if (now - previousTap < 320) {
      const pendingTap = tapTimers.current.get(video.id);
      if (pendingTap) {
        window.clearTimeout(pendingTap);
        tapTimers.current.delete(video.id);
      }
      handleToggleLike(video.id);
      setHeartBurstVideoId(video.id);
      window.setTimeout(() => setHeartBurstVideoId((current) => (current === video.id ? null : current)), 850);
      return;
    }

    const pendingTap = window.setTimeout(() => {
      tapTimers.current.delete(video.id);
      const element = videoRefs.current[video.id];
      if (!element) return;
      const nextMuted = !element.muted;
      element.muted = nextMuted;
      setMutedVideos((current) => ({ ...current, [video.id]: nextMuted }));
      if (!nextMuted) element.play().catch(() => undefined);
    }, 320);
    tapTimers.current.set(video.id, pendingTap);
  };

  const handleToggleSound = (event, id) => {
    event.stopPropagation();
    const element = videoRefs.current[id];
    if (!element) return;
    const nextMuted = !element.muted;
    element.muted = nextMuted;
    setMutedVideos((current) => ({ ...current, [id]: nextMuted }));
    if (!nextMuted) element.play().catch(() => undefined);
  };

  const handleToggleSave = async (id) => {
    try {
      const response = await toggleSaveVideo(id);
      setVideoState(id, (video) => ({ ...video, saved: response.saved }));
      showMessage(response.saved ? 'Saved to your library.' : 'Removed from saved posts.');
    } catch (err) {
      showMessage('Unable to save this post.');
    }
  };

  const handleToggleFollow = async (video) => {
    if (!video.creatorUsername) return;
    try {
      const result = video.isFollowing
        ? await unfollowProfile(video.creatorUsername)
        : await followProfile(video.creatorUsername);
      const nextFollowState = Boolean(result?.relationship?.isFollowing ?? !video.isFollowing);
      setVideoState(video.id, (current) => ({
        ...current,
        isFollowing: nextFollowState,
      }));
      showMessage(nextFollowState ? 'Now following creator.' : 'Unfollowed creator.');
    } catch {
      showMessage('Unable to update follow state right now.');
    }
  };

  const handleOpenComments = (video) => {
    setCommentSheetVideoId(video.id);
    setCommentDraft('');
    setReplyTarget(null);
  };

  const handleSubmitComment = async () => {
    if (!commentSheetVideoId) return;

    const trimmed = String(commentDraft || '').trim();
    if (!trimmed) return;

    const finalComment = replyTarget ? `@${replyTarget.userName} ${trimmed}` : trimmed;

    try {
      const response = await commentOnVideo(commentSheetVideoId, finalComment);
      setVideoState(commentSheetVideoId, (video) => ({
        ...video,
        ...response.video,
        commentThread: Array.isArray(response.video.commentThread) ? response.video.commentThread : video.commentThread,
      }));
      setCommentDraft('');
      setReplyTarget(null);
      showMessage(replyTarget ? 'Reply sent.' : 'Comment added.');
    } catch (err) {
      showMessage('Unable to post comment.');
    }
  };

  const activeCommentVideo = videos.find((video) => video.id === commentSheetVideoId) || null;
  const activeCommentThread = Array.isArray(activeCommentVideo?.commentThread) ? activeCommentVideo.commentThread : [];

  const handleShare = async (video) => {
    const shareText = `${video.title} by ${video.creatorName}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, text: shareText });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        showMessage('Post details copied to clipboard.');
      } else {
        showMessage('Share is not available in this browser.');
      }
    } catch (err) {
      showMessage('Unable to complete sharing.');
    }
  };

  const isVideoType = (video) => String(video?.type || '').toLowerCase() === 'video' || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(String(video?.mediaUrl || video?.thumbnailUrl || ''));

  const handleDownload = (video) => {
    if (!video.mediaUrl) {
      showMessage('No media available to download.');
      return;
    }

    const link = document.createElement('a');
    link.href = video.mediaUrl;
    link.download = `${(video.title || 'ochi-post').replace(/\s+/g, '_')}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('Download started.');
  };

  const handleIncrementView = async (id) => {
    try {
      const updated = await incrementView(id);
      setVideoState(id, (video) => ({ ...video, ...updated }));
    } catch (err) {
      showMessage('Unable to update view count.');
    }
  };

  return (
    <DashboardShell
      title="Discover every moment"
      subtitle="Browse the latest videos and photos from creators across the community."
    >
      <style>{`
        @keyframes feed-heart-burst {
          0% { opacity: 0; transform: scale(.35) rotate(-10deg); }
          20% { opacity: 1; transform: scale(1.18) rotate(0deg); }
          62% { opacity: 1; transform: scale(1) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.35) rotate(8deg); }
        }
        @keyframes feed-photo-drift {
          0%, 100% { transform: scale(1.02); }
          50% { transform: scale(1.08); }
        }
        .feed-heart-burst { animation: feed-heart-burst .85s cubic-bezier(.2,.8,.2,1) both; }
        .feed-photo-motion { animation: feed-photo-drift 12s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .feed-heart-burst, .feed-photo-motion { animation: none !important; }
        }
      `}</style>
      {message ? (
        <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
          {message}
        </div>
      ) : null}

      <div
        className="bg-transparent p-0"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0].clientX;
          touchStartY.current = event.changedTouches[0].clientY;
        }}
        onTouchEnd={(event) => {
          touchEndX.current = event.changedTouches[0].clientX;
          touchEndY.current = event.changedTouches[0].clientY;
          handleSwipe();
        }}
      >
        <div className="flex gap-5 overflow-x-auto border-b border-slate-800/80 no-scrollbar sm:gap-7">
          {tabs.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectTab(tab.key)}
                className={`relative shrink-0 border-b-2 px-0 pb-2.5 pt-1 text-sm font-semibold tracking-normal transition-all duration-200 sm:pb-3 sm:text-sm ${
                  active
                    ? 'border-rose-300 text-white'
                    : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] bg-slate-900/95 p-6 text-slate-400">Loading feed…</div>
      ) : error ? (
        <div className="rounded-[28px] bg-slate-900/95 p-6 text-slate-100">
          <p className="text-lg font-semibold text-rose-300">Unable to load the feed.</p>
          <p className="mt-3 text-sm text-slate-400">{error}</p>
        </div>
      ) : (
        <div className="max-h-[calc(100dvh-11rem)] space-y-3 overflow-y-auto overscroll-contain pr-1 snap-y snap-mandatory sm:max-h-[calc(100dvh-12rem)]">
          {videos.length ? (
            videos.map((video, videoIndex) => (
              <article
                key={video.id}
                className="relative h-[78vh] snap-start overflow-hidden rounded-[22px] bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.35)] sm:h-[84vh] sm:rounded-[30px]"
                onClick={() => {
                  if (video.type === 'live') {
                    navigate(`/live/${video.id}`);
                  } else {
                  }
                }}
                onTouchStart={(event) => {
                  touchStartX.current = event.changedTouches[0].clientX;
                  touchStartY.current = event.changedTouches[0].clientY;
                }}
                onTouchEnd={(event) => {
                  touchEndX.current = event.changedTouches[0].clientX;
                  touchEndY.current = event.changedTouches[0].clientY;
                  handleSwipe();
                }}
              >
                {isVideoType(video) ? (
                  <video
                    ref={(node) => {
                      if (node) videoRefs.current[video.id] = node;
                    }}
                    src={video.mediaUrl || video.thumbnailUrl}
                    poster={video.thumbnailUrl || video.mediaUrl}
                    muted={mutedVideos[video.id] !== false}
                    autoPlay
                    loop
                    playsInline
                    preload={videoIndex === 0 ? 'auto' : 'metadata'}
                    className="h-full w-full object-cover"
                    onLoadedMetadata={(event) => {
                      const savedPosition = playbackPositions.current.get(video.id);
                      if (savedPosition && savedPosition < event.currentTarget.duration - 0.5) {
                        event.currentTarget.currentTime = savedPosition;
                      }
                    }}
                    onTimeUpdate={(event) => {
                      const { currentTime, duration } = event.currentTarget;
                      playbackPositions.current.set(video.id, currentTime);
                      if (duration) setVideoProgress((current) => ({ ...current, [video.id]: currentTime / duration }));
                    }}
                    onPointerUp={(event) => handleVideoTap(event, video)}
                  />
                ) : (
                  <img
                    src={getPreviewImage(video)}
                    alt={video.title}
                    className="feed-photo-motion h-full w-full object-cover"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (video.type === 'live') {
                        navigate(`/live/${video.id}`);
                        return;
                      }
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {heartBurstVideoId === video.id ? (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <span className="feed-heart-burst text-8xl text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]" aria-hidden="true">♥</span>
                  </div>
                ) : null}

                <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3 sm:top-4 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-slate-950/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                      {video.type === 'live' ? 'LIVE' : video.category || 'Creator'}
                    </span>
                    {video.creatorUsername && getStoredSession().user?.username !== video.creatorUsername ? (
                      <button type="button" onClick={(event) => { event.stopPropagation(); handleToggleFollow(video); }} className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-slate-950 shadow-lg">
                        {video.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    ) : null}
                  </div>
                  {isVideoType(video) ? (
                    <button
                      type="button"
                      onClick={(event) => handleToggleSound(event, video.id)}
                      className="rounded-full bg-slate-950/65 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-sm"
                      aria-label={mutedVideos[video.id] === false ? 'Mute video' : 'Unmute video'}
                    >
                      {mutedVideos[video.id] === false ? '🔊 Sound on' : '🔇 Tap for sound'}
                    </button>
                  ) : <span className="rounded-full bg-slate-950/40 px-2.5 py-0.5 text-[9px] font-medium text-slate-200 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]">{Number(video.views || 0).toLocaleString()} views</span>}
                </div>

                <div className="absolute bottom-14 right-3 z-10 flex flex-col items-center gap-2 sm:bottom-16 sm:right-4 sm:gap-3">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleToggleLike(video.id);
                    }}
                    className={`flex min-w-12 flex-col items-center gap-1 rounded-2xl border px-2 py-2 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 ${video.liked ? 'border-rose-300/40 bg-rose-500/20' : 'border-white/15 bg-slate-950/55'}`}
                    aria-label="Like video"
                  >
                    <span className="text-base sm:text-lg">{video.liked ? '♥' : '♡'}</span>
                    <span className="text-[10px] font-medium text-slate-200">{Number(video.likes || 0).toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenComments(video);
                    }}
                    className="flex min-w-12 flex-col items-center gap-1 rounded-2xl border border-white/15 bg-slate-950/55 px-2 py-2 text-white shadow-lg backdrop-blur-xl transition hover:scale-105"
                    aria-label="Comment on video"
                  >
                    <span className="text-base sm:text-lg">💬</span>
                    <span className="text-[10px] font-medium text-slate-200">{Number(video.comments || 0).toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleToggleSave(video.id);
                    }}
                    className={`flex min-w-12 flex-col items-center gap-1 rounded-2xl border px-2 py-2 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 ${video.saved ? 'border-emerald-300/40 bg-emerald-500/20' : 'border-white/15 bg-slate-950/55'}`}
                    aria-label="Save video"
                  >
                    <span className="text-base sm:text-lg">{video.saved ? '✓' : '⎘'}</span>
                    <span className="text-[10px] font-medium text-slate-200">{Number(video.saves || video.savedCount || 0).toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleShare(video);
                    }}
                    className="flex min-w-12 flex-col items-center gap-1 rounded-2xl border border-white/15 bg-slate-950/55 px-2 py-2 text-white shadow-lg backdrop-blur-xl transition hover:scale-105"
                    aria-label="Share video"
                  >
                    <span className="text-base sm:text-lg">↗</span>
                    <span className="text-[10px] font-medium text-slate-200">{Number(video.shares || video.shareCount || 0).toLocaleString()}</span>
                  </button>
                </div>

                {isVideoType(video) ? (
                  <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/15">
                    <div
                      className="h-full bg-white transition-[width] duration-200"
                      style={{ width: `${Math.min(100, Math.max(0, (videoProgress[video.id] || 0) * 100))}%` }}
                    />
                  </div>
                ) : null}

                <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                  <div className="max-w-[78%]">
                    <p className="text-sm text-slate-200">@{video.creatorName}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{video.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-200/90">
                      {video.description || 'Fresh creator content for your feed.'}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                      <span>{video.type === 'live' ? 'Live now' : 'Fresh drop'}</span>
                      <span>•</span>
                      <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[30px] border border-white/6 bg-slate-900/95 p-6 text-center text-slate-400">
              No posts available right now.
            </div>
          )}
        </div>
      )}

      {activeCommentVideo ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-3 pb-0 pt-10 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-t-[28px] border border-slate-700 bg-slate-950/95 shadow-[0_-25px_60px_rgba(2,6,23,0.8)]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Comments</p>
                <h3 className="text-lg font-semibold text-white">{Number(activeCommentVideo.comments || activeCommentThread.length || 0).toLocaleString()}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCommentSheetVideoId(null);
                  setCommentDraft('');
                  setReplyTarget(null);
                }}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-[52vh] space-y-3 overflow-y-auto px-4 py-4">
              {activeCommentThread.length ? (
                activeCommentThread.map((comment, index) => {
                  const author = comment.userName || 'Creator';
                  const initial = author.charAt(0).toUpperCase() || 'C';
                  const commentText = typeof comment.text === 'string' ? comment.text : '';
                  const createdAt = comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Now';

                  return (
                    <div key={`${comment.userId || author}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-xs font-bold text-white">
                          {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">{author}</p>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{createdAt}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReplyTarget({ userName: author, userId: comment.userId || author })}
                              className="text-[10px] uppercase tracking-[0.16em] text-sky-300 hover:text-sky-200"
                            >
                              Reply
                            </button>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-200">{commentText}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-5 text-center text-sm text-slate-400">
                  Be the first to comment on this post.
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 bg-slate-950/90 p-4">
              {replyTarget ? (
                <div className="mb-2 flex items-center justify-between gap-3 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200">
                  <span>Replying to @{replyTarget.userName}</span>
                  <button type="button" onClick={() => setReplyTarget(null)} className="text-sky-200 hover:text-white">
                    Cancel
                  </button>
                </div>
              ) : null}

              <div className="flex items-end gap-2">
                <textarea
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  rows={1}
                  placeholder={replyTarget ? `Reply to ${replyTarget.userName}...` : 'Add a comment...'}
                  className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSubmitComment}
                  disabled={!String(commentDraft || '').trim()}
                  className="rounded-2xl border border-sky-500/40 bg-sky-500/15 px-4 py-2.5 text-sm font-semibold text-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}

export default HomePage;

