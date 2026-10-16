const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { loadEnvConfig } = require("@next/env");
const {
  createRoom,
  drawCard,
  getPublicRoom,
  joinRoom,
  leaveRoom,
  disconnectPlayer,
  playCard,
  sayUno,
  startGame,
  addReaction,
  addChat,
} = require("./src/lib/game/uno-engine");

const dev = process.env.NODE_ENV !== "production";
loadEnvConfig(process.cwd(), dev);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

function parseCookies(cookieHeader = "") {
  return (cookieHeader || "").split(";").reduce((cookies, part) => {
    const [key, ...value] = part.trim().split("=");
    if (key) {
      try {
        cookies[key] = decodeURIComponent(value.join("="));
      } catch {
        cookies[key] = value.join("=");
      }
    }
    return cookies;
  }, {});
}

function getUserFromSocket(socket) {
  const cookies = parseCookies(socket.handshake.headers.cookie);
  const token = cookies.uno_token || socket.handshake.auth?.token;

  if (!token) {
    return socket.handshake.auth?.guest || null;
  }

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const user = getUserFromSocket(socket);

    socket.on("room:create", ({ name, maxPlayers = 10 }, ack) => {
      if (!user?.id) return ack?.({ ok: false, error: "Login required." });
      const room = createRoom(user, { name, maxPlayers });
      socket.data.roomCode = room.roomCode;
      socket.join(room.roomCode);
      ack?.({ ok: true, room: getPublicRoom(room.roomCode, user?.id) });
    });

    socket.on("room:join", ({ roomCode }, ack) => {
      if (!user?.id) return ack?.({ ok: false, error: "Login required." });
      const code = roomCode?.toUpperCase();
      const result = joinRoom(code, user, socket.id);
      if (!result.ok) return ack?.(result);
      socket.data.roomCode = result.room.roomCode;
      socket.join(result.room.roomCode);
      io.to(result.room.roomCode).emit("room:changed");
      ack?.({ ok: true, room: getPublicRoom(result.room.roomCode, user?.id) });
    });

    socket.on("room:get", ({ roomCode }, ack) => {
      const code = roomCode?.toUpperCase();
      const room = getPublicRoom(code, user?.id);
      if (!room) return ack?.({ ok: false, error: "Room not found." });
      ack?.({ ok: true, room });
    });

    socket.on("room:leave", ({ roomCode }) => {
      const code = (roomCode || socket.data.roomCode)?.toUpperCase();
      if (code) {
        leaveRoom(code, user?.id || socket.id);
        socket.leave(code);
        io.to(code).emit("room:changed");
      }
      socket.data.roomCode = null;
    });

    socket.on("game:start", ({ roomCode }, ack) => {
      const code = roomCode?.toUpperCase();
      const result = startGame(code, user?.id);
      if (!result.ok) return ack?.(result);
      io.to(code).emit("room:changed");
      ack?.({ ok: true });
    });

    socket.on("game:play", async ({ roomCode, cardId, chosenColor }, ack) => {
      const code = roomCode?.toUpperCase();
      const result = await playCard(code, user?.id, cardId, chosenColor);
      if (!result.ok) return ack?.(result);
      io.to(code).emit("room:changed");
      io.to(code).emit("game:event", result.event);
      ack?.({ ok: true });
    });

    socket.on("game:draw", ({ roomCode }, ack) => {
      const code = roomCode?.toUpperCase();
      const result = drawCard(code, user?.id);
      if (!result.ok) return ack?.(result);
      io.to(code).emit("room:changed");
      io.to(code).emit("game:event", result.event);
      ack?.({ ok: true });
    });

    socket.on("game:uno", ({ roomCode }, ack) => {
      const code = roomCode?.toUpperCase();
      const result = sayUno(code, user?.id);
      if (!result.ok) return ack?.(result);
      io.to(code).emit("room:changed");
      io.to(code).emit("game:event", result.event);
      ack?.({ ok: true });
    });

    socket.on("chat:send", ({ roomCode, message }, ack) => {
      const code = roomCode?.toUpperCase();
      const result = addChat(code, user, message);
      if (!result.ok) return ack?.(result);
      io.to(code).emit("chat:new", result.chat);
      io.to(code).emit("room:changed");
      ack?.({ ok: true });
    });

    socket.on("reaction:send", ({ roomCode, emoji }, ack) => {
      const code = roomCode?.toUpperCase();
      const result = addReaction(code, user, emoji);
      if (!result.ok) return ack?.(result);
      io.to(code).emit("reaction:new", result.reaction);
      io.to(code).emit("room:changed");
      ack?.({ ok: true });
    });

    socket.on("disconnect", () => {
      const code = socket.data?.roomCode;
      if (code) {
        disconnectPlayer(code, user?.id || socket.id);
        io.to(code).emit("room:changed");
      }
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`UNO server ready on http://${hostname}:${port}`);
  });
});
