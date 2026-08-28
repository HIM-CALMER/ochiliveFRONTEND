import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('ochi_token');
    if (!token) return undefined;
    const client = io(SOCKET_URL, {
      transports: ['websocket'],
      path: '/socket.io',
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    setSocket(client);

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  return socket;
}

export default useSocket;
