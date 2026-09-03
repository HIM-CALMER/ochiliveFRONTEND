import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useMessageSocket = (conversationId, callbacks = {}) => {
  const socketRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!conversationId) return;

    const token = sessionStorage.getItem('ochi_token');
    if (!token) return;

    // Connect if not already connected
    if (!socketRef.current) {
      socketRef.current = io({
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
    }

    const socket = socketRef.current;

    // Connection event
    socket.on('connect', () => {
      connectedRef.current = true;
      console.log('Socket connected for messaging');
      // Join conversation room
      socket.emit('message:join-conversation', { conversationId });
    });

    // Listen for new messages
    socket.on('message:received', (data) => {
      if (callbacks.onMessageReceived) {
        callbacks.onMessageReceived(data.message);
      }
    });

    // Listen for typing indicators
    socket.on('message:user-typing', (data) => {
      if (callbacks.onTypingIndicator) {
        callbacks.onTypingIndicator(data);
      }
    });

    // Listen for reactions
    socket.on('message:reaction-added', (data) => {
      if (callbacks.onReactionAdded) {
        callbacks.onReactionAdded(data);
      }
    });

    // Listen for read receipts
    socket.on('message:marked-read', (data) => {
      if (callbacks.onMessageRead) {
        callbacks.onMessageRead(data);
      }
    });

    // Disconnection event
    socket.on('disconnect', () => {
      connectedRef.current = false;
      console.log('Socket disconnected from messaging');
    });

    return () => {
      if (socket) {
        socket.emit('message:leave-conversation', { conversationId });
      }
    };
  }, [conversationId, callbacks]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (socketRef.current && connectedRef.current) {
      socketRef.current.emit('message:typing', {
        conversationId,
        userId: sessionStorage.getItem('ochi_user')
          ? JSON.parse(sessionStorage.getItem('ochi_user')).id
          : null,
        isTyping,
      });
    }
  }, [conversationId]);

  // Send message via socket
  const sendMessageViaSocket = useCallback((message) => {
    if (socketRef.current && connectedRef.current) {
      socketRef.current.emit('message:new-message', {
        conversationId,
        message,
      });
    }
  }, [conversationId]);

  // Send reaction
  const sendReaction = useCallback((messageId, emoji) => {
    if (socketRef.current && connectedRef.current) {
      socketRef.current.emit('message:reaction', {
        conversationId,
        messageId,
        emoji,
        userId: sessionStorage.getItem('ochi_user')
          ? JSON.parse(sessionStorage.getItem('ochi_user')).id
          : null,
      });
    }
  }, [conversationId]);

  // Send read receipt
  const sendReadReceipt = useCallback((messageId) => {
    if (socketRef.current && connectedRef.current) {
      socketRef.current.emit('message:read', {
        conversationId,
        messageId,
        userId: sessionStorage.getItem('ochi_user')
          ? JSON.parse(sessionStorage.getItem('ochi_user')).id
          : null,
      });
    }
  }, [conversationId]);

  return {
    socket: socketRef.current,
    isConnected: connectedRef.current,
    sendTypingIndicator,
    sendMessageViaSocket,
    sendReaction,
    sendReadReceipt,
  };
};

export default useMessageSocket;
