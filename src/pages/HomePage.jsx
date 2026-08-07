import { useEffect, useState } from 'react';
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

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getVideoFeed()
      .then((data) => {
        setVideos(data);
        setError('');
      })
      .catch(() => {
        setVideos([]);
        setError('Unable to load the feed. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  const setVideoState = (id, updater) => {
    setVideos((current) => current.map((video) => (video.id === id ? updater(video) : video)));
  };

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2400);
  };

  const getPreviewImage = (video) => {
    return video.thumbnailUrl || video.mediaUrl || placeholderImage;
  };

  const handleToggleLike = async (id) => {
    try {
      const updated = await likeVideo(id);
      setVideoState(id, () => ({ ...updated, liked: true }));
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

  const handleAddComment = async (id) => {
    const comment = window.prompt('Write a quick comment for this post');
    if (!comment) return;

    try {
      const response = await commentOnVideo(id, comment);
      setVideoState(id, () => ({ ...response.video }));
      showMessage('Comment added.');
    } catch (err) {
      showMessage('Unable to post comment.');
    }
  };

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
    link.download = `${video.title.replace(/\s+/g, '_') || 'ochi-post'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('Download started.');
  };

  const handleIncrementView = async (id) => {
    try {
      const updated = await incrementView(id);
      setVideoState(id, () => ({ ...updated }));
    } catch (err) {
      showMessage('Unable to update view count.');
    }
  };

  const featured = videos[0];
  const feed = videos.slice(1);

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
      {loading ? (
        <div className="rounded-2xl bg-slate-900/95 p-6 text-slate-400">Loading feed…</div>
      ) : error ? (
        <div className="rounded-2xl bg-slate-900/95 p-6 text-slate-100">
          <p className="text-lg font-semibold text-rose-300">Unable to load the feed.</p>
          <p className="mt-3 text-sm text-slate-400">{error}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {featured ? (
            <section className="overflow-hidden rounded-2xl bg-slate-900/95">
              <div className="relative overflow-hidden rounded-t-2xl bg-slate-950">
                <img
                  src={getPreviewImage(featured)}
                  alt={featured.title}
                  className="h-80 w-full object-cover sm:h-[420px]"
                />
                <div className="absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-100 shadow-lg backdrop-blur-sm">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse" />
                  Preview mode
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span className="uppercase tracking-[0.18em] text-slate-500">Featured</span>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    {featured.category}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{featured.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400 max-w-3xl">{featured.description}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>{featured.creatorName}</span>
                  <span>{(featured.views || 0).toLocaleString()} views</span>
                  <span>{(featured.likes || 0).toLocaleString()} likes</span>
                  <span>{(featured.comments || 0).toLocaleString()} comments</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(featured.id)}
                    className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {featured.liked ? 'Unlike' : 'Like'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddComment(featured.id)}
                    className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Comment
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSave(featured.id)}
                    className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {featured.saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(featured)}
                    className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(featured)}
                    className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Share
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2">
            {feed.length ? (
              feed.map((video) => (
                <article key={video.id} className="overflow-hidden rounded-2xl bg-slate-900/95 transition hover:bg-slate-900">
                  <div className="relative overflow-hidden bg-slate-950">
                    <img
                      src={getPreviewImage(video)}
                      alt={video.title}
                      className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                      onClick={() => handleIncrementView(video.id)}
                    />
                    <div className="absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      Preview only
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                      <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                        {video.category}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{video.createdAt}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{video.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{video.description}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
                      <div className="flex flex-wrap gap-3">
                        <span>{video.creatorName}</span>
                        <span>{(video.views || 0).toLocaleString()} views</span>
                        <span>{(video.likes || 0).toLocaleString()} likes</span>
                        <span>{(video.comments || 0).toLocaleString()} comments</span>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(video.id)}
                        className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        {video.liked ? 'Unlike' : 'Like'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddComment(video.id)}
                        className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Comment
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleSave(video.id)}
                        className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        {video.saved ? 'Saved' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShare(video)}
                        className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Share
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(video)}
                        className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-900/95 p-6 text-center text-slate-400">
                No posts available right now.
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default HomePage;

