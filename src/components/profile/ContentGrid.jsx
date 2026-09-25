import { useMemo, useState } from 'react';
import { likeVideo, commentOnVideo, toggleSaveVideo, reshareVideo, followProfile, unfollowProfile } from '../../api/dashboardApi';

const toneStyles = {
  plum: 'from-[#7d5f79] via-[#4b3c59] to-[#101322]',
  amber: 'from-[#b48555] via-[#55484f] to-[#101322]',
  slate: 'from-[#607084] via-[#32394c] to-[#101322]',
  rose: 'from-[#9c6c78] via-[#513f5c] to-[#101322]',
};

const isVideoUrl = (url) => {
  if (!url) return false;
  const value = String(url).toLowerCase();
  return value.includes('.mp4') || value.includes('.webm') || value.includes('.mov') || value.includes('video') || value.startsWith('blob:');
};

const getInitials = (name = '') => {
  const safeName = String(name).trim();
  if (!safeName) return 'U';
  const parts = safeName.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
};

function ContentCard({ item, tab }) {
  const currentUserId = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('ochi_user') || 'null')?.id || null;
    } catch {
      return null;
    }
  })();

  const [liked, setLiked] = useState(Boolean(item.liked || item.likedBy?.includes(currentUserId)));
  const [saved, setSaved] = useState(Boolean(item.saved));
  const [reshared, setReshared] = useState(Boolean(item.reshared));
  const [likes, setLikes] = useState(Number(item.likes || 0));
  const [comments, setComments] = useState(Number(item.comments || 0));
  const [commentThread, setCommentThread] = useState(() => {
    const base = Array.isArray(item.commentThread) ? item.commentThread : [];
    return base.map((comment, index) => ({
      ...comment,
      commentKey: comment.commentKey || `${comment.userName || 'creator'}-${comment.createdAt || index}`,
      replies: Array.isArray(comment.replies) ? comment.replies : [],
    }));
  });
  const [commentDraft, setCommentDraft] = useState('');
  const [commentOpen, setCommentOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [message, setMessage] = useState('');
  const [followingCreator, setFollowingCreator] = useState(Boolean(item.isFollowing || item.relationship?.isFollowing));
  const [followLoading, setFollowLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const recentComments = useMemo(() => {
    return commentThread
      .map((comment, index) => ({
        ...comment,
        commentKey: comment.commentKey || `${comment.userName || 'creator'}-${comment.createdAt || index}`,
        replies: Array.isArray(comment.replies) ? comment.replies : [],
      }))
      .slice(-3)
      .reverse();
  }, [commentThread]);

  const handleLike = async () => {
    if (liked) {
      setMessage('You already liked this video.');
      return;
    }

    try {
      const updated = await likeVideo(item.id);
      setLiked(Boolean(updated.liked || true));
      setLikes(Number(updated.likes || likes + 1));
      setMessage(updated.message || 'You liked this post.');
    } catch (error) {
      setMessage('Unable to like this post right now.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await toggleSaveVideo(item.id);
      setSaved(Boolean(response.saved));
      setMessage(response.saved ? 'Saved to your library.' : 'Removed from saved posts.');
    } catch (error) {
      setMessage('Unable to save this post right now.');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const comment = commentDraft.trim();
    if (!comment) return;

    try {
      const response = await commentOnVideo(item.id, comment);
      const nextComment = response.comment || {
        userName: 'You',
        text: comment,
        createdAt: new Date().toISOString(),
        replyTo: replyingTo?.userName || null,
      };

      setCommentThread((current) => {
        if (replyingTo?.commentKey) {
          return current.map((entry, index) => {
            const key = entry.commentKey || `${entry.userName || 'creator'}-${entry.createdAt || index}`;
            if (key !== replyingTo.commentKey) return entry;
            return {
              ...entry,
              replies: [
                ...(Array.isArray(entry.replies) ? entry.replies : []),
                {
                  ...nextComment,
                  commentKey: `${key}-reply-${Date.now()}`,
                  replies: [],
                },
              ],
            };
          });
        }

        return [
          ...current,
          {
            ...nextComment,
            commentKey: `${nextComment.userName || 'you'}-${Date.now()}`,
            replies: [],
          },
        ];
      });

      setComments(Number(response.video?.comments || comments + 1));
      setCommentDraft('');
      setReplyingTo(null);
      setMessage(replyingTo ? `Reply to @${replyingTo.userName} posted.` : 'Comment posted and visible to others.');
    } catch (error) {
      setMessage('Unable to add the comment.');
    }
  };

  const handleShare = async () => {
    const shareText = `${item.title || 'Creator post'} by ${item.creatorName || 'Ochi creator'}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title || 'Ochi post', text: shareText, url: window.location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      }
      setMessage('Share link copied.');
    } catch (error) {
      setMessage('Unable to complete the share right now.');
    }
  };

  const handleReshare = async () => {
    try {
      await reshareVideo(item.id);
      setReshared(true);
      setMessage('Post reshared to your profile.');
    } catch (error) {
      setMessage('Unable to reshare right now.');
    }
  };

  const handleFollowCreator = async () => {
    const creatorUsername = item.creatorUsername || item.creator?.username;
    if (!creatorUsername || currentUserId === item.creatorId) return;

    setFollowLoading(true);
    try {
      const result = followingCreator ? await unfollowProfile(creatorUsername) : await followProfile(creatorUsername);
      const relationship = result?.relationship || {};
      setFollowingCreator(Boolean(relationship.isFollowing || relationship.isMutual || !followingCreator));
      setMessage(followingCreator ? 'Unfollowed creator.' : 'Now following creator.');
    } catch (error) {
      setMessage('Unable to update follow state right now.');
    } finally {
      setFollowLoading(false);
    }
  };

  const mediaUrl = item.mediaUrl || item.thumbnailUrl;
  const isVideo = (item.type === 'video') || isVideoUrl(mediaUrl);

  return (
    <article className="group overflow-hidden bg-slate-950 shadow-[0_12px_26px_rgba(2,6,23,0.2)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(2,6,23,0.3)]">
      <div className="relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-slate-900" onClick={() => setExpanded(true)}>
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 p-3 text-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-[10px] font-bold text-white ring-1 ring-white/10">
              {getInitials(item.creatorName || item.creatorUsername || 'Creator')}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-white/95">{item.creatorName || item.creatorUsername || 'Creator'}</p>
              <p className="truncate text-[9px] uppercase tracking-[0.18em] text-slate-300/80">{item.creatorUsername ? `@${item.creatorUsername}` : 'creator'}</p>
            </div>
          </div>
          {item.creatorUsername && currentUserId !== item.creatorId && (
            <button
              type="button"
              onClick={handleFollowCreator}
              disabled={followLoading}
              className={`rounded-full border px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] transition ${
                followingCreator
                  ? 'border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500'
                  : 'border-rose-400/60 bg-rose-500/15 text-rose-200 hover:bg-rose-500/20'
              }`}
            >
              {followLoading ? '...' : followingCreator ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[item.tone] || toneStyles.plum} opacity-80`} />
        {mediaUrl ? (
          isVideo ? (
            <video
              controls
              preload="metadata"
              playsInline
              muted
              className="relative z-10 h-full w-full object-cover"
              src={mediaUrl}
              poster={item.thumbnailUrl || mediaUrl}
            />
          ) : (
            <img src={mediaUrl} alt={item.title || 'post media'} className="relative z-10 h-full w-full object-cover" />
          )
        ) : (
          <div className="relative z-10 flex h-full items-center justify-center bg-slate-800 text-sm text-slate-400">No preview available</div>
        )}

        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 text-[10px] uppercase tracking-[0.18em] text-white/80">
          <span className="rounded-full border border-white/15 bg-slate-950/45 px-2 py-1 backdrop-blur-sm">
            {item.category || (tab === 'reshared' ? 'Reshared post' : 'Post')}
          </span>
          <span className="rounded-full border border-white/15 bg-slate-950/45 px-2 py-1 backdrop-blur-sm">
            {item.duration || item.type || 'media'}
          </span>
        </div>

        <div className="hidden">
          <button type="button" onClick={handleLike} aria-label="Like this post" className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition ${liked ? 'border-rose-400/80 bg-rose-500/15 text-rose-200 shadow-[0_0_18px_rgba(251,113,133,0.3)]' : 'border-slate-700/80 bg-slate-950/70 text-white/90 hover:border-slate-500 hover:bg-slate-900'}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-3.5 w-3.5 ${liked ? 'fill-rose-300' : 'fill-current'}`}>
              <path d="M12 21s-8.5-5.2-10.3-10A5.7 5.7 0 0 1 12 5.3a5.7 5.7 0 0 1 10.3 5.7C20.5 15.8 12 21 12 21Z" />
            </svg>
            <span>{likes}</span>
          </button>
          <button type="button" onClick={handleSave} aria-label="Save this post" className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition ${saved ? 'border-amber-400/80 bg-amber-500/10 text-amber-200' : 'border-slate-700/80 bg-slate-950/70 text-white/90 hover:border-slate-500 hover:bg-slate-900'}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.8]">
              <path d="M6 4.5h12a1 1 0 0 1 1 1V19l-7-4-7 4V5.5a1 1 0 0 1 1-1Z" />
            </svg>
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button type="button" onClick={handleReshare} aria-label="Reshare this post" className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition ${reshared ? 'border-emerald-400/80 bg-emerald-500/10 text-emerald-200' : 'border-slate-700/80 bg-slate-950/70 text-white/90 hover:border-slate-500 hover:bg-slate-900'}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.8]">
              <path d="M7 8.5V6.2a1 1 0 0 1 1.7-.7l4.7 4.7a1 1 0 0 1 0 1.4l-4.7 4.7A1 1 0 0 1 7 15.8v-2.3H6a4 4 0 0 0-4 4v1" />
              <path d="M17 15.5v2.3a1 1 0 0 1-1.7.7l-4.7-4.7a1 1 0 0 1 0-1.4l4.7-4.7a1 1 0 0 1 1.7.7v2.3h1a4 4 0 0 1 4 4v1" />
            </svg>
            <span>{reshared ? 'Shared' : 'Share'}</span>
          </button>
          <button type="button" onClick={() => setCommentOpen((open) => !open)} aria-label={commentOpen ? 'Hide comments' : 'Open comments'} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition ${commentOpen ? 'border-sky-400/80 bg-sky-500/10 text-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.25)]' : 'border-slate-700/80 bg-slate-950/70 text-white/90 hover:border-slate-500 hover:bg-slate-900'}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.8]">
              <path d="M7 18.5 3.5 20V6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 17H7Z" />
            </svg>
            <span>{comments}</span>
          </button>
        </div>

        {commentOpen ? (
          <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-sm" onClick={() => setCommentOpen(false)} aria-hidden="true" />
        ) : null}

        <div className={`absolute inset-x-0 bottom-0 z-40 p-3 transition-all duration-400 ease-out ${commentOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'}`}>
          <div className="max-h-[46vh] rounded-[1.5rem] border border-slate-700/80 bg-slate-950/90 p-3 shadow-[0_30px_60px_rgba(2,6,23,0.7)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Comments</p>
                <p className="mt-1 text-sm font-medium text-white">{comments} total</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-slate-200 transition hover:border-slate-500 hover:text-white">View all</button>
                <button type="button" onClick={() => setCommentOpen(false)} className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-200 transition hover:border-slate-500 hover:text-white">Close</button>
              </div>
            </div>

            <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
              {recentComments.length ? (
                recentComments.map((comment, index) => {
                  const commentKey = comment.commentKey || `${comment.userName || 'creator'}-${comment.createdAt || index}`;
                  const isReplying = replyingTo?.commentKey === commentKey;
                  const replyCount = Array.isArray(comment.replies) ? comment.replies.length : 0;

                  return (
                    <div key={commentKey} className={`rounded-xl border px-2.5 py-2 transition-all duration-200 ${isReplying ? 'border-sky-500/60 bg-sky-500/5' : 'border-slate-800 bg-slate-900/70'}`}>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-sky-500 text-[10px] font-semibold text-white">
                          {getInitials(comment.userName || 'Creator')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{comment.userName || 'Creator'}</p>
                            <span className="text-[9px] uppercase tracking-[0.12em] text-slate-600">Now</span>
                          </div>

                          {comment.replyTo ? (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Replying to @{comment.replyTo}</p>
                          ) : null}

                          <p className="mt-1 text-sm leading-5 text-slate-200">{comment.text}</p>

                          <div className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-slate-500">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo({ userName: comment.userName || 'Creator', commentKey });
                                setCommentDraft('');
                              }}
                              className="transition hover:text-slate-300"
                            >
                              Reply
                            </button>
                            <button type="button" className="transition hover:text-slate-300">Like</button>
                            {replyCount > 0 ? <span className="rounded-full border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[8px] text-slate-300">{replyCount}</span> : null}
                          </div>

                          {Array.isArray(comment.replies) && comment.replies.length ? (
                            <div className="mt-2 space-y-1.5 border-l border-slate-700 pl-2">
                              {comment.replies.map((reply, replyIndex) => (
                                <div key={`${commentKey}-reply-${replyIndex}`} className="rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-[9px] uppercase tracking-[0.14em] text-slate-500">{reply.userName || 'Creator'}</p>
                                    <span className="text-[8px] uppercase tracking-[0.12em] text-slate-600">Reply</span>
                                  </div>
                                  <p className="mt-1 text-xs leading-4 text-slate-200">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {isReplying ? (
                            <div className="mt-2 rounded-xl border border-sky-500/30 bg-slate-900/80 p-2">
                              <p className="mb-2 text-[9px] uppercase tracking-[0.14em] text-sky-300">Replying to @{comment.userName || 'Creator'}</p>
                              <div className="flex gap-2">
                                <input
                                  value={commentDraft}
                                  onChange={(event) => setCommentDraft(event.target.value)}
                                  maxLength={180}
                                  placeholder={`Reply to @${comment.userName || 'Creator'}...`}
                                  className="w-full bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                                />
                                <button type="button" onClick={() => { setReplyingTo(null); setCommentDraft(''); }} className="text-[9px] uppercase tracking-[0.14em] text-slate-400 transition hover:text-slate-200">Cancel</button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No comments yet. Start the conversation.</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-3 flex gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
              <input
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                maxLength={180}
                placeholder={replyingTo ? `Reply to @${replyingTo.userName}...` : 'Add a comment...'}
                className="w-full bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button type="submit" className="rounded-full border border-rose-400/50 bg-rose-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-200 transition hover:bg-rose-500/20">{replyingTo ? 'Reply' : 'Post'}</button>
            </form>
          </div>
        </div>
      </div>

      <div className="space-y-2 p-2 sm:p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-white sm:text-base">{item.title || 'Untitled post'}</p>
            <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-400">{item.description || 'Creator post from Ochi Live.'}</p>
          </div>
          <span className="shrink-0 text-[9px] text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}</span>
        </div>

        {!commentOpen && recentComments.length ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 py-2 transition-colors hover:border-slate-700">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Latest comment</p>
              <span className="text-[9px] uppercase tracking-[0.12em] text-slate-600">Open</span>
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-200">{recentComments[0].text}</p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">
          <span>{item.creatorName || 'Ochi creator'}</span>
          <div className="flex items-center gap-3 normal-case tracking-normal">
            <button type="button" onClick={handleLike} className={liked ? 'text-rose-300' : 'text-slate-400'} aria-label={liked ? 'Liked' : 'Like'}>{liked ? '♥' : '♡'} {likes}</button>
            <button type="button" onClick={handleSave} className={saved ? 'text-amber-300' : 'text-slate-400'} aria-label={saved ? 'Saved' : 'Save'}>{saved ? 'Saved' : 'Save'}</button>
            <button type="button" onClick={handleShare} className="text-slate-400" aria-label="Share">Share</button>
          </div>
        </div>

        {message ? <p className="text-xs text-emerald-200">{message}</p> : null}
      </div>
      {expanded ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-8" onClick={() => setExpanded(false)}>
          <button type="button" onClick={() => setExpanded(false)} className="absolute right-4 top-4 z-10 border border-white/20 bg-black/60 px-3 py-2 text-sm font-semibold text-white">Close</button>
          <div className="flex h-full w-full items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {isVideo ? <video controls autoPlay playsInline className="max-h-full max-w-full object-contain" src={mediaUrl} poster={item.thumbnailUrl || mediaUrl} /> : <img className="max-h-full max-w-full object-contain" src={mediaUrl} alt={item.title || 'post media'} />}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ContentGrid({ items, tab, isOwnProfile }) {
  if (!items.length) {
    return (
      <div className="border-t border-slate-800 py-14 text-center">
        <p className="text-sm font-medium text-slate-300">{tab === 'reshared' ? 'No reshared posts yet.' : 'No posts yet.'}</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{isOwnProfile ? 'Publish your first live moment and start building your profile.' : 'This creator has not published anything here yet.'}</p>
        {isOwnProfile && tab === 'posts' ? <a href="/upload" className="mt-5 inline-flex border border-ochi-accent bg-ochi-accent px-4 py-2 text-sm font-semibold text-white">Create post</a> : null}
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4" role="tabpanel">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} tab={tab} />
      ))}
    </div>
  );
}

export default ContentGrid;