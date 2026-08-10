import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { createLiveRoom, getProfileSummary, startLiveRoom, uploadVideoPost } from '../api/dashboardApi';

/* ---------------------------------------------------------------
   Iconography — thin, consistent 24px line system
--------------------------------------------------------------- */
const Icon = ({ path, className = 'h-5 w-5', fill = 'none' }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {path}
  </svg>
);

const VideoIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="2.5" y="6" width="13" height="12" rx="3" />
        <path d="M15.5 11l5-3v8l-5-3z" />
      </>
    }
  />
);

const PhotoIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M3 8.5A2.5 2.5 0 015.5 6h1.2a1.5 1.5 0 001.3-.75l.6-1a1.5 1.5 0 011.3-.75h4.2a1.5 1.5 0 011.3.75l.6 1A1.5 1.5 0 0017.3 6h1.2A2.5 2.5 0 0121 8.5v8A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5z" />
        <circle cx="12" cy="12.5" r="3.4" />
      </>
    }
  />
);

const GalleryIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="M4 17l5-4.5 4 3.5 2.5-2L20 17" />
      </>
    }
  />
);

const LiveIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="2.6" />
        <path d="M7.5 7.5a6.4 6.4 0 000 9M16.5 16.5a6.4 6.4 0 000-9" />
        <path d="M4.5 4.5a10.6 10.6 0 000 15M19.5 19.5a10.6 10.6 0 000-15" />
      </>
    }
  />
);

const CloseIcon = (p) => <Icon {...p} path={<path d="M6 6l12 12M18 6L6 18" />} />;
const CheckIcon = (p) => <Icon {...p} path={<path d="M5 12.5l4.5 4.5L19 7.5" />} />;
const RetakeIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M20 12a8 8 0 10-2.6 5.9" />
        <path d="M20 5.5V12h-6" />
      </>
    }
  />
);
const SparkIcon = (p) => (
  <Icon {...p} path={<path d="M12 3l1.7 5.1L19 9.8l-4.3 3.3L15.4 19 12 15.9 8.6 19l.7-5.9L5 9.8l5.3-1.7z" />} />
);
const UploadCloudIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <path d="M6.5 17.5A4 4 0 017 9.6a5.5 5.5 0 0110.6 1.5A3.6 3.6 0 0117.5 17.5" />
        <path d="M12 12v8M9 14.5L12 11.6l3 2.9" />
      </>
    }
  />
);
const GlobeIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.4 2.6 2.4 14.4 0 17M12 3.5c-2.4 2.6-2.4 14.4 0 17" />
      </>
    }
  />
);
const LockIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
        <path d="M8 10V7.5a4 4 0 018 0V10" />
      </>
    }
  />
);
const UsersIcon = (p) => (
  <Icon
    {...p}
    path={
      <>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3.5 19a5.5 5.5 0 0111 0" />
        <path d="M16 6.2a3.2 3.2 0 010 6M17.5 19a5.4 5.4 0 00-2-4.2" />
      </>
    }
  />
);
const ChevronIcon = (p) => <Icon {...p} path={<path d="M9 6l6 6-6 6" />} />;

const options = [
  { key: 'video', label: 'Video', hint: 'Record', Glyph: VideoIcon },
  { key: 'photo', label: 'Photo', hint: 'Capture', Glyph: PhotoIcon },
  { key: 'gallery', label: 'Gallery', hint: 'Upload', Glyph: GalleryIcon },
  { key: 'live', label: 'Live', hint: 'Stream', Glyph: LiveIcon },
];

const privacyOptions = [
  { key: 'public', label: 'Everyone', Glyph: GlobeIcon },
  { key: 'friends', label: 'Followers', Glyph: UsersIcon },
  { key: 'private', label: 'Only me', Glyph: LockIcon },
];

const suggestedTags = ['#comedy', '#standup', '#liveshow', '#backstage', '#fyp'];

const blobToDataUrl = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

function UploadPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const recorderRef = useRef(null);

  const [activeTab, setActiveTab] = useState('video');
  const [screen, setScreen] = useState('camera');
  const [stream, setStream] = useState(null);
  const [cameraFacing, setCameraFacing] = useState('user');
  const [cameraLoading, setCameraLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('video');
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('Ready to capture.');
  const [uploading, setUploading] = useState(false);

  /* display-only UI state (no functional change) */
  const [elapsed, setElapsed] = useState(0);
  const [privacy, setPrivacy] = useState('public');
  const [allowComments, setAllowComments] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [comedian, setComedian] = useState(false);
  const [liveStarting, setLiveStarting] = useState(false);
  const [liveRoomId, setLiveRoomId] = useState('');
  const [liveTitle, setLiveTitle] = useState('');
  const [liveDescription, setLiveDescription] = useState('');
  const [liveFormat, setLiveFormat] = useState('standup');
  const [liveVisibility, setLiveVisibility] = useState('public');

  useEffect(() => {
    getProfileSummary().then((profile) => setComedian(profile.user?.accountType === 'comedian')).catch(() => setComedian(false));
  }, []);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(() => {});
  }, [stream]);

  useEffect(() => {
    if (screen === 'camera' && activeTab !== 'gallery' && activeTab !== 'live') {
      openCamera(activeTab);
    }
    return stopCamera;
  }, [screen, activeTab]);

  useEffect(() => {
    if (!recording) {
      setElapsed(0);
      return undefined;
    }
    const id = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  /* cosmetic progress bar while the real request is in flight */
  useEffect(() => {
    if (!uploading) {
      setProgress(0);
      return undefined;
    }
    setProgress(8);
    const id = window.setInterval(() => setProgress((v) => (v < 92 ? v + Math.max(1, (92 - v) * 0.08) : v)), 220);
    return () => window.clearInterval(id);
  }, [uploading]);

  const stopCamera = () => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const openCamera = async (mode, facing = cameraFacing) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Camera unavailable.');
      return;
    }

    setCameraLoading(true);
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
        audio: mode === 'video',
      });
      setStream(cameraStream);
      setStatus(facing === 'user' ? 'Front camera ready.' : 'Back camera ready.');
    } catch (error) {
      setStatus('Allow camera access to capture content.');
    } finally {
      setCameraLoading(false);
    }
  };

  const switchCamera = async () => {
    if (recording || cameraLoading) return;
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    stopCamera();
    setCameraFacing(nextFacing);
    await openCamera(activeTab, nextFacing);
  };

  const handleOption = (key) => {
    setActiveTab(key);
    if (key === 'gallery') {
      setScreen('gallery');
      fileInputRef.current?.click();
      return;
    }
    if (key === 'live') {
      if (!comedian) {
        setStatus('Complete Try Comedy on your profile before going live.');
        navigate('/profile');
        return;
      }
      setScreen('live');
      setStatus('Live ready.');
      stopCamera();
      return;
    }
    setScreen('camera');
    setStatus('Ready to capture.');
  };

  const prepareLiveRoom = async () => {
    if (!liveTitle.trim()) {
      setStatus('Add a room title before going live.');
      return;
    }
    setLiveStarting(true);
    try {
      const result = await createLiveRoom({ title: liveTitle, description: liveDescription, format: liveFormat, visibility: liveVisibility });
      setLiveRoomId(result.room.id);
      setStatus('Room ready. Check your setup, then start live.');
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to prepare the live room.');
    } finally {
      setLiveStarting(false);
    }
  };

  const startPreparedLive = async () => {
    if (!liveRoomId) return prepareLiveRoom();
    setLiveStarting(true);
    try {
      await startLiveRoom(liveRoomId);
      setStatus('Live room started. Your audience can join now.');
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to start the live room.');
    } finally {
      setLiveStarting(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreviewType('photo');
    setPreviewUrl(dataUrl);
    setScreen('preview');
    setStatus('Photo captured.');
    stopCamera();
  };

  const getRecordingMimeType = () => {
    const candidates = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
      'video/ogg',
    ];
    for (const candidate of candidates) {
      if (MediaRecorder.isTypeSupported(candidate)) {
        return candidate;
      }
    }
    return '';
  };

  const startRecording = () => {
    if (!stream || !window.MediaRecorder) {
      setStatus('Recording not supported.');
      return;
    }

    const mimeType = getRecordingMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      const recordedType = recorder.mimeType || mimeType || 'video/webm';
      const blob = new Blob(chunks, { type: recordedType });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewType('video');
      setScreen('preview');
      setStatus('Video recorded.');
      stopCamera();

      setTimeout(() => {
        const previewElement = previewVideoRef.current;
        if (previewElement) {
          previewElement.load();
          previewElement.play().catch(() => {});
        }
      }, 0);
    };
    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
    setStatus('Recording...');
  };

  const stopRecording = () => {
    recorderRef.current?.requestData();
    recorderRef.current?.stop();
    setRecording(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith('image/') ? 'photo' : 'video');
    setScreen('preview');
    setStatus('Selected from gallery.');
  };

  /* drag & drop reuses the exact same selection logic */
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith('image/') ? 'photo' : 'video');
    setScreen('preview');
    setStatus('Selected from gallery.');
  };

  const handlePublish = async () => {
    if (!previewUrl) {
      setStatus('Capture or select media first.');
      return;
    }

    setUploading(true);
    setStatus('Posting...');

    try {
      await uploadVideoPost({
        title: caption || 'New clip',
        category: previewType === 'video' ? 'Video' : 'Photo',
        description: caption,
        mediaUrl: previewUrl,
        thumbnailUrl: previewUrl,
        type: previewType,
      });
      setStatus('Uploaded.');
      setPreviewUrl('');
      setCaption('');
      setScreen('camera');
      setActiveTab('video');
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const resetToCamera = () => {
    setPreviewUrl('');
    setCaption('');
    setScreen('camera');
    setActiveTab('video');
    setStatus('Ready to capture.');
  };

  const stageLabel =
    screen === 'preview'
      ? 'Preview'
      : screen === 'live'
        ? 'Live'
        : `${activeTab === 'photo' ? 'Photo' : 'Video'} mode`;

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const stepIndex = screen === 'preview' ? 2 : 1;
  const canPost = Boolean(previewUrl) && !uploading;

  return (
    <DashboardShell title={comedian ? 'Comedian Studio' : 'Create'} subtitle={comedian ? 'Prepare your next performance on Ochi Live.' : 'Create posts now. Complete Try Comedy to unlock live rooms.'}>
      <style>{`
        @keyframes up-fade-in { from { opacity: 0; transform: translateY(10px) scale(.995); } to { opacity: 1; transform: none; } }
        @keyframes up-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes up-ring { 0% { transform: scale(1); opacity: .55; } 100% { transform: scale(1.55); opacity: 0; } }
        @keyframes up-sheen { 0% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
        @keyframes up-bar { 0% { background-position: 0 0; } 100% { background-position: 32px 0; } }
        .up-stage-in { animation: up-fade-in .55s cubic-bezier(.22,.85,.24,1) both; }
        .up-rise { animation: up-rise .5s cubic-bezier(.22,.85,.24,1) both; }
        .up-d1 { animation-delay: .06s; } .up-d2 { animation-delay: .12s; } .up-d3 { animation-delay: .18s; }
        .up-ring { animation: up-ring 1.6s ease-out infinite; }
        .up-sheen::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,.22) 50%, transparent 80%);
          animation: up-sheen 2.6s ease-in-out infinite;
        }
        .up-bar-stripes {
          background-image: linear-gradient(115deg, rgba(255,255,255,.28) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.28) 50%, rgba(255,255,255,.28) 75%, transparent 75%);
          background-size: 32px 32px;
          animation: up-bar .9s linear infinite;
        }
        .up-scroll::-webkit-scrollbar { width: 6px; }
        .up-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 99px; }
        @media (prefers-reduced-motion: reduce) {
          .up-stage-in, .up-rise, .up-ring, .up-sheen::after, .up-bar-stripes { animation: none !important; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-950 text-white">
        {/* ambient depth */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="absolute -right-24 bottom-[-10%] h-80 w-80 rounded-full bg-slate-500/10 blur-3xl" />
        </div>

        {/* ---------------- Header ---------------- */}
        <header className="relative z-10 flex shrink-0 items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              navigate(-1);
            }}
            aria-label="Close upload"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
          >
            <CloseIcon />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-slate-500">{comedian ? 'Comedian Studio' : 'Creator Studio'}</p>
            <h1 className="truncate text-sm font-semibold tracking-tight text-white">{screen === 'live' ? 'Prepare a live room' : 'Create a post'}</h1>
          </div>

          {/* step indicator — Capture → Details → Publish */}
          <nav aria-label="Progress" className="hidden items-center gap-2 md:flex">
            {['Capture', 'Details', 'Publish'].map((label, i) => {
              const n = i + 1;
              const done = n < stepIndex;
              const active = n === stepIndex;
              return (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide transition-all duration-300 ${
                      active
                        ? 'border-rose-400/40 bg-rose-500/15 text-white'
                        : done
                          ? 'border-white/10 bg-white/5 text-slate-300'
                          : 'border-white/10 bg-transparent text-slate-500'
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                        active ? 'bg-rose-500 text-white' : done ? 'bg-white/15 text-white' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {done ? <CheckIcon className="h-2.5 w-2.5" /> : n}
                    </span>
                    {label}
                  </span>
                  {n < 3 && <span className="h-px w-4 bg-white/10" />}
                </span>
              );
            })}
          </nav>

          <span className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-slate-300 sm:inline-flex md:hidden">
            <span className={`h-1.5 w-1.5 rounded-full ${screen === 'preview' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {stageLabel}
          </span>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPost}
            className="hidden shrink-0 items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 lg:inline-flex"
          >
            {uploading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <CheckIcon className="h-4 w-4" />
            )}
            {uploading ? 'Posting…' : 'Post'}
          </button>
        </header>

        {!comedian ? <div className="relative z-10 mx-4 mt-3 border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 sm:mx-6"><span className="font-semibold">Live access is locked.</span> Complete Try Comedy on your profile to perform live. <button type="button" onClick={() => navigate('/profile')} className="ml-1 font-semibold underline">Open profile</button></div> : null}

        {/* upload progress rail */}
        <div className="relative z-10 h-0.5 w-full shrink-0 bg-white/5">
          <div
            className={`h-full rounded-r-full bg-rose-500 transition-[width] duration-300 ease-out ${uploading ? 'up-bar-stripes' : ''}`}
            style={{ width: `${uploading ? progress : 0}%` }}
          />
        </div>

        {/* ---------------- Body ---------------- */}
        <main className="relative z-10 flex min-h-0 flex-1 flex-col lg:mx-auto lg:w-full lg:max-w-[1200px] lg:flex-row lg:gap-6 lg:p-6">
          {/* left rail — desktop mode switcher (TikTok/Twitch style) */}
          <aside className="hidden shrink-0 flex-col gap-2 lg:flex" aria-label="Upload mode">
            {options.filter((option) => comedian || option.key !== 'live').map((option) => {
              const active = activeTab === option.key;
              const { Glyph } = option;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleOption(option.key)}
                  className={`group relative flex w-[78px] flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 ${
                    active
                      ? 'border-white/15 bg-white/10 text-white shadow-lg shadow-black/40'
                      : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 h-7 -translate-y-1/2 rounded-r-full bg-rose-500 transition-all duration-300 ${
                      active ? 'w-[3px] opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                  <Glyph
                    className={`h-[22px] w-[22px] transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
                  />
                  <span className="text-[11px] font-semibold tracking-tight">{option.label}</span>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">{option.hint}</span>
                </button>
              );
            })}
          </aside>

          {/* Stage */}
          <section
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`relative min-h-0 flex-1 overflow-hidden bg-black transition-all duration-300 lg:h-auto lg:min-h-0 lg:flex-1 lg:shrink lg:rounded-[28px] lg:border lg:shadow-2xl lg:shadow-black/40 ${
              dragging ? 'lg:border-rose-400/60 lg:ring-2 lg:ring-rose-400/30' : 'lg:border-white/10'
            }`}
          >
            {screen === 'camera' && (
              <video key="cam" ref={videoRef} className={`up-stage-in h-full w-full object-cover ${cameraFacing === 'user' ? '-scale-x-100' : ''}`} muted playsInline autoPlay />
            )}

            {screen === 'preview' &&
              previewUrl &&
              (previewType === 'video' ? (
                <video
                  ref={previewVideoRef}
                  src={previewUrl}
                  controls
                  playsInline
                  className="up-stage-in h-full w-full object-cover"
                />
              ) : (
                <img key="pi" src={previewUrl} alt="Preview" className="up-stage-in h-full w-full object-cover" />
              ))}

            {screen === 'live' && (
              <div key="live" className="up-stage-in flex h-full items-center justify-center bg-slate-950 px-6 text-center">
                <div className="space-y-5">
                  <div className="relative mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10 text-rose-300">
                    <span className="up-ring absolute inset-0 rounded-full border border-rose-400/40" />
                    <LiveIcon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Go Live</h2>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-400">
                      Broadcast in real time to your audience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {screen === 'gallery' && !previewUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="up-stage-in flex h-full w-full flex-col items-center justify-center gap-5 bg-slate-950 px-6 text-center transition hover:bg-slate-900/60"
              >
                <span
                  className={`inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-dashed transition-all duration-300 ${
                    dragging ? 'scale-105 border-rose-400/70 bg-rose-500/10 text-rose-200' : 'border-white/20 bg-white/5 text-slate-300'
                  }`}
                >
                  <UploadCloudIcon className="h-8 w-8" />
                </span>
                <span className="space-y-1.5">
                  <span className="block text-base font-semibold text-white">
                    {dragging ? 'Drop to upload' : 'Select a file to upload'}
                  </span>
                  <span className="block text-sm text-slate-400">Or drag and drop it here</span>
                </span>
                <span className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">MP4 · MOV · WEBM</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">JPG · PNG</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Up to 10 min</span>
                </span>
              </button>
            )}

            {/* drag overlay */}
            {dragging && screen !== 'gallery' && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-rose-400/50 px-8 py-6 text-rose-100">
                  <UploadCloudIcon className="h-7 w-7" />
                  <p className="text-sm font-semibold">Drop your file to upload</p>
                </div>
              </div>
            )}

            {/* stage chrome */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-3">
              <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-100 backdrop-blur">
                {stageLabel}
              </span>
              {recording && (
                <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/90 px-3 py-1 text-[11px] font-semibold tabular-nums tracking-wide text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  {mmss}
                </span>
              )}
            </div>
            {screen === 'camera' ? (
              <button
                type="button"
                onClick={switchCamera}
                disabled={recording || cameraLoading}
                aria-label={`Switch to ${cameraFacing === 'user' ? 'back' : 'front'} camera`}
                className="absolute right-4 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-lg" aria-hidden="true">↻</span>
              </button>
            ) : null}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
          </section>

          {/* Controls / details */}
          <section className="up-scroll absolute inset-x-0 bottom-0 z-20 max-h-[34dvh] min-h-0 overflow-y-auto rounded-t-2xl border-t border-white/15 bg-slate-950/90 px-3 pb-[calc(.65rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-6 lg:relative lg:inset-auto lg:max-h-none lg:w-[380px] lg:flex-none lg:rounded-[28px] lg:border lg:px-5 lg:py-5 lg:shadow-none">
            {/* mobile mode switcher */}
            <div
              role="tablist"
              aria-label="Upload mode"
              className={`grid gap-0.5 rounded-xl border border-white/10 bg-white/5 p-0.5 lg:hidden ${comedian ? 'grid-cols-4' : 'grid-cols-3'}`}
            >
              {options.filter((option) => comedian || option.key !== 'live').map((option) => {
                const active = activeTab === option.key;
                const { Glyph } = option;
                return (
                  <button
                    key={option.key}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => handleOption(option.key)}
                    className={`group flex flex-row items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 sm:flex-col sm:gap-1.5 sm:py-2.5 ${
                      active ? 'bg-white/10 text-white shadow-lg shadow-black/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Glyph className={`h-4 w-4 shrink-0 transition-transform duration-300 sm:h-5 sm:w-5 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                    <span className="text-[10px] font-semibold tracking-tight sm:text-[11px]">{option.label}</span>
                    <span className={`h-0.5 w-5 rounded-full transition-all duration-300 ${active ? 'bg-rose-500 opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>

            {/* contextual panel */}
            <div className="mt-4 lg:mt-0">
              {screen === 'preview' ? (
                <div key="p-preview" className="space-y-3">
                  {/* caption */}
                  <div className="up-rise rounded-[28px] border border-white/10 bg-slate-950/90 p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.85)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Caption</p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                          Add hashtags and a short description that feels polished and on-brand.
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        {previewType}
                      </span>
                    </div>

                    <div className="relative mt-4">
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        rows={4}
                        maxLength={200}
                        placeholder="Write a caption with hashtags and a strong hook…"
                        className="w-full min-h-[140px] resize-none rounded-[24px] border border-white/10 bg-slate-950/90 px-4 py-4 text-sm leading-6 text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-rose-400/50 focus:ring-2 focus:ring-rose-400/15"
                      />
                      <span className="pointer-events-none absolute bottom-3 right-3 text-xs font-medium tabular-nums text-slate-500">
                        {caption.length}/200
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            setCaption((c) =>
                              (c.includes(tag) ? c : `${c}${c && !c.endsWith(' ') ? ' ' : ''}${tag} `).slice(0, 200),
                            )
                          }
                          className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* audience */}
                  <div className="up-rise up-d1 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-white">Who can watch</p>
                    <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1.5">
                      {privacyOptions.map((opt) => {
                        const active = privacy === opt.key;
                        const { Glyph } = opt;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setPrivacy(opt.key)}
                            className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 ${
                              active ? 'bg-white/10 text-white shadow-lg shadow-black/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                          >
                            <Glyph className="h-4 w-4" />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-3">
                      <span className="text-sm text-slate-300">Allow comments</span>
                      <span className="relative inline-flex">
                        <input
                          type="checkbox"
                          checked={allowComments}
                          onChange={(e) => setAllowComments(e.target.checked)}
                          className="peer sr-only"
                        />
                        <span className="h-6 w-11 rounded-full bg-white/10 transition-colors duration-300 peer-checked:bg-rose-500 peer-focus-visible:ring-2 peer-focus-visible:ring-rose-400/50" />
                        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 peer-checked:translate-x-5" />
                      </span>
                    </label>
                  </div>

                  {/* actions */}
                  <div className="up-rise up-d2 flex gap-2.5">
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={uploading}
                      className={`relative flex-1 overflow-hidden rounded-xl bg-rose-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 disabled:cursor-not-allowed disabled:bg-rose-500/50 ${
                        uploading ? '' : 'up-sheen'
                      }`}
                    >
                      <span className="relative inline-flex items-center justify-center gap-2">
                        {uploading ? (
                          <>
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Posting… {Math.round(progress)}%
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            Post
                          </>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={resetToCamera}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <RetakeIcon className="h-4 w-4" />
                      Retake
                    </button>
                  </div>
                </div>
              ) : screen === 'live' ? (
                <div key="p-live" className="up-rise space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Live room setup</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      Give your audience a reason to join before you start.
                    </p>
                  </div>
                  <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Room title
                    <input value={liveTitle} onChange={(event) => { setLiveTitle(event.target.value); setLiveRoomId(''); }} maxLength={80} placeholder="Late-night crowd work" className="mt-2 w-full border border-white/10 bg-slate-950 px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none placeholder:text-slate-600 focus:border-rose-400" />
                  </label>
                  <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Description
                    <textarea value={liveDescription} onChange={(event) => setLiveDescription(event.target.value)} maxLength={280} rows={2} placeholder="Tell people what kind of room this is." className="mt-2 w-full resize-none border border-white/10 bg-slate-950 px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none placeholder:text-slate-600 focus:border-rose-400" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Format<select value={liveFormat} onChange={(event) => setLiveFormat(event.target.value)} className="mt-2 w-full border border-white/10 bg-slate-950 px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none"><option value="standup">Stand-up</option><option value="sketch">Sketch</option><option value="storytelling">Storytelling</option><option value="crowd-work">Crowd work</option><option value="open-mic">Open mic</option></select></label>
                    <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Audience<select value={liveVisibility} onChange={(event) => setLiveVisibility(event.target.value)} className="mt-2 w-full border border-white/10 bg-slate-950 px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none"><option value="public">Everyone</option><option value="followers">Followers</option><option value="private">Only me</option></select></label>
                  </div>
                  <ul className="space-y-2">
                    {['Camera', 'Microphone', 'Network'].map((item, i) => (
                      <li
                        key={item}
                        className={`up-rise up-d${i + 1} flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-300`}
                      >
                        {item}
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Ready
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={liveStarting}
                    onClick={startPreparedLive}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
                  >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    {liveStarting ? (liveRoomId ? 'Starting room...' : 'Preparing room...') : liveRoomId ? 'Start live room' : 'Prepare live room'}
                  </button>
                </div>
              ) : screen === 'gallery' ? (
                <div key="p-gallery" className="up-rise space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Upload from device</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">Choose a photo or video, or drop it on the canvas.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <UploadCloudIcon className="h-4 w-4" />
                    Browse files
                  </button>
                  <ul className="space-y-1.5 text-[12px] leading-relaxed text-slate-500">
                    <li className="flex items-center gap-2">
                      <ChevronIcon className="h-3 w-3 text-slate-600" /> Vertical 9:16 performs best
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronIcon className="h-3 w-3 text-slate-600" /> 1080p or higher recommended
                    </li>
                  </ul>
                </div>
              ) : (
                <div key="p-camera" className="up-rise rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {activeTab === 'photo' ? 'Snap a photo' : recording ? 'Recording' : 'Record a video'}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                        {activeTab === 'photo'
                          ? 'Press the shutter to capture.'
                          : recording
                            ? 'Tap again to stop and review.'
                            : 'Tap to start capturing.'}
                      </p>
                    </div>
                    <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                      <SparkIcon className="h-3 w-3" />
                      HD
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleOption('gallery')}
                      aria-label="Open gallery"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <GalleryIcon className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      aria-label={activeTab === 'photo' ? 'Take photo' : recording ? 'Stop recording' : 'Start recording'}
                      onClick={activeTab === 'photo' ? takePhoto : recording ? stopRecording : startRecording}
                      className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
                    >
                      {recording && <span className="up-ring absolute inset-0 rounded-full border-2 border-rose-500/60" />}
                      <span className="absolute inset-1 rounded-full bg-white shadow-2xl shadow-black/40 transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-95" />
                      <span
                        className={`relative transition-all duration-300 ${
                          recording ? 'h-4 w-4 rounded-[5px] bg-slate-950' : 'h-4 w-4 rounded-full bg-rose-500'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOption(activeTab === 'photo' ? 'video' : 'photo')}
                      aria-label="Switch capture mode"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <RetakeIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {recording && (
                    <p className="mt-4 text-center text-[11px] font-semibold tabular-nums tracking-[0.2em] text-rose-300">{mmss}</p>
                  )}
                </div>
              )}
            </div>

            {status && (
              <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">{status}</p>
            )}
          </section>
        </main>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
      <canvas ref={canvasRef} className="hidden" />
    </DashboardShell>
  );
}

export default UploadPage;
