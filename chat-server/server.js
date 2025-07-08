// server.js - Supabase entegrasyonlu chat server
require("dotenv").config(); // .env dosyasını yükle

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// Supabase client - Environment variables'dan al
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Supabase bilgilerini kontrol et
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ HATA: Supabase URL veya KEY eksik!");
  console.error("💡 chat-server/.env dosyasını kontrol edin");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Express app oluştur
const app = express();
const server = http.createServer(app);

// Socket.io'yu server'a bağla (Vite için güncellendi)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default portu
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Connected users tracking
let connectedUsers = [];

// Supabase'den mesaj geçmişini çek
async function getMessageHistory(room = "general", limit = 50) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("❌ Mesaj geçmişi çekme hatası:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("❌ Supabase bağlantı hatası:", error);
    return [];
  }
}

// Supabase'e mesaj kaydet
async function saveMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          text: messageData.text,
          sender: messageData.sender,
          room: messageData.room || "general",
          message_type: messageData.type || "message",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Mesaj kaydetme hatası:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Supabase kayıt hatası:", error);
    return null;
  }
}

// Kullanıcı bağlandığında ne olacak?
io.on("connection", async (socket) => {
  console.log("🎉 Yeni kullanıcı bağlandı:", socket.id);

  // Bağlanan kullanıcıya hoş geldin mesajı gönder
  socket.emit("welcome", "Hoş geldin! Chat server bağlandı 🚀");

  // Mesaj geçmişini gönder
  try {
    const messageHistory = await getMessageHistory();
    socket.emit("message_history", messageHistory);
    console.log(`📜 ${messageHistory.length} mesaj geçmişi gönderildi`);
  } catch (error) {
    console.error("❌ Mesaj geçmişi gönderme hatası:", error);
  }

  // Kullanıcı chat'e katıldığında
  socket.on("user_joined", async (userData) => {
    // Kullanıcıyı listeye ekle
    const user = {
      id: socket.id,
      username: userData.username,
      joinedAt: new Date(),
    };

    connectedUsers.push(user);
    console.log(`👤 ${userData.username} chat'e katıldı`);

    // Tüm kullanıcılara online kullanıcıları gönder
    io.emit("online_users", connectedUsers);

    // Katılım mesajını Supabase'e kaydet
    const joinMessage = {
      text: `${userData.username} chat'e katıldı! 👋`,
      sender: "Sistem",
      type: "join",
      room: "general",
    };

    const savedMessage = await saveMessage(joinMessage);

    if (savedMessage) {
      // Tüm kullanıcılara katılım mesajını gönder
      io.emit("receive_message", {
        id: savedMessage.id,
        text: savedMessage.text,
        sender: savedMessage.sender,
        timestamp: savedMessage.created_at,
        type: savedMessage.message_type,
      });
    }
  });

  // Kullanıcıdan mesaj geldiğinde
  socket.on("send_message", async (data) => {
    console.log("📨 Mesaj alındı:", data);

    // Mesajı Supabase'e kaydet
    const messageData = {
      text: data.text,
      sender: data.sender,
      type: "message",
      room: "general",
    };

    const savedMessage = await saveMessage(messageData);

    if (savedMessage) {
      // Tüm bağlı kullanıcılara mesajı gönder
      io.emit("receive_message", {
        id: savedMessage.id,
        text: savedMessage.text,
        sender: savedMessage.sender,
        timestamp: savedMessage.created_at,
        type: savedMessage.message_type,
      });

      console.log("✅ Mesaj kaydedildi ve gönderildi");
    } else {
      console.error("❌ Mesaj kaydedilemedi");
    }
  });

  // Typing başladığında
  socket.on("start_typing", (data) => {
    socket.broadcast.emit("user_typing", {
      username: data.username,
      isTyping: true,
    });
  });

  // Typing durduğunda
  socket.on("stop_typing", (data) => {
    socket.broadcast.emit("user_typing", {
      username: data.username,
      isTyping: false,
    });
  });

  // Kullanıcı ayrıldığında
  socket.on("disconnect", async () => {
    console.log("👋 Kullanıcı ayrıldı:", socket.id);

    // Kullanıcıyı listeden çıkar
    const userIndex = connectedUsers.findIndex((user) => user.id === socket.id);
    if (userIndex !== -1) {
      const leftUser = connectedUsers[userIndex];
      connectedUsers.splice(userIndex, 1);

      console.log(`👤 ${leftUser.username} chat'ten ayrıldı`);

      // Tüm kullanıcılara güncel listeyi gönder
      io.emit("online_users", connectedUsers);

      // Ayrılma mesajını Supabase'e kaydet
      const leaveMessage = {
        text: `${leftUser.username} chat'ten ayrıldı 👋`,
        sender: "Sistem",
        type: "leave",
        room: "general",
      };

      const savedMessage = await saveMessage(leaveMessage);

      if (savedMessage) {
        // Ayrılma mesajını gönder
        io.emit("receive_message", {
          id: savedMessage.id,
          text: savedMessage.text,
          sender: savedMessage.sender,
          timestamp: savedMessage.created_at,
          type: savedMessage.message_type,
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
🚀 Chat Server Çalışıyor!
📍 Port: ${PORT}
🔌 Bağlantı: http://localhost:${PORT}
💾 Supabase: ${supabaseUrl ? "✅ Bağlı" : "❌ Yapılandırılmamış"}

✅ Ready for connections!
📡 Supabase URL: ${supabaseUrl}
  `);
});
