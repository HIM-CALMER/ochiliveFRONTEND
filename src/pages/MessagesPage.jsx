import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { getProfileSummary } from '../api/dashboardApi';
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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [directMessageTarget, setDirectMessageTarget] = useState(null);
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
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

  const handleOpenConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileConversationOpen(true);
    }
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
    setDirectMessageTarget(null);
    setIsMobileConversationOpen(false);
    setMessageText('');
    setSearchParams({});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && (selectedConversation || directMessageTarget)) {
      setIsMobileConversationOpen(true);
    }
  }, [selectedConversation, directMessageTarget]);

  useEffect(() => {
    const targetUsername = searchParams.get('user');
    if (!targetUsername) {
      setDirectMessageTarget(null);
      return;
    }

    const sessionUser = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('ochi_user') || '{}');
      } catch {
        return {};
      }
    })();

    if (targetUsername.toLowerCase() === String(sessionUser.username || '').toLowerCase()) {
      setDirectMessageTarget(null);
      return;
    }

    let ignore = false;
    getProfileSummary(targetUsername)
      .then((data) => {
        if (ignore) return;
        const user = data?.user || null;
        if (!user) return;
        setDirectMessageTarget({
          id: user.id,
          username: user.username,
          name: user.name,
          accountType: user.accountType,
        });
      })
      .catch(() => {
        if (!ignore) setDirectMessageTarget(null);
      });

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await messageApi.getConversations(activeTab);
        const nextConversations = data.data || [];
        setConversations(nextConversations);

        const visibleCounts = {
          messages: nextConversations.filter((convo) => convo.inboxType === 'messages').length,
          connections: nextConversations.filter((convo) => convo.inboxType === 'connections').length,
          requests: nextConversations.filter((convo) => convo.inboxType === 'requests').length,
        };

        TABS.forEach((tab) => {
          tab.count = visibleCounts[tab.id] || 0;
        });

        if (directMessageTarget) {
          const existingThread = nextConversations.find((conversation) => {
            const otherUser = conversation?.otherUser || {};
            return String(otherUser.id || '').toLowerCase() === String(directMessageTarget.id || '').toLowerCase()
              || String(otherUser.username || '').toLowerCase() === String(directMessageTarget.username || '').toLowerCase();
          });

          if (existingThread) {
            setSelectedConversation(existingThread);
            setMessages([]);
          } else {
            setSelectedConversation({
              conversationId: null,
              otherUser: directMessageTarget,
              isAccepted: true,
            });
            setMessages([]);
          }
        } else {
          setSelectedConversation(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [activeTab, directMessageTarget]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation || !selectedConversation.conversationId) return;

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
    if (!messageText.trim()) return;

    const receiver = selectedConversation?.otherUser || directMessageTarget;
    if (!receiver?.id) return;

    try {
      const response = await messageApi.sendMessage(receiver.id, messageText);

      if (response.success) {
        const nextConversationId = response.data?.conversationId || selectedConversation?.conversationId;
        const nextConversation = nextConversationId
          ? {
              conversationId: nextConversationId,
              otherUser: receiver,
              isAccepted: true,
            }
          : {
              conversationId: null,
              otherUser: receiver,
              isAccepted: true,
            };

        setSelectedConversation(nextConversation);
        setDirectMessageTarget(null);
        setSearchParams({});
        setMessageText('');
        sendTypingIndicator(false);

        if (nextConversationId) {
          const data = await messageApi.getMessages(nextConversationId);
          setMessages(data.data || []);
        }

        const list = await messageApi.getConversations(activeTab);
        setConversations(list.data || []);
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

  const totalUnread = conversations.filter((conversation) => conversation.isUnread).length;

  const showMobileChat = Boolean(selectedConversation || directMessageTarget) && isMobileConversationOpen;

  return (
    <DashboardShell
      title="Messages"
      subtitle="Connect with your audience and collaborate with creators"
      showSearch={false}
      showBack={false}
    >
      <div className="-mx-3 h-[calc(100dvh-118px)] px-0 pb-1 sm:mx-0 sm:h-[calc(100vh-158px)] lg:h-[calc(100vh-175px)]">
        <div className="grid h-full gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className={`${showMobileChat ? 'hidden' : 'flex'} h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 lg:flex`}>
            <div className="border-b border-slate-800/80 px-3 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Inbox</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Messages</h2>
                </div>
                {totalUnread > 0 && (
                  <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-900">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'border-slate-700 bg-slate-200 text-slate-950'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Icon name={tab.icon} className="h-3.5 w-3.5" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="inline-flex min-w-[16px] items-center justify-center rounded-full bg-slate-700 px-1 py-0.5 text-[9px] font-semibold text-slate-100">
                        {tab.count > 9 ? '9+' : tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="space-y-2 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-800/60" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex h-full items-center justify-center px-4 pt-8 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg text-slate-200">✦</div>
                    <p className="text-sm font-medium text-slate-200">
                      {activeTab === 'messages' && 'No messages yet'}
                      {activeTab === 'connections' && 'No connections yet'}
                      {activeTab === 'requests' && 'No requests'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {activeTab === 'messages' && 'New chats will appear here.'}
                      {activeTab === 'connections' && 'Connect with creators you care about.'}
                      {activeTab === 'requests' && 'Requests will show up here.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {conversations.map((conv) => {
                    const isSelected = selectedConversation?.conversationId === conv.conversationId;
                    const otherUser = conv.otherUser || {};

                    return (
                      <button
                        key={conv.conversationId}
                        onClick={() => handleOpenConversation(conv)}
                        className={`w-full rounded-xl border px-2.5 py-2.5 text-left transition ${
                          isSelected
                            ? 'border-slate-700 bg-slate-900'
                            : conv.isUnread
                              ? 'border-slate-800 bg-slate-900/75 hover:bg-slate-900'
                              : 'border-transparent bg-slate-950/30 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-slate-700 ring-1 ring-slate-800">
                            {otherUser.profilePictureUrl ? (
                              <img src={otherUser.profilePictureUrl} alt={otherUser.name || otherUser.username} className="h-full w-full object-cover" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                                {(otherUser.username || 'U').slice(0, 1).toUpperCase()}
                              </span>
                            )}
                            {conv.isUnread && (
                              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-slate-950 bg-slate-200" aria-label="Unread message" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`truncate text-sm font-medium ${conv.isUnread ? 'text-white' : 'text-slate-200'}`}>
                                {otherUser.name || otherUser.username || 'Unknown user'}
                              </p>
                              <span className="text-[10px] text-slate-500">{conv.time || 'now'}</span>
                            </div>

                            <div className="mt-0.5 flex items-center justify-between gap-2">
                              <p className="truncate text-[11px] text-slate-400">@{otherUser.username || 'user'}</p>
                              {conv.isUnread && (
                                <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-900">
                                  New
                                </span>
                              )}
                            </div>

                            {conv.lastMessage && (
                              <p className={`mt-1 truncate text-xs ${conv.isUnread ? 'text-slate-300' : 'text-slate-500'}`}>
                                {conv.lastMessage}
                              </p>
                            )}

                            {conv.inboxType === 'requests' && (
                              <div className="mt-1 inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-200">
                                Request
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <main className={`${showMobileChat ? 'flex' : 'hidden'} h-full min-h-0 flex-col overflow-hidden border-y border-slate-800/80 bg-slate-950/60 lg:flex lg:rounded-2xl lg:border`}>
            {selectedConversation || directMessageTarget ? (
              <>
                <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-3 py-2.5 pt-[max(0.7rem,env(safe-area-inset-top))] sm:px-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCloseConversation}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-base text-slate-200 lg:hidden"
                      aria-label="Back to inbox"
                    >
                      ←
                    </button>
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-700 ring-1 ring-slate-800">
                      {(selectedConversation?.otherUser || directMessageTarget)?.profilePictureUrl ? (
                        <img src={(selectedConversation?.otherUser || directMessageTarget).profilePictureUrl} alt={(selectedConversation?.otherUser || directMessageTarget).name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                          {((selectedConversation?.otherUser || directMessageTarget)?.username || 'U').slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{(selectedConversation?.otherUser || directMessageTarget)?.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] text-slate-400">@{(selectedConversation?.otherUser || directMessageTarget)?.username}</p>
                        {(selectedConversation?.otherUser || directMessageTarget)?.accountType === 'comedian' && (
                          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.08em] text-slate-200">
                            Comedian
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:text-white" title="More actions">
                    ⋯
                  </button>
                </header>

                <div className="no-scrollbar flex-1 overflow-y-auto bg-slate-950/40 p-3 pb-4 sm:p-4 sm:pb-5">
                  {chatLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 animate-pulse rounded-2xl bg-slate-800/70" />
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-6 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl">💬</div>
                        <p className="text-sm font-medium text-white">Start the conversation</p>
                        <p className="mt-1 text-xs text-slate-400">Send a message to begin the thread.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.senderId === sessionUser.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[82%] rounded-2xl px-3 py-2.5 ${msg.senderId === sessionUser.id ? 'bg-slate-200 text-slate-950' : 'border border-slate-800 bg-slate-900 text-slate-100'}`}>
                            {msg.text && <p className="text-sm leading-6 break-words">{msg.text}</p>}
                            <div className={`mt-1 flex items-center justify-between gap-2 text-[10px] ${msg.senderId === sessionUser.id ? 'text-slate-600' : 'text-slate-400'}`}>
                              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {msg.senderId === sessionUser.id && msg.isRead && <span>✓✓</span>}
                            </div>
                            <MessageReactions message={msg} onAddReaction={handleAddReaction} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {Object.values(typingUsers).some((v) => v) && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {selectedConversation && !selectedConversation.isAccepted && activeTab === 'requests' && (
                  <div className="border-t border-slate-800 bg-slate-900/80 p-3">
                    <button
                      onClick={handleAcceptRequest}
                      className="w-full rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-white"
                    >
                      Accept message request
                    </button>
                  </div>
                )}

                {selectedConversation?.isUnread && (
                  <div className="border-b border-slate-800 bg-slate-900/80 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-300">
                    New message
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex-shrink-0 border-t border-slate-800 bg-slate-950/80 p-3 pb-[max(0.8rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:p-4 sm:pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))]">
                  <div className="flex w-full items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-2 py-1.5 shadow-[0_-8px_20px_rgba(15,23,42,0.2)]">
                    <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-lg text-slate-300 transition hover:bg-slate-700 hover:text-white" aria-label="Add attachment">
                      +
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={handleTyping}
                      placeholder={((selectedConversation?.otherUser || directMessageTarget)?.username) ? `Message @${(selectedConversation?.otherUser || directMessageTarget).username}` : 'Type a message...'}
                      className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="shrink-0 rounded-full bg-slate-200 px-3.5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl">✦</div>
                  <p className="text-sm font-medium text-white">Choose a conversation</p>
                  <p className="mt-1 text-xs text-slate-400">Your messages will appear here.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardShell>
  );
}

export default MessagesPage;
