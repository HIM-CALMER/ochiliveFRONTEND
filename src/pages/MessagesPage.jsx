import { useEffect, useState, useRef } from 'react';
import DashboardShell from '../components/DashboardShell';
import { messageApi } from '../api/messageApi';
import { useMessageSocket } from '../hooks/useMessageSocket';

const TABS = [
  { id: 'messages', label: 'Inbox', icon: 'messages', count: 0 },
  { id: 'connections', label: 'Connections', icon: 'connections', count: 0 },
  { id: 'requests', label: 'Requests', icon: 'requests', count: 0 },
];

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '✨'];

function Icon({ name, className }) {
  switch (name) {
    case 'messages':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'connections':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M3 15s1.5-3 6-3 6 3 6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="19" cy="7" r="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M15.5 13s1-2 3.5-2 3.5 2 3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'requests':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function MessageReactions({ message, onAddReaction }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!message.reactions) return null;

  const reactionGrouped = {};
  message.reactions.forEach((r) => {
    if (!reactionGrouped[r.emoji]) {
      reactionGrouped[r.emoji] = 0;
    }
    reactionGrouped[r.emoji]++;
  });

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {Object.entries(reactionGrouped).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onAddReaction(message._id, emoji)}
          className="inline-flex items-center gap-1 rounded-full bg-slate-700/50 px-2 py-1 text-xs hover:bg-slate-700 transition"
        >
          <span>{emoji}</span>
          <span className="text-slate-400">{count}</span>
        </button>
      ))}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="rounded-full bg-slate-700/30 px-2 py-1 text-xs hover:bg-slate-700/50 transition"
      >
        😊
      </button>
      {showEmojiPicker && (
        <div className="absolute bg-slate-800 rounded-lg p-2 grid grid-cols-4 gap-1 z-50">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onAddReaction(message._id, emoji);
                setShowEmojiPicker(false);
              }}
              className="text-lg hover:scale-125 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Message({ message, sessionUser, onAddReaction }) {
  const isOwn = message.senderId === sessionUser.id;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isOwn && (
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-rose-400 flex items-center justify-center text-xs font-bold text-white">
          {message.senderUsername?.[0]?.toUpperCase() || 'U'}
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md rounded-xl px-3 py-2 ${isOwn ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
        {!isOwn && <p className="text-xs font-semibold text-slate-300 mb-1">{message.senderName}</p>}

        {message.mediaUrl && message.mediaType?.includes('image') && (
          <img src={message.mediaUrl} alt="message media" className="rounded-lg max-w-xs mb-2" />
        )}

        {message.text && <p className="text-sm break-words">{message.text}</p>}

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className={`text-xs ${isOwn ? 'text-violet-200' : 'text-slate-500'}`}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {isOwn && message.isRead && (
            <span className="text-violet-200 text-xs">✓✓</span>
          )}
        </div>

        <MessageReactions message={message} onAddReaction={onAddReaction} />
      </div>

      {isOwn && (
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-rose-400 flex items-center justify-center text-xs font-bold text-white">
          {sessionUser.username?.[0]?.toUpperCase() || 'Y'}
        </div>
      )}
    </div>
  );
}

function MessagesPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  // Get session user
  const sessionUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('ochi_user') || '{}');
    } catch {
      return {};
    }
  })();

  // WebSocket integration
  const { sendTypingIndicator, sendReaction, sendReadReceipt } = useMessageSocket(
    selectedConversation?.conversationId,
    {
      onTypingIndicator: (data) => {
        if (data.userId !== sessionUser.id) {
          setTypingUsers((prev) => ({
            ...prev,
            [data.userId]: data.isTyping,
          }));
        }
      },
      onReactionAdded: (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, reactions: msg.reactions || [] } : msg
          )
        );
      },
      onMessageRead: (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, isRead: true, readAt: data.readAt } : msg
          )
        );
      },
    }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await messageApi.getConversations(activeTab);
        setConversations(data.data || []);
        setSelectedConversation(null);
        setMessages([]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [activeTab]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      setChatLoading(true);
      try {
        const data = await messageApi.getMessages(selectedConversation.conversationId);
        setMessages(data.data || []);

        // Send read receipts for first unread message
        const firstUnread = data.data?.find((m) => !m.isRead && m.receiverId === sessionUser.id);
        if (firstUnread) {
          sendReadReceipt(firstUnread._id);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setChatLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, sessionUser.id, sendReadReceipt]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const response = await messageApi.sendMessage(selectedConversation.otherUser.id, messageText);

      if (response.success) {
        setMessageText('');
        sendTypingIndicator(false);

        // Refresh messages
        const data = await messageApi.getMessages(selectedConversation.conversationId);
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Send typing indicator
    sendTypingIndicator(true);

    // Set timeout to stop typing indicator
    const timeout = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleAcceptRequest = async () => {
    if (!selectedConversation) return;

    try {
      const response = await messageApi.acceptMessageRequest(selectedConversation.conversationId);
      if (response.success) {
        setSelectedConversation((prev) => ({ ...prev, isAccepted: true }));
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleAddReaction = async (messageId, emoji) => {
    try {
      await messageApi.addReaction(messageId, emoji);
      sendReaction(messageId, emoji);

      // Update local state
      const data = await messageApi.getMessages(selectedConversation.conversationId);
      setMessages(data.data || []);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <DashboardShell
      title="Messages"
      subtitle="Connect with your audience and collaborate with creators"
      showSearch={false}
      showBack={false}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr] h-[calc(100vh-200px)]">
        {/* Conversations Sidebar */}
        <div className="space-y-2 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-slate-800 pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 px-2 py-1 text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-violet-400 text-white'
                    : 'border-b-2 border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon name={tab.icon} className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto space-y-1 rounded-xl border border-slate-800 bg-slate-900/30 p-2">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-lg bg-slate-800/50 animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                {activeTab === 'messages' && '📭 No active conversations'}
                {activeTab === 'connections' && '🤝 No creator connections'}
                {activeTab === 'requests' && '❓ No pending requests'}
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    selectedConversation?.conversationId === conv.conversationId
                      ? 'bg-violet-500/20 border border-violet-500/30'
                      : 'bg-slate-800/40 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-rose-400 flex items-center justify-center text-sm font-bold text-white">
                      {conv.otherUser?.profilePictureUrl ? (
                        <img src={conv.otherUser.profilePictureUrl} alt={conv.otherUser.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        conv.otherUser?.username?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-white">{conv.otherUser?.name}</p>
                        {conv.otherUser?.accountType === 'comedian' && <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400" title="Comedian" />}
                      </div>
                      <p className="truncate text-xs text-slate-400">@{conv.otherUser?.username}</p>
                      {conv.lastMessage && (
                        <p className="truncate text-xs text-slate-500 mt-1 line-clamp-1">{conv.lastMessage}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-slate-800 bg-slate-900/80 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-rose-400 flex items-center justify-center text-sm font-bold text-white">
                    {selectedConversation.otherUser?.profilePictureUrl ? (
                      <img src={selectedConversation.otherUser.profilePictureUrl} alt={selectedConversation.otherUser.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      selectedConversation.otherUser?.username?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedConversation.otherUser?.name}</p>
                    <p className="text-xs text-slate-400">@{selectedConversation.otherUser?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedConversation.otherUser?.accountType === 'comedian' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-1 text-xs text-rose-200">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      Comedian
                    </span>
                  )}
                  <button className="p-2 hover:bg-slate-800 rounded-full transition" title="More options">
                    ⋯
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
                {chatLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 rounded bg-slate-800/50 animate-pulse" />
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-400 text-center">
                    <div>
                      <div className="text-3xl mb-2">💬</div>
                      <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => <Message key={msg._id} message={msg} sessionUser={sessionUser} onAddReaction={handleAddReaction} />)
                )}

                {Object.values(typingUsers).some((v) => v) && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Someone is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Accept Request Banner */}
              {!selectedConversation.isAccepted && activeTab === 'requests' && (
                <div className="border-t border-slate-800 bg-slate-800/50 p-4">
                  <button
                    onClick={handleAcceptRequest}
                    className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    Accept Message Request
                  </button>
                </div>
              )}

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="border-t border-slate-800 bg-slate-900/80 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <button type="submit" disabled={!messageText.trim()} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50">
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-center">
              <div>
                <div className="text-4xl mb-3">💭</div>
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export default MessagesPage;
