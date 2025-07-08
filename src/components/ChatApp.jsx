// src/components/ChatApp.jsx - Güzel Chat Interface
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const ChatApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(true);

  // Component mount olduğunda username'i temizle
  useEffect(() => {
    // Her zaman username modal'ını göster
    setUsername("");
    setShowUserModal(true);
    setMessages([]);
    setOnlineUsers([]);
  }, []);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mesajları en alta kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (username) {
      // Socket bağlantısı oluştur
      socketRef.current = io("http://localhost:3001");
      const socket = socketRef.current;

      // Bağlantı başarılı olduğunda
      socket.on("connect", () => {
        console.log("✅ Chat bağlandı!");
        setIsConnected(true);

        // Kullanıcı bilgilerini gönder
        socket.emit("user_joined", {
          username: username,
          id: socket.id,
        });
      });

      // Mesaj geçmişini al
      socket.on("message_history", (history) => {
        console.log("📜 Mesaj geçmişi alındı:", history.length, "mesaj");

        // Supabase formatını React formatına çevir
        const formattedHistory = history.map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.created_at,
          type: msg.message_type,
        }));

        setMessages(formattedHistory);
      });

      // Yeni mesaj geldiğinde
      socket.on("receive_message", (messageData) => {
        setMessages((prev) => [...prev, messageData]);
      });

      // Online kullanıcılar güncellemesi
      socket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      // Kullanıcı typing bildirimi
      socket.on("user_typing", (data) => {
        if (data.username !== username) {
          setTypingUsers((prev) => {
            if (!prev.includes(data.username)) {
              return [...prev, data.username];
            }
            return prev;
          });

          // 3 saniye sonra typing'i kaldır
          setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((user) => user !== data.username)
            );
          }, 3000);
        }
      });

      // Bağlantı kesildiğinde
      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      return () => socket.disconnect();
    }
  }, [username]);

  // Kullanıcı adı belirleme
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUserModal(false);
    }
  };

  // Mesaj gönderme
  const sendMessage = () => {
    if (inputMessage.trim() && socketRef.current && username) {
      const messageData = {
        text: inputMessage,
        sender: username,
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };

      socketRef.current.emit("send_message", messageData);
      setInputMessage("");

      // Typing durumunu durdur
      setIsTyping(false);
      socketRef.current.emit("stop_typing", { username });
    }
  };

  // Typing indicator
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current?.emit("start_typing", { username });
    }

    // Typing timeout'u sıfırla
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit("stop_typing", { username });
    }, 1000);
  };

  // Enter tuşu
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Kullanıcı avatarı oluştur
  const getAvatar = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const colorIndex = name.length % colors.length;
    return colors[colorIndex];
  };

  // Mesaj bubble component'i
  const MessageBubble = ({ message, isOwn }) => {
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
        {!isOwn && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 ${getAvatar(
              message.sender
            )}`}
          >
            {message.sender.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
            isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {!isOwn && (
            <div className="text-xs font-semibold mb-1 opacity-70">
              {message.sender}
            </div>
          )}
          <div className="text-sm">{message.text}</div>
          <div
            className={`text-xs mt-1 ${
              isOwn ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>

        {isOwn && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 ${getAvatar(
              message.sender
            )}`}
          >
            {message.sender.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    );
  };

  // Kullanıcı adı modal'ı
  if (showUserModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <h2 className="text-xl font-bold mb-4 text-center">
            💬 Chat'e Katıl
          </h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adını gir..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full mt-4 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Chat'e Başla 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sol Panel - Online Kullanıcılar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg">💬 Chat Room</h2>
          <div
            className={`text-sm ${
              isConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {isConnected ? "🟢 Bağlı" : "🔴 Bağlı Değil"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-sm text-gray-600 mb-3">
              Online Kullanıcılar ({onlineUsers.length})
            </h3>
            {onlineUsers.map((user, index) => (
              <div key={index} className="flex items-center mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${getAvatar(
                    user.username
                  )}`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-sm">
                  {user.username}
                  {user.username === username && " (Sen)"}
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold">Genel Chat</h1>
              <p className="text-sm text-gray-600">
                {onlineUsers.length} kullanıcı online
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Hoş geldin, <strong>{username}</strong>!
            </div>
          </div>
        </div>

        {/* Mesajlar */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-4xl mb-2">💬</div>
              <p>Henüz mesaj yok. İlk mesajını gönder!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                isOwn={message.sender === username}
              />
            ))
          )}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 rounded-2xl px-4 py-2 text-gray-600 text-sm">
                <div className="flex items-center space-x-1">
                  <span>{typingUsers.join(", ")} yazıyor</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Mesaj Input */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Mesajını yaz..."
                disabled={!isConnected}
                rows="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
