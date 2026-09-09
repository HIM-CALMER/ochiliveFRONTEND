import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Room, RoomEvent } from 'livekit-client';
import DashboardShell from '../components/DashboardShell';
import { getLiveRoomViewerToken } from '../api/dashboardApi';

const actionButtonClass = 'flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-slate-950/55 text-lg text-white shadow-[0_16px_32px_rgba(15,23,42,0.35)] backdrop-blur-md transition hover:scale-105 hover:border-rose-300/40';

function RemoteVideoCard({ participant }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    const node = viewerRef.current;
    if (!node || !participant?.videoTrack) {
      return undefined;
    }

    const mediaElement = participant.videoTrack.attach();
    mediaElement.muted = true;
    mediaElement.autoplay = true;
    mediaElement.playsInline = true;
    mediaElement.style.width = '100%';
    mediaElement.style.height = '100%';
    mediaElement.style.objectFit = 'cover';
    node.innerHTML = '';
    node.appendChild(mediaElement);

    return () => {
      participant.videoTrack.detach();
      if (node) {
        node.innerHTML = '';
      }
    };
  }, [participant?.id, participant?.videoTrack]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-slate-950">
      <div ref={viewerRef} className="h-full w-full" />
      {!participant?.videoTrack ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-center text-sm text-slate-300">
          Waiting for the host to start streaming...
        </div>
      ) : null}
    </div>
  );
}

export default function LiveViewerPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const roomRef = useRef(null);
  const [status, setStatus] = useState('Connecting to stream...');
  const [participants, setParticipants] = useState([]);
  const [roomMeta, setRoomMeta] = useState(null);

  useEffect(() => {
    let isUnmounted = false;

    const syncParticipants = (room) => {
      const nextParticipants = Array.from(room.remoteParticipants.values()).map((participant) => {
        const videoPublication = Array.from(participant.videoTrackPublications.values()).find((publication) => publication?.track && publication.isSubscribed);
        return {
          id: participant.identity,
          name: participant.name || participant.identity,
          videoTrack: videoPublication?.track || null,
        };
      });
      if (!isUnmounted) {
        setParticipants(nextParticipants);
      }
    };

    const joinRoom = async () => {
      if (!roomId) {
        setStatus('No room selected.');
        return;
      }

      try {
        const data = await getLiveRoomViewerToken(roomId);
        if (isUnmounted) return;
        setRoomMeta(data);

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: { width: 1280, height: 720 },
          },
        });

        roomRef.current = room;

        room.on(RoomEvent.ParticipantConnected, () => syncParticipants(room));
        room.on(RoomEvent.ParticipantDisconnected, () => syncParticipants(room));
        room.on(RoomEvent.TrackSubscribed, () => syncParticipants(room));
        room.on(RoomEvent.TrackUnsubscribed, () => syncParticipants(room));
        room.on(RoomEvent.Disconnected, () => {
          if (!isUnmounted) {
            setStatus('The stream has ended.');
          }
        });

        await room.connect(data.livekitUrl, data.token);
        if (isUnmounted) return;

        syncParticipants(room);
        setStatus(room.remoteParticipants.size ? 'Live stream connected.' : 'Waiting for the host to start streaming...');
      } catch (error) {
        if (!isUnmounted) {
          setStatus(error?.response?.data?.message || error?.message || 'Unable to join this live room.');
        }
      }
    };

    joinRoom();

    return () => {
      isUnmounted = true;
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [roomId]);

  const primaryParticipant = participants[0] || null;

  const hostLabel = (roomMeta?.roomName || 'Live room').split(' ')[0] || 'Creator';

  return (
    <DashboardShell
      title={roomMeta?.roomName || 'Live Room'}
      subtitle="Watching a live Ochi session"
      showBack
      backFallback="/discover"
    >
      <div className="mx-auto max-w-5xl space-y-5 px-3 sm:px-0">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-3 shadow-[0_25px_80px_rgba(15,23,42,0.38)] sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300 text-sm font-bold text-slate-950">
                {hostLabel.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Live now</p>
                <h2 className="mt-1 text-lg font-semibold text-white sm:text-2xl">{roomMeta?.roomName || 'Room stream'}</h2>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-200">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Live
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
            {primaryParticipant ? (
              <RemoteVideoCard participant={primaryParticipant} />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-base text-slate-300">
                {status}
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                LIVE
              </div>
              <div className="rounded-full border border-white/10 bg-slate-950/45 px-2.5 py-1 text-[10px] font-medium text-slate-100 backdrop-blur-sm">
                {participants.length ? `${participants.length} watching` : 'Waiting'}
              </div>
            </div>

            <div className="absolute bottom-4 right-3 flex flex-col gap-3 sm:bottom-5 sm:right-4">
              <button type="button" className={actionButtonClass} aria-label="Like stream">♡</button>
              <button type="button" className={actionButtonClass} aria-label="Comment on stream">💬</button>
              <button type="button" className={actionButtonClass} aria-label="Share stream">↗</button>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-3 shadow-[0_16px_44px_rgba(15,23,42,0.35)] backdrop-blur-md sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Now featuring</p>
                    <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{roomMeta?.roomName || 'Live performance'}</h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200"
                  >
                    Follow
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200/90">
                  A live room built for comedy, conversations, and real-time audience energy. Join in and watch the stream as it unfolds.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-300">
              {participants.length ? `${participants.length} viewer${participants.length === 1 ? '' : 's'} connected` : 'Waiting for audience activity'}
            </div>
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-700"
            >
              Browse more live rooms
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
