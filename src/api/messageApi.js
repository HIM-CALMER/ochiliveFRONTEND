const API_BASE = '/api/messages';

const getAuthHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem('ochi_token')}`,
  'Content-Type': 'application/json',
});

export const messageApi = {
  // Send a message
  sendMessage: async (receiverId, text, mediaUrl = '', mediaType = '') => {
    const response = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        receiverId,
        text,
        mediaUrl,
        mediaType,
      }),
    });
    return response.json();
  },

  // Get conversations with optional tab filter
  getConversations: async (tab = 'messages') => {
    const response = await fetch(`${API_BASE}/conversations?tab=${tab}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get messages in a conversation
  getMessages: async (conversationId, limit = 50, skip = 0) => {
    const response = await fetch(
      `${API_BASE}/conversation/${conversationId}?limit=${limit}&skip=${skip}`,
      { headers: getAuthHeader() }
    );
    return response.json();
  },

  // Accept a message request
  acceptMessageRequest: async (conversationId) => {
    const response = await fetch(`${API_BASE}/accept/${conversationId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Delete/Reject a conversation
  deleteConversation: async (conversationId) => {
    const response = await fetch(`${API_BASE}/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await fetch(`${API_BASE}/unread-count`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Block a user
  blockUser: async (targetUserId) => {
    const response = await fetch(`${API_BASE}/block`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ targetUserId }),
    });
    return response.json();
  },

  // ===== ADVANCED FEATURES =====

  // Add/remove reaction to message
  addReaction: async (messageId, emoji) => {
    const response = await fetch(`${API_BASE}/reaction`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ messageId, emoji }),
    });
    return response.json();
  },

  // Mark message as read
  markMessageAsRead: async (messageId) => {
    const response = await fetch(`${API_BASE}/mark-read/${messageId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Set typing indicator
  setTypingIndicator: async (conversationId, isTyping) => {
    const response = await fetch(`${API_BASE}/typing`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ conversationId, isTyping }),
    });
    return response.json();
  },

  // Toggle notification mute
  toggleNotificationMute: async (conversationId) => {
    const response = await fetch(`${API_BASE}/mute/${conversationId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

export default messageApi;
