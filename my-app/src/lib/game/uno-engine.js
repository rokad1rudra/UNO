const colors = ["red", "yellow", "green", "blue"];
const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "skip", "reverse", "+2"];
const rooms = globalThis.__uno_rooms || (globalThis.__uno_rooms = new Map());
const cleanupTimers = globalThis.__uno_cleanup_timers || (globalThis.__uno_cleanup_timers = new Map());

function cancelRoomCleanup(roomCode) {
  const code = roomCode?.toUpperCase();
  if (code && cleanupTimers.has(code)) {
    clearTimeout(cleanupTimers.get(code));
    cleanupTimers.delete(code);
  }
}

function id(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function code() {
  let roomCode = "";
  do {
    roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
  } while (rooms.has(roomCode));
  return roomCode;
}

function normalizeUser(user, fallbackId) {
  return {
    id: user?.id || fallbackId || id("guest"),
    username: user?.username || "Guest Player",
    email: user?.email || "",
    avatarColor: user?.avatarColor || "#ef4444",
  };
}

function makeDeck() {
  const deck = [];

  colors.forEach((color) => {
    values.forEach((value) => {
      deck.push({ id: id("card"), color, value, type: "number" });
      if (value !== "0") deck.push({ id: id("card"), color, value, type: "number" });
    });
  });

  for (let i = 0; i < 4; i += 1) {
    deck.push({ id: id("card"), color: "wild", value: "wild", type: "wild" });
    deck.push({ id: id("card"), color: "wild", value: "+4", type: "wild" });
  }

  return shuffle(deck);
}

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawFromDeck(room) {
  if (room.deck.length === 0 && room.discard.length > 1) {
    const top = room.discard.pop();
    room.deck = shuffle(room.discard.map((card) => ({ ...card, chosenColor: undefined })));
    room.discard = [top];
  }

  return room.deck.pop();
}

function nextIndex(room, steps = 1) {
  const total = room.players.length;
  const active = activePlayers(room);
  if (active.length === 0) return room.currentPlayerIndex;
  if (active.length === 1) {
    return room.players.indexOf(active[0]);
  }

  let index = room.currentPlayerIndex;
  let moved = 0;
  while (moved < steps) {
    index = (index + room.direction + total) % total;
    if (!room.players[index].finished) moved += 1;
  }
  return index;
}

function currentPlayer(room) {
  return room.players[room.currentPlayerIndex];
}

function activePlayers(room) {
  return room.players.filter((player) => !player.finished);
}

function canPlay(card, top, activeColor) {
  if (!card || !top) return false;
  if (card.color === "wild") return true;
  return card.color === activeColor || card.value === top.value;
}

function createRoom(user, options = {}) {
  const host = normalizeUser(user);
  const roomCode = code();
  const room = {
    roomCode,
    name: options.name || `${host.username}'s Table`,
    hostId: host.id,
    maxPlayers: Math.min(Math.max(Number(options.maxPlayers) || 10, 2), 10),
    status: "waiting",
    players: [{ ...host, hand: [], saidUno: false, connected: true }],
    deck: [],
    discard: [],
    activeColor: null,
    direction: 1,
    currentPlayerIndex: 0,
    winner: null,
    loser: null,
    results: [],
    chat: [],
    reactions: [],
    events: [],
    startedAt: null,
  };

  rooms.set(roomCode, room);
  return room;
}

function joinRoom(roomCode, user, socketId) {
  const code = roomCode?.toUpperCase();
  const room = rooms.get(code);
  if (!room) return { ok: false, error: "Room not found." };
  cancelRoomCleanup(code);
  const player = normalizeUser(user, socketId);
  const existing = room.players.find((item) => item.id === player.id);
  if (existing) {
    existing.connected = true;
    return { ok: true, room };
  }

  if (room.status !== "waiting") return { ok: false, error: "This match already started." };
  if (room.players.length >= room.maxPlayers) return { ok: false, error: "Room is full." };

  room.players.push({ ...player, hand: [], saidUno: false, connected: true });
  pushEvent(room, `${player.username} joined the room.`);
  return { ok: true, room };
}

function disconnectPlayer(roomCode, playerId) {
  const code = roomCode?.toUpperCase();
  const room = rooms.get(code);
  if (!room) return { ok: false };
  const player = room.players.find((item) => item.id === playerId);
  if (!player) return { ok: false };

  player.connected = false;
  if (room.status === "playing") {
    pushEvent(room, `${player.username} disconnected.`);
  }

  // If everyone in this room is disconnected, schedule a cleanup grace period (2 minutes)
  const anyConnected = room.players.some((p) => p.connected);
  if (!anyConnected) {
    if (!cleanupTimers.has(code)) {
      const timer = setTimeout(() => {
        cleanupTimers.delete(code);
        const currentRoom = rooms.get(code);
        if (currentRoom && currentRoom.players.every((p) => !p.connected)) {
          rooms.delete(code);
        }
      }, 120000); // 2 minutes grace period for reconnect/reload
      cleanupTimers.set(code, timer);
    }
  }

  return { ok: true, room };
}

function leaveRoom(roomCode, playerId) {
  const code = roomCode?.toUpperCase();
  const room = rooms.get(code);
  if (!room) return { ok: false };
  const player = room.players.find((item) => item.id === playerId);
  if (!player) return { ok: false };

  if (room.status === "waiting") {
    room.players = room.players.filter((item) => item.id !== playerId);
    if (room.hostId === playerId && room.players.length > 0) {
      room.hostId = room.players[0].id;
    }
    if (room.players.length === 0) {
      cancelRoomCleanup(code);
      rooms.delete(code);
    }
  } else {
    player.connected = false;
    pushEvent(room, `${player.username} left the match.`);
    if (room.players.every((p) => !p.connected)) {
      cancelRoomCleanup(code);
      rooms.delete(code);
    }
  }
  return { ok: true };
}

function startGame(roomCode, playerId) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return { ok: false, error: "Room not found." };
  if (room.status !== "waiting") return { ok: false, error: "Game has already started." };
  if (room.hostId !== playerId) return { ok: false, error: "Only the host can start." };
  if (room.players.length < 2) return { ok: false, error: "UNO needs at least 2 players." };

  room.status = "playing";
  room.deck = makeDeck();
  room.players.forEach((player) => {
    player.hand = Array.from({ length: 7 }, () => drawFromDeck(room));
    player.saidUno = false;
    player.finished = false;
    player.placement = null;
  });

  let first = drawFromDeck(room);
  while (first.color === "wild") {
    room.deck.unshift(first);
    first = drawFromDeck(room);
  }

  room.discard = [first];
  room.activeColor = first.color;
  room.currentPlayerIndex = 0;
  room.direction = 1;
  room.winner = null;
  room.loser = null;
  room.results = [];
  room.startedAt = new Date();
  pushEvent(room, "The match started.");
  return { ok: true, room };
}

async function playCard(roomCode, playerId, cardId, chosenColor) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return { ok: false, error: "Room not found." };
  if (room.status !== "playing") return { ok: false, error: "Game is not active." };

  const player = currentPlayer(room);
  if (player.id !== playerId) return { ok: false, error: "It is not your turn." };

  const cardIndex = player.hand.findIndex((card) => card.id === cardId);
  const card = player.hand[cardIndex];
  const top = room.discard[room.discard.length - 1];
  if (!canPlay(card, top, room.activeColor)) return { ok: false, error: "That card cannot be played." };
  if (card.color === "wild" && !colors.includes(chosenColor)) {
    return { ok: false, error: "Choose a color for the wild card." };
  }

  player.hand.splice(cardIndex, 1);
  player.saidUno = false;
  const played = { ...card, chosenColor: card.color === "wild" ? chosenColor : undefined };
  room.discard.push(played);
  room.activeColor = card.color === "wild" ? chosenColor : card.color;

  const event = pushEvent(room, `${player.username} played ${cardLabel(played)}.`);
  if (player.hand.length === 0) {
    finishPlayer(room, player);
    pushEvent(room, `${player.username} finished at #${player.placement}.`);
    applyCardEffect(room, played);
    await maybeFinishMatch(room);
  } else if (player.hand.length === 1 && !player.saidUno) {
    applyCardEffect(room, played);
    pushEvent(room, `${player.username} has one card left. Say UNO fast.`);
  } else {
    applyCardEffect(room, played);
  }

  return { ok: true, room, event };
}

function applyCardEffect(room, card) {
  if (card.value === "reverse") {
    room.direction *= -1;
    if (activePlayers(room).length === 2) room.currentPlayerIndex = nextIndex(room, 2);
    else room.currentPlayerIndex = nextIndex(room, 1);
    return;
  }

  if (card.value === "skip") {
    room.currentPlayerIndex = nextIndex(room, 2);
    return;
  }

  if (card.value === "+2" || card.value === "+4") {
    const penalty = card.value === "+4" ? 4 : 2;
    const targetIndex = nextIndex(room, 1);
    const target = room.players[targetIndex];
    if (target && target.hand) {
      for (let i = 0; i < penalty; i += 1) {
        const cardToDraw = drawFromDeck(room);
        if (cardToDraw) target.hand.push(cardToDraw);
      }
      target.saidUno = false;
      pushEvent(room, `${target.username} drew ${penalty} cards.`);
    }
    room.currentPlayerIndex = nextIndex(room, 2);
    return;
  }

  room.currentPlayerIndex = nextIndex(room, 1);
}

function drawCard(roomCode, playerId) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return { ok: false, error: "Room not found." };
  if (room.status !== "playing") return { ok: false, error: "Game is not active." };

  const player = currentPlayer(room);
  if (player.finished) return { ok: false, error: "You already finished this match." };
  if (player.id !== playerId) return { ok: false, error: "It is not your turn." };

  const card = drawFromDeck(room);
  if (card) player.hand.push(card);
  player.saidUno = false;
  room.currentPlayerIndex = nextIndex(room, 1);
  const event = pushEvent(room, `${player.username} drew a card.`);
  return { ok: true, room, event };
}

function sayUno(roomCode, playerId) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return { ok: false, error: "Room not found." };
  if (room.status !== "playing") return { ok: false, error: "Game is not active." };
  const player = room.players.find((item) => item.id === playerId);
  if (!player) return { ok: false, error: "Player not found." };
  if (player.finished) return { ok: false, error: "You already finished this match." };

  if (player.hand.length === 1) {
    player.saidUno = true;
    const event = pushEvent(room, `${player.username} shouted UNO.`);
    return { ok: true, room, event };
  }

  const cardA = drawFromDeck(room);
  const cardB = drawFromDeck(room);
  if (cardA) player.hand.push(cardA);
  if (cardB) player.hand.push(cardB);
  const event = pushEvent(room, `${player.username} false-called UNO and drew 2 cards.`);
  return { ok: true, room, event };
}

function addChat(roomCode, user, message) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return { ok: false, error: "Room not found." };
  const clean = String(message || "").trim().slice(0, 240);
  if (!clean) return { ok: false, error: "Message is empty." };

  const chat = {
    id: id("chat"),
    userId: user?.id || "guest",
    username: user?.username || "Guest",
    message: clean,
    createdAt: new Date().toISOString(),
  };
  room.chat.push(chat);
  room.chat = room.chat.slice(-80);
  return { ok: true, chat };
}

function addReaction(roomCode, user, emoji) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return { ok: false, error: "Room not found." };
  const allowed = ["\u{1F525}", "\u{1F602}", "\u{1F62E}", "\u{1F480}", "\u{1F3AF}", "\u2764\uFE0F"];
  if (!allowed.includes(emoji)) return { ok: false, error: "Unsupported reaction." };

  const reaction = {
    id: id("reaction"),
    userId: user?.id || "guest",
    username: user?.username || "Guest",
    emoji,
    createdAt: new Date().toISOString(),
  };
  room.reactions.push(reaction);
  room.reactions = room.reactions.slice(-20);
  return { ok: true, reaction };
}

function getPublicRoom(roomCode, viewerId) {
  const room = rooms.get(roomCode?.toUpperCase());
  if (!room) return null;
  return {
    ...room,
    deckCount: room.deck.length,
    discardCount: room.discard.length,
    topCard: room.discard[room.discard.length - 1] || null,
    players: room.players.map((player, index) => ({
      id: player.id,
      username: player.username,
      avatarColor: player.avatarColor,
      connected: player.connected,
      cardCount: player.hand.length,
      hand: viewerId && player.id === viewerId ? player.hand : undefined,
      saidUno: player.saidUno,
      finished: Boolean(player.finished),
      placement: player.placement,
      isTurn: index === room.currentPlayerIndex && room.status === "playing" && !player.finished,
    })),
    deck: undefined,
    discard: undefined,
  };
}

function finishPlayer(room, player) {
  if (player.finished) return;
  player.finished = true;
  player.saidUno = false;
  player.placement = room.results.length + 1;
  const result = {
    userId: player.id,
    username: player.username,
    placement: player.placement,
    cardsLeft: 0,
  };
  room.results.push(result);
  if (player.placement === 1) {
    room.winner = { id: player.id, username: player.username };
  }
}

async function maybeFinishMatch(room) {
  const remaining = activePlayers(room);
  if (remaining.length > 1) return false;

  const loser = remaining[0];
  if (loser) {
    loser.finished = true;
    loser.placement = room.players.length;
    room.loser = { id: loser.id, username: loser.username };
    room.results.push({
      userId: loser.id,
      username: loser.username,
      placement: loser.placement,
      cardsLeft: loser.hand.length,
    });
    pushEvent(room, `${loser.username} is the last player left.`);
  }

  room.status = "finished";
  pushEvent(room, `${room.winner?.username || "A player"} wins the match.`);
  await recordMatch(room);
  return true;
}

function pushEvent(room, text) {
  const event = { id: id("event"), text, createdAt: new Date().toISOString() };
  room.events.push(event);
  room.events = room.events.slice(-40);
  return event;
}

function cardLabel(card) {
  const color = card.color === "wild" ? card.chosenColor || "wild" : card.color;
  return `${color.toUpperCase()} ${card.value.toUpperCase()}`;
}

async function recordMatch(room) {
  if (!process.env.MONGODB_URI) return;

  try {
    const [{ connectDB }, { default: User }, { default: Match }] = await Promise.all([
      import("../db.js"),
      import("../../models/User.js"),
      import("../../models/Match.js"),
    ]);
    await connectDB();
    await Match.create({
      roomCode: room.roomCode,
      winner: { userId: room.winner.id, username: room.winner.username },
      players: room.results.length
        ? room.results
        : room.players.map((player, index) => ({
            userId: player.id,
            username: player.username,
            placement: player.id === room.winner.id ? 1 : index + 2,
            cardsLeft: player.hand.length,
          })),
      startedAt: room.startedAt,
      endedAt: new Date(),
    });

    await Promise.all(
      room.players.map((player) => {
        if (!player.id || String(player.id).startsWith("guest") || String(player.id).startsWith("id")) {
          return Promise.resolve(null);
        }
        return User.findByIdAndUpdate(player.id, {
          $inc:
            player.id === room.winner?.id
              ? { wins: 1, coins: 75, xp: 120 }
              : { losses: 1, coins: 15, xp: 35 },
        }).catch(() => null);
      }),
    );
  } catch (error) {
    console.error("Failed to record match", error);
  }
}

module.exports = {
  createRoom,
  drawCard,
  getPublicRoom,
  joinRoom,
  leaveRoom,
  disconnectPlayer,
  cancelRoomCleanup,
  playCard,
  sayUno,
  startGame,
  addReaction,
  addChat,
  rooms,
};
