import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';

function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const client = io(SOCKET_URL, {
      transports: ['websocket'],
      path: '/socket.io',
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
