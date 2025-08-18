/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  ArrowLeft,
  User,
  Clock,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
  Camera,
  Plus,
  Users
} from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Convex queries and mutations
  const conversations = useQuery(api.messages.getConversations) || [];
  const messages = selectedConversation ? 
    useQuery(api.messages.getMessages, { conversationId: selectedConversation._id }) || [] 
    : [];

  const profile = useQuery(api.users.getMyProfile);

  const searchUsers = userSearchTerm.length >= 2 ? 
    useQuery(api.messages.searchUsers, { searchTerm: userSearchTerm }) || []
    : [];

console.log("search users", searchUsers)

  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markMessagesAsRead);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when conversation is selected
    if (selectedConversation) {
      markAsRead({ conversationId: selectedConversation._id });
    }
  }, [selectedConversation, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (selectedConversation) {
        await sendMessage({
          conversationId: selectedConversation._id,
          content: newMessage.trim(),
        });
      }
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleStartConversation = async (recipient) => {
    try {
      const messageId = await sendMessage({
        recipientId: recipient._id,
        content: "Hi! I'd like to connect with you.",
      });
      setShowNewConversation(false);
      setUserSearchTerm("");
      // The conversation list will update automatically via Convex reactivity
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getDisplayName = (profile) => {
    return profile?.name || profile?.handle || 'Unknown User';
  };

  const getDisplayInfo = (profile) => {
    if (profile?.role === 'brand') {
      return profile.companyName || 'Brand Account';
    } else if (profile?.role === 'influencer') {
      const followers = profile.followerCount;
      if (followers) {
        if (followers >= 1000000) {
          return `${(followers / 1000000).toFixed(1)}M followers`;
        } else if (followers >= 1000) {
          return `${(followers / 1000).toFixed(1)}K followers`;
        } else {
          return `${followers} followers`;
        }
      }
      return 'Influencer';
    }
    return profile?.role || 'User';
  };

  const getAvatarText = (profile) => {
    const name = getDisplayName(profile);
    return name.charAt(0).toUpperCase();
  };

  const filteredConversations = conversations.filter(conv => {
    if (!conv.otherParticipant) return false;
    const displayName = getDisplayName(conv.otherParticipant);
    const displayInfo = getDisplayInfo(conv.otherParticipant);
    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           displayInfo.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isMobile && selectedConversation) {
    // Mobile: Show only chat view when conversation is selected
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Mobile Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3">
          <button 
            onClick={() => setSelectedConversation(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {selectedConversation?.otherParticipant && (
            <>
              <div className="relative">
                {selectedConversation.otherParticipant.profilePictureUrl ? (
                  <img 
                    src={selectedConversation.otherParticipant.profilePictureUrl} 
                    alt={getDisplayName(selectedConversation.otherParticipant)}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getAvatarText(selectedConversation.otherParticipant)}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {getDisplayName(selectedConversation.otherParticipant)}
                </h3>
                <p className="text-sm text-gray-500">
                  {getDisplayInfo(selectedConversation.otherParticipant)}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderUserId === selectedConversation?.otherParticipant?.userId;
            return (
              <div key={message._id} className={`flex ${!isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  !isOwnMessage 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1`}>
                    <span className={`text-xs ${!isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.sentAt)}
                    </span>
                    {!isOwnMessage && (
                      <div className="flex">
                        <CheckCheck className="w-3 h-3 text-blue-200" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className={`${isMobile ? 'w-full' : 'w-80'} bg-white border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowNewConversation(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* New Conversation Modal */}
        {showNewConversation && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
                <button
                  onClick={() => {
                    setShowNewConversation(false);
                    setUserSearchTerm("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {searchUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleStartConversation(user)}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {/* {user.profilePictureUrl ? (
                      <img 
                        src={user.profilePictureUrl} 
                        alt={getDisplayName(user)}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getAvatarText(user)}
                      </div>
                    )} */}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{getDisplayName(user)}</h4>
                      <p className="text-sm text-gray-500">{getDisplayInfo(user)}</p>
                      {profile.name && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{profile.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {userSearchTerm.length >= 2 && searchUsers.length === 0 && (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conversations List */}
        {!showNewConversation && (
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.otherParticipant;
              const isSelected = selectedConversation?._id === conversation._id;
              
              if (!otherParticipant) return null;
              
              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* <div className="relative flex-shrink-0">
                      {otherParticipant.profilePictureUrl ? (
                        <img 
                          src={otherParticipant.profilePictureUrl} 
                          alt={getDisplayName(otherParticipant)}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {getAvatarText(otherParticipant)}
                        </div>
                      )}
                    </div> */}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {getDisplayName(otherParticipant)}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-1">
                        {getDisplayInfo(otherParticipant)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate pr-2">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {conversations.length === 0 && (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-500 mb-4">Start connecting with brands and influencers</p>
                <button
                  onClick={() => setShowNewConversation(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start a conversation
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      {!isMobile && (
        <div className="flex-1 flex flex-col">
          {selectedConversation && selectedConversation.otherParticipant ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {selectedConversation.otherParticipant.profilePictureUrl ? (
                      <img 
                        src={selectedConversation.otherParticipant.profilePictureUrl} 
                        alt={getDisplayName(selectedConversation.otherParticipant)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getAvatarText(selectedConversation.otherParticipant)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getDisplayName(selectedConversation.otherParticipant)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getDisplayInfo(selectedConversation.otherParticipant)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderUserId !== selectedConversation.otherParticipant.userId;
                  return (
                    <div key={message._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center justify-end space-x-1 mt-2`}>
                          <span className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(message.sentAt)}
                          </span>
                          {isOwnMessage && (
                            <div className="flex">
                              <CheckCheck className="w-3 h-3 text-blue-200" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Camera className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Empty state
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;


















// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useRef , useMemo} from 'react';
// import { useQuery, useMutation } from 'convex/react';
// import { api } from '../../convex/_generated/api';
// import { Id } from '../../convex/_generated/dataModel';
// import { 
//   Send, 
//   Search, 
//   Plus, 
//   ArrowLeft, 
//   MoreVertical,
//   Phone,
//   Video,
//   Info,
//   Smile,
//   Paperclip,
//   Check,
//   CheckCheck
// } from 'lucide-react';

// interface User {
//   _id: Id<"users">;
//   name?: string;
//   email?: string;
//   image?: string;
// }

// interface Conversation {
//   _id: Id<"conversations">;
//   participantIds: Id<"users">[];
//   lastMessageAt: number;
//   lastMessage?: string;
//   lastMessageSenderId?: Id<"users">;
//   otherParticipant?: User;
//   unreadCount: number;
// }

// interface Message {
//   _id: Id<"messages">;
//   conversationId: Id<"conversations">;
//   senderUserId: Id<"users">;
//   content: string;
//   sentAt: number;
//   readBy?: Id<"users">[];
//   sender?: User;
// }

// const Messages = () => {
//   const [selectedConversation, setSelectedConversation] = useState<Id<"conversations"> | null>(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showNewChat, setShowNewChat] = useState(false);
//   const [searchUsers, setSearchUsers] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const conversations = useQuery(api.messages.getConversations) || [];
  
//     const messagesRaw = useQuery(
//     api.messages.getMessages,
//     selectedConversation ? { conversationId: selectedConversation } : "skip"
//     ) || [];

//     const messages = useMemo(() => messagesRaw, [messagesRaw]);

//   const userSearchResults = useQuery(
//     api.messages.searchUsers,
//     searchUsers.length >= 2 ? { searchTerm: searchUsers } : "skip"
//   ) || [];

//   const sendMessage = useMutation(api.messages.sendMessage);
//   const markAsRead = useMutation(api.messages.markMessagesAsRead);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Mark messages as read when conversation is selected
//   useEffect(() => {
//     if (selectedConversation) {
//       markAsRead({ conversationId: selectedConversation });
//     }
//   }, [selectedConversation, markAsRead]);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     try {
//       await sendMessage({
//         conversationId: selectedConversation || undefined,
//         content: newMessage.trim(),
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   const handleStartNewChat = async (recipientId: Id<"users">) => {
//     try {
//       const messageId = await sendMessage({
//         recipientId,
//         content: "Hi there! 👋",
//       });
//       setShowNewChat(false);
//       setSearchUsers('');
//       // The conversation will appear in the list automatically
//     } catch (error) {
//       console.error('Failed to start new chat:', error);
//     }
//   };

//   const filteredConversations = conversations.filter(conv => 
//     conv.otherParticipant?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     conv.otherParticipant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const selectedConversationData = conversations.find(c => c._id === selectedConversation);

//   const formatTime = (timestamp: number) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

//     if (diffInHours < 24) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (diffInHours < 168) { // 7 days
//       return date.toLocaleDateString([], { weekday: 'short' });
//     } else {
//       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   return (
//     <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex">
//       {/* Conversations Sidebar */}
//       <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 border-r border-gray-200`}>
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-gray-900">Messages</h2>
//             <button
//               onClick={() => setShowNewChat(true)}
//               className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
//             >
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>
          
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-sm"
//             />
//           </div>
//         </div>

//         {/* Conversations List */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredConversations.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-sm">No conversations yet</p>
//               <p className="text-xs text-gray-400 mt-1">Start a new chat to get connected!</p>
//             </div>
//           ) : (
//             <div className="space-y-1 p-2">
//               {filteredConversations.map((conversation) => (
//                 <button
//                   key={conversation._id}
//                   onClick={() => setSelectedConversation(conversation._id)}
//                   className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
//                     selectedConversation === conversation._id
//                       ? 'bg-primary-50 border border-primary-200'
//                       : 'hover:bg-gray-50 border border-transparent'
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     {/* Avatar */}
//                     <div className="relative">
//                       <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
//                         {conversation.otherParticipant?.username?.[0] || conversation.otherParticipant?.email?.[0] || '?'}
//                       </div>
//                       {conversation.unreadCount > 0 && (
//                         <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                           {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
//                         </div>
//                       )}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h3 className="font-semibold text-gray-900 truncate">
//                           {conversation.otherParticipant?.username || conversation.otherParticipant?.email || 'Unknown User'}
//                         </h3>
//                         <span className="text-xs text-gray-500">
//                           {formatTime(conversation.lastMessageAt)}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 truncate">
//                         {conversation.lastMessage || 'No messages yet'}
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chat Area */}
//       {selectedConversation ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b border-gray-200 bg-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => setSelectedConversation(null)}
//                   className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <ArrowLeft className="w-5 h-5 text-gray-600" />
//                 </button>
                
//                 <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
//                   {selectedConversationData?.otherParticipant?.username?.[0] || 
//                    selectedConversationData?.otherParticipant?.email?.[0] || '?'}
//                 </div>
                
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {selectedConversationData?.otherParticipant?.username || 
//                      selectedConversationData?.otherParticipant?.email || 'Unknown User'}
//                   </h3>
//                   <p className="text-sm text-green-600">Online</p>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Phone className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Video className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Info className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {messages.map((message) => {
//               const isOwn = message.senderUserId === selectedConversationData?.participantIds.find(id => 
//                 id !== selectedConversationData?.otherParticipant?._id
//               );
              
//               return (
//                 <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                     isOwn 
//                       ? 'bg-primary-500 text-white' 
//                       : 'bg-white text-gray-900 border border-gray-200'
//                   }`}>
//                     <p className="text-sm">{message.content}</p>
//                     <div className={`flex items-center justify-end mt-1 space-x-1 ${
//                       isOwn ? 'text-primary-100' : 'text-gray-500'
//                     }`}>
//                       <span className="text-xs">{formatTime(message.sentAt)}</span>
//                       {isOwn && (
//                         <div className="text-xs">
//                           {message.readBy && message.readBy.length > 1 ? (
//                             <CheckCheck className="w-3 h-3" />
//                           ) : (
//                             <Check className="w-3 h-3" />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t border-gray-200 bg-white">
//             <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <Paperclip className="w-5 h-5 text-gray-600" />
//               </button>
              
//               <div className="flex-1 relative">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   className="w-full px-4 py-3 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
//                 >
//                   <Smile className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
              
//               <button
//                 type="submit"
//                 disabled={!newMessage.trim()}
//                 className="p-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </form>
//           </div>
//         </div>
//       ) : (
//         <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Send className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
//             <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
//           </div>
//         </div>
//       )}

//       {/* New Chat Modal */}
//       {showNewChat && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
//                 <button
//                   onClick={() => {
//                     setShowNewChat(false);
//                     setSearchUsers('');
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <ArrowLeft className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
              
//               <div className="mt-4 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search users by name or email..."
//                   value={searchUsers}
//                   onChange={(e) => setSearchUsers(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-sm"
//                   autoFocus
//                 />
//               </div>
//             </div>

//             <div className="max-h-80 overflow-y-auto">
//               {userSearchResults.length === 0 && searchUsers.length >= 2 ? (
//                 <div className="p-6 text-center text-gray-500">
//                   <p className="text-sm">No users found</p>
//                 </div>
//               ) : (
//                 <div className="space-y-1 p-2">
//                   {userSearchResults.map((user) => (
//                     <button
//                       key={user._id}
//                       onClick={() => handleStartNewChat(user._id)}
//                       className="w-full p-4 rounded-xl text-left hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
//                           {user.username?.[0] || user.email?.[0] || '?'}
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-gray-900">
//                             {user.username || 'Unknown User'}
//                           </h4>
//                           <p className="text-sm text-gray-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messages;
