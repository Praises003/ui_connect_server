import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { prisma } from "./lib/prisma";
import { sendMessageService } from "./modules/messaging/messaging.service";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ─── Community Chat Namespace ───────────────────────────────────────────────
io.on("connection", (socket) => {
  // Join a community room
  socket.on("join_community", (communityId: string) => {
    socket.join(`community:${communityId}`);
  });

  socket.on("leave_community", (communityId: string) => {
    socket.leave(`community:${communityId}`);
  });

  // Send community chat message
  socket.on(
    "community_message",
    async (data: { communityId: string; senderId: string; content: string }) => {
      if (!data.content?.trim() || !data.communityId || !data.senderId) return;

      try {
        // Persist to DB
        const message = await prisma.communityMessage.create({
          data: {
            content: data.content.trim(),
            communityId: data.communityId,
            senderId: data.senderId,
          },
          include: {
            sender: {
              select: { id: true, fullName: true, avatarUrl: true, username: true },
            },
          },
        });

        // Broadcast to everyone in the community room (including sender)
        io.to(`community:${data.communityId}`).emit("community_message", message);
      } catch (err) {
        console.error("Failed to save community message:", err);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    }
  );

  // ─── Direct Message Socket Events ───────────────────────────────────────────
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on(
    "dm_message",
    async (data: { conversationId: string; senderId: string; recipientId: string; content: string }) => {
      if (!data.content?.trim() || !data.senderId) return;
      try {
        const message = await sendMessageService(data.senderId, data.recipientId, data.content.trim());
        // Broadcast to both participants in the shared conversation room
        io.to(`conversation:${data.conversationId}`).emit("dm_message", message);
      } catch (err) {
        console.error("Failed to save DM:", err);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    }
  );

  socket.on("disconnect", () => {
    // cleanup is automatic
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO ready`);
});

