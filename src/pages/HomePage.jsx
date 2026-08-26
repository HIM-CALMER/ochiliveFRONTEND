import { useEffect, useRef, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import {
  getVideoFeed,
  incrementView,
  likeVideo,
  commentOnVideo,
  toggleSaveVideo,
} from '../api/dashboardApi';

const placeholderImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop&q=80';

const tabs = [
  { key: 'following', label: 'Following' },
  { key: 'for_you', label: 'For You' },
  { key: 'trending', label: 'Trending' },
  { key: 'recent_live', label: 'Recent Live' },
];

function HomePage() {
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
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) < 50) return;

    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    if (delta > 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    }
    if (delta < 0 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].key);
    }
  };

  const handleToggleLike = async (id) => {
    try {
      const updated = await likeVideo(id);
      setVideoState(id, (video) => ({ ...video, ...updated, liked: true }));
      showMessage('You liked this post.');
    } catch (err) {
      showMessage('Unable to like the post.');
    }
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
      {message ? (
        <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
          {message}
        </div>
      ) : null}

      <div
        className="bg-transparent p-0"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0].clientX;
        }}
        onTouchEnd={(event) => {
          touchEndX.current = event.changedTouches[0].clientX;
          handleSwipe();
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectTab(tab.key)}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold tracking-[-0.01em] transition-all duration-200 sm:px-3.5 sm:py-2 sm:text-sm ${
                  active
                    ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(255,255,255,0.12)]'
                    : 'text-slate-400 hover:text-slate-200'
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
        <div className="space-y-3">
          {videos.length ? (
            videos.map((video) => (
              <article
                key={video.id}
                className="relative h-[68vh] overflow-hidden rounded-[22px] bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.35)] sm:h-[calc(100vh-170px)] sm:rounded-[30px]"
                onTouchStart={(event) => {
                  touchStartX.current = event.changedTouches[0].clientX;
                }}
                onTouchEnd={(event) => {
                  touchEndX.current = event.changedTouches[0].clientX;
                  handleSwipe();
                }}
              >
                <img
                  src={getPreviewImage(video)}
                  alt={video.title}
                  className="h-full w-full object-cover"
                  onClick={() => handleIncrementView(video.id)}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute inset-x-0 top-3 flex items-center justify-between px-3 sm:top-4 sm:px-4">
                  <span className="rounded-full border border-white/10 bg-slate-950/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                    {video.type === 'live' ? 'LIVE' : video.category || 'Creator'}
                  </span>
                  <span className="rounded-full bg-slate-950/40 px-2 py-0.5 text-[9px] font-medium text-slate-200 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px]">
                    {video.type === 'live' ? `${Number(video.views || 0).toLocaleString()} watching` : `${Number(video.views || 0).toLocaleString()} views`}
                  </span>
                </div>

                <div className="absolute bottom-4 right-3 z-10 flex flex-col items-center gap-2 sm:bottom-5 sm:right-4 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(video.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 text-base text-white shadow-lg backdrop-blur-sm transition hover:scale-105 sm:h-12 sm:w-12 sm:text-lg"
                    aria-label="Like video"
                  >
                    {video.liked ? '♥' : '♡'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenComments(video)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 text-lg text-white shadow-lg backdrop-blur-sm transition hover:scale-105"
                    aria-label="Comment on video"
                  >
                    💬
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSave(video.id)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 text-lg text-white shadow-lg backdrop-blur-sm transition hover:scale-105"
                    aria-label="Save video"
                  >
                    {video.saved ? '✓' : '⎘'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(video)}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/50 text-lg text-white shadow-lg backdrop-blur-sm transition hover:scale-105"
                    aria-label="Share video"
                  >
                    ↗
                  </button>
                </div>

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

