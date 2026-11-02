import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  Calendar,
  Check,
  CheckCheck,
  User,
  Sparkles,
  ArrowLeft,
  Clock,
  ExternalLink,
  ChevronRight,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useAuth, sendChatMessage, markConversationAsRead } from '../utils/auth.js';
import { resetScrollToTop } from '../utils/useScrollToTop.js';
import AnimeIdChip from '../components/AnimeIdChip.jsx';
import { getConversationCourseIds } from '../utils/idEngine.js';
import './Messages.css';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { conversations } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const userParam = searchParams.get('user');

  // Active Selected Conversation State
  const [selectedPeerName, setSelectedPeerName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const chatStreamRef = useRef(null);

  // Sync with search parameter if provided (e.g., from Matches or Sessions "Message Partner")
  useEffect(() => {
    if (userParam) {
      const match = conversations.find(
        (c) => c.peerName.toLowerCase() === userParam.toLowerCase()
      );
      if (match) {
        setSelectedPeerName(match.peerName);
        markConversationAsRead(match.peerName);
      } else {
        // If peer doesn't have an existing thread, initialize it
        sendChatMessage(userParam, `Hi ${userParam.split(' ')[0]}! Looking forward to connecting on 4S.`);
        setSelectedPeerName(userParam);
      }
      setIsMobileChatActive(true);
    } else if (conversations.length > 0 && !selectedPeerName) {
      setSelectedPeerName(conversations[0].peerName);
    }
  }, [userParam, conversations, selectedPeerName]);

  // Scroll ONLY the inner chat stream container to bottom, never the page
  const scrollToBottom = () => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    // Ensure outer page stays firmly at top
    resetScrollToTop();
  }, [selectedPeerName, conversations, isPeerTyping]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.peerName.toLowerCase().includes(q) ||
      (c.skillContext || '').toLowerCase().includes(q) ||
      (c.peerDept || '').toLowerCase().includes(q)
    );
  });

  // Current active conversation
  const activeConversation = conversations.find(
    (c) => c.peerName.toLowerCase() === (selectedPeerName || '').toLowerCase()
  ) || filteredConversations[0] || null;

  // Handle select conversation
  const handleSelectConversation = (peerName) => {
    setSelectedPeerName(peerName);
    markConversationAsRead(peerName);
    setIsMobileChatActive(true);
    setIsPeerTyping(false);
  };

  // Handle send message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const text = messageInput.trim();
    setMessageInput('');

    // Save outgoing message
    sendChatMessage(activeConversation.peerName, text);
    showToast('Message sent.');

    // Simulated peer typing indicator & auto-reply after 1.2s for an engaging interactive demo experience
    setIsPeerTyping(true);

    setTimeout(() => {
      const simulatedReplies = [
        `Sounds great! Let's definitely do that. I've noted down the details.`,
        `Thanks for the update! Looking forward to our peer mentoring session.`,
        `Checked my weekly availability on 4S and that timing works perfectly for me!`,
        `Awesome, I'll review the materials and meet you at the scheduled time!`,
        `Perfect! I'll share the Google Meet link and repo ahead of time.`
      ];
      const randomReply =
        simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      try {
        const raw = localStorage.getItem('4s_chat_conversations');
        if (raw) {
          const list = JSON.parse(raw);
          const idx = list.findIndex(
            (c) => c.peerName.toLowerCase() === activeConversation.peerName.toLowerCase()
          );
          if (idx !== -1) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            list[idx].messages.push({
              id: `m_sim_${Date.now()}`,
              sender: activeConversation.peerName,
              text: randomReply,
              timestamp: timeString,
              isMine: false
            });
            list[idx].lastActive = 'Just now';
            localStorage.setItem('4s_chat_conversations', JSON.stringify(list));
            window.dispatchEvent(new Event('4s_chat_change'));
          }
        }
      } catch (err) {
        console.error('Error simulating reply', err);
      }
      setIsPeerTyping(false);
    }, 1200);
  };

  // Handle quick chip click
  const handleChipClick = (suggestion) => {
    setMessageInput(suggestion);
  };

  return (
    <div className="messages-page">
      <div className="container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="app-toast-alert">
            <Check size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="messages-container-card">
          {/* ================================================================
              Left Pane: Conversations List
              ================================================================ */}
          <div
            className={`conversations-sidebar ${
              isMobileChatActive ? 'hidden-mobile' : ''
            }`}
          >
            <div className="conversations-sidebar-header">
              <div className="conversations-header-title">
                <div className="flex items-center gap-2">
                  <MessageSquare size={20} className="text-primary" />
                  <h2>Messages</h2>
                </div>
                <span className="conversations-count-badge">
                  {conversations.length} Active
                </span>
              </div>

              <div className="conversations-search">
                <Search size={16} className="conv-search-icon" />
                <input
                  type="text"
                  placeholder="Search students or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="conv-search-input"
                />
              </div>
            </div>

            <div className="conversations-list">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">
                  No conversations match "{searchQuery}"
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected =
                    activeConversation &&
                    activeConversation.peerName.toLowerCase() ===
                      conv.peerName.toLowerCase();
                  const lastMessage =
                    conv.messages && conv.messages.length > 0
                      ? conv.messages[conv.messages.length - 1]
                      : null;

                  return (
                    <div
                      key={conv.id || conv.peerName}
                      className={`conv-item ${isSelected ? 'active' : ''} ${
                        conv.unreadCount > 0 ? 'unread' : ''
                      }`}
                      onClick={() => handleSelectConversation(conv.peerName)}
                    >
                      <div className="conv-avatar-wrapper">
                        <div
                          className={`conv-avatar ${
                            conv.avatarBg || 'avatar-indigo'
                          }`}
                        >
                          {conv.peerAvatar ||
                            conv.peerName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                        </div>
                        <div
                          className={`conv-online-indicator ${
                            conv.onlineStatus === 'online'
                              ? 'online-green'
                              : conv.onlineStatus === 'idle'
                              ? 'online-idle'
                              : 'online-offline'
                          }`}
                        ></div>
                      </div>

                      <div className="conv-content">
                        <div className="conv-top-line">
                          <span className="conv-peer-name">{conv.peerName}</span>
                          <span className="conv-time">
                            {lastMessage ? lastMessage.timestamp : conv.lastActive}
                          </span>
                        </div>

                        {conv.skillContext && (
                          <div className="conv-skill-tag" title={conv.skillContext}>
                            {conv.skillContext}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="conv-snippet">
                            {lastMessage
                              ? `${lastMessage.isMine ? 'You: ' : ''}${lastMessage.text}`
                              : 'Start the conversation...'}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="conv-unread-dot"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ================================================================
              Right Pane: Active Chat Room
              ================================================================ */}
          {activeConversation ? (
            <div
              key={activeConversation.peerName}
              className={`chat-room ${
                !isMobileChatActive ? 'hidden-mobile' : ''
              }`}
            >
              {/* Chat Room Header */}
              <div className="chat-room-header">
                <div className="chat-peer-info">
                  <button
                    onClick={() => setIsMobileChatActive(false)}
                    className="chat-back-btn"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div
                    className={`conv-avatar ${
                      activeConversation.avatarBg || 'avatar-purple'
                    }`}
                    style={{ width: '40px', height: '40px' }}
                  >
                    {activeConversation.peerAvatar ||
                      activeConversation.peerName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                  </div>

                  <div className="chat-peer-meta">
                    {(() => {
                      const courseInfo = getConversationCourseIds(activeConversation.peerName, activeConversation.skillContext);
                      return (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3>{activeConversation.peerName}</h3>
                            <AnimeIdChip id={courseInfo.learningId} type="LRN" size="sm" />
                          </div>
                          <div className="chat-peer-sub">
                            <span>{activeConversation.peerDept || 'Campus Student'}</span>
                            <span>·</span>
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: '#16a34a'
                                }}
                              ></span>
                              Online
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="chat-header-actions">
                  <Link
                    to={`/sessions`}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 0.85rem' }}
                  >
                    <Calendar size={15} />
                    <span>Schedule Session</span>
                  </Link>

                  <Link
                    to={`/matches?skill=${encodeURIComponent(
                      activeConversation.peerName
                    )}`}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.75rem' }}
                    title="View Peer Matches & Details"
                  >
                    <span>View Match</span>
                  </Link>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="chat-messages-stream" ref={chatStreamRef}>
                <div className="chat-date-separator">
                  <span>Knowledge Exchange Chat</span>
                </div>

                {activeConversation.skillContext && (
                  <div className="chat-study-context-banner flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={16} className="text-indigo-600 flex-shrink-0" />
                      <span>
                        <strong>Study Context:</strong> {activeConversation.skillContext}
                      </span>
                    </div>
                    {(() => {
                      const courseInfo = getConversationCourseIds(activeConversation.peerName, activeConversation.skillContext);
                      return (
                        <AnimeIdChip id={courseInfo.teachingId} type="TCR" size="sm" />
                      );
                    })()}
                  </div>
                )}

                {/* Message Speech Bubbles with spring pop-in */}
                {activeConversation.messages?.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`message-row ${
                      msg.isMine ? 'outgoing' : 'incoming'
                    }`}
                    initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.88, opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.1 }
                        : { type: 'spring', stiffness: 480, damping: 24 }
                    }
                  >
                    {!msg.isMine && (
                      <div className="message-avatar-small">
                        {activeConversation.peerAvatar || 'P'}
                      </div>
                    )}

                    <div>
                      <div className="message-bubble">{msg.text}</div>
                      <div className="message-meta">
                        <span>{msg.timestamp}</span>
                        {msg.isMine && (
                          <CheckCheck size={13} className="text-indigo-200" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator with Bouncing Dots */}
                {isPeerTyping && (
                  <motion.div
                    className="message-row incoming typing-row"
                    initial={{ scale: 0.85, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  >
                    <div className="message-avatar-small">
                      {activeConversation.peerAvatar || 'P'}
                    </div>
                    <div>
                      <div className="message-bubble typing-bubble" aria-label={`${activeConversation.peerName} is typing`}>
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                      <div className="message-meta">
                        <span>typing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* End of message list marker */}
                <div style={{ height: '1px' }} />
              </div>

              {/* Suggestion Chips */}
              <div className="chat-suggestions-bar">
                <span className="text-xs text-muted mr-1 font-semibold">
                  Quick suggestions:
                </span>
                <button
                  type="button"
                  className="suggestion-chip"
                  onClick={() =>
                    handleChipClick(
                      `Looking forward to our upcoming study session!`
                    )
                  }
                >
                  📅 Looking forward to our session!
                </button>
                <button
                  type="button"
                  className="suggestion-chip"
                  onClick={() =>
                    handleChipClick(
                      `What days work best with your weekly availability?`
                    )
                  }
                >
                  ⏰ Check availability
                </button>
                <button
                  type="button"
                  className="suggestion-chip"
                  onClick={() =>
                    handleChipClick(
                      `Could you share the GitHub repository or syllabus notes?`
                    )
                  }
                >
                  📂 Share repository/notes
                </button>
                <button
                  type="button"
                  className="suggestion-chip"
                  onClick={() =>
                    handleChipClick(
                      `Shall we meet in Study Room 3B at the library?`
                    )
                  }
                >
                  🏛 Meet at campus library
                </button>
              </div>

              {/* Bottom Input Form */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input
                  type="text"
                  placeholder={`Type a message to ${activeConversation.peerName}... (Press Enter to send)`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="chat-input-field"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="chat-send-btn"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <MessageSquare size={32} />
              </div>
              <h3>Select a Conversation</h3>
              <p>
                Choose a student from the sidebar to view their messages or coordinate a skill swap session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
