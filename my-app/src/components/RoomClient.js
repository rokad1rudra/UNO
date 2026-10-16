"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import UnoCard from "@/components/UnoCard";

const colorChoices = ["red", "yellow", "green", "blue"];
const emojis = ["\u{1F525}", "\u{1F602}", "\u{1F62E}", "\u{1F480}", "\u{1F3AF}", "\u2764\uFE0F"];

export default function RoomClient({ roomCode }) {
  const socketRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [wildCard, setWildCard] = useState(null);
  const [toast, setToast] = useState("");

  const me = useMemo(() => room?.players?.find((player) => player.id === user?.id), [room, user]);
  const activePlayer = room?.players?.find((player) => player.isTurn);
  const results = useMemo(
    () => [...(room?.results || [])].sort((a, b) => a.placement - b.placement),
    [room],
  );

  const loadRoom = useCallback(() => {
    socketRef.current?.emit("room:get", { roomCode }, (response) => {
      if (response?.ok) {
        setRoom(response.room);
        setError("");
      } else {
        setError(response?.error || "Room not found.");
      }
    });
  }, [roomCode]);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) setUser((await response.json()).user);
      else window.location.href = "/login";
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const nextSocket = io({ withCredentials: true });
    socketRef.current = nextSocket;

    const join = () => {
      nextSocket.emit("room:join", { roomCode }, (response) => {
        if (response?.ok) {
          setRoom(response.room);
          setError("");
        } else {
          setError(response?.error || "Could not connect to room.");
        }
      });
    };

    nextSocket.on("connect", join);
    if (nextSocket.connected) {
      join();
    }

    nextSocket.on("connect_error", (err) => {
      setError(err?.message ? `Connection error: ${err.message}` : "Could not connect to game server.");
    });
    nextSocket.on("room:changed", loadRoom);
    nextSocket.on("game:event", (event) => {
      if (event?.text) setToast(event.text);
    });
    nextSocket.on("chat:new", loadRoom);
    nextSocket.on("reaction:new", (reaction) => {
      if (reaction?.username && reaction?.emoji) {
        setToast(`${reaction.username}: ${reaction.emoji}`);
      }
      loadRoom();
    });
    return () => {
      socketRef.current = null;
      nextSocket.disconnect();
    };
  }, [user, roomCode, loadRoom]);

  function emit(name, payload = {}) {
    setError("");
    socketRef.current?.emit(name, { roomCode, ...payload }, (response) => {
      if (!response?.ok) setError(response?.error || "Action failed.");
      loadRoom();
    });
  }

  function play(card, chosenColor) {
    if (card.color === "wild" && !chosenColor) {
      setWildCard(card);
      return;
    }
    emit("game:play", { cardId: card.id, chosenColor });
    setWildCard(null);
  }

  function sendChat(event) {
    event.preventDefault();
    if (!message.trim()) return;
    emit("chat:send", { message });
    setMessage("");
  }

  if (error && !room) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-red-950/20 p-8 text-center text-red-100 shadow-xl backdrop-blur">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/20 text-3xl font-black text-red-400">
          !
        </div>
        <h2 className="mb-2 text-2xl font-black">{error}</h2>
        <p className="mb-6 text-sm text-zinc-300">
          The room code <span className="font-bold text-yellow-300">{roomCode}</span> may not exist, might have expired, or the table was closed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => loadRoom()}
            className="rounded border border-white/20 bg-white/10 px-5 py-2.5 font-bold text-white hover:bg-white/20"
          >
            Retry
          </button>
          <a
            href="/create-room"
            className="rounded bg-red-500 px-5 py-2.5 font-bold text-white hover:bg-red-600"
          >
            Create Table
          </a>
          <a
            href="/join-room"
            className="rounded bg-blue-500 px-5 py-2.5 font-bold text-white hover:bg-blue-600"
          >
            Join Table
          </a>
          <a
            href="/dashboard"
            className="rounded bg-yellow-300 px-5 py-2.5 font-black text-zinc-950 hover:bg-yellow-400"
          >
            Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!room) return <div className="mx-auto max-w-3xl p-6 text-zinc-300">Loading room...</div>;

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black sm:text-3xl">{room.name}</h1>
          <p className="text-sm text-zinc-400">Code <span className="font-black text-yellow-200">{room.roomCode}</span> · {room.status}</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {room.status === "waiting" && room.hostId === user?.id && (
            <button onClick={() => emit("game:start")} className="min-h-11 flex-1 rounded bg-yellow-300 px-4 py-2 font-black text-zinc-950 glow-button sm:flex-none">Start</button>
          )}
          <button onClick={() => navigator.clipboard?.writeText(room.roomCode)} className="min-h-11 flex-1 rounded border border-white/15 px-4 py-2 font-bold sm:flex-none">Copy Code</button>
          <button
            onClick={() => {
              emit("room:leave");
              window.location.href = "/dashboard";
            }}
            className="min-h-11 flex-1 rounded border border-red-400/30 bg-red-500/10 px-4 py-2 font-bold text-red-200 hover:bg-red-500/20 sm:flex-none"
          >
            Leave
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
      {toast && <p className="mb-4 rounded border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-sm text-yellow-100">{toast}</p>}
      {room.status === "finished" && (
        <section className="mb-5 rounded-lg border border-yellow-300/30 bg-yellow-300/10 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-yellow-200">Match Complete</p>
              <h2 className="mt-1 text-2xl font-black">{room.winner?.username} wins</h2>
              {room.loser && <p className="mt-1 text-sm text-zinc-300">{room.loser.username} finished last.</p>}
            </div>
            <button onClick={() => (window.location.href = "/dashboard")} className="rounded bg-yellow-300 px-4 py-2 font-black text-zinc-950">
              Back to Dashboard
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((result) => (
              <div key={`${result.userId}-${result.placement}`} className="rounded border border-white/10 bg-zinc-950/70 p-3">
                <p className="text-xs uppercase text-zinc-500">Place #{result.placement}</p>
                <p className="truncate font-black">{result.username}</p>
                <p className="text-xs text-zinc-400">{result.cardsLeft} cards left</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-3 sm:p-4">
          <div className="mb-4 grid gap-2 sm:mb-6 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
            {room.players.map((player) => (
              <div key={player.id} className={`rounded border p-3 ${player.isTurn ? "border-yellow-300 bg-yellow-300/10" : "border-white/10 bg-zinc-950/60"}`}>
                <div className="flex items-center gap-3">
                  <span className="size-4 rounded-full" style={{ background: player.avatarColor }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {player.username}
                      {!player.connected && <span className="ml-2 text-xs text-red-400 font-normal">(offline)</span>}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {player.finished ? `Place #${player.placement}` : `${player.cardCount} cards${player.saidUno ? " · UNO" : ""}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid min-h-56 place-items-center rounded-lg border border-white/10 bg-zinc-950/70 p-4 sm:min-h-72 sm:p-5">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <UnoCard back />
                <p className="mt-2 text-sm text-zinc-400">{room.deckCount} left</p>
              </div>
              <div className="text-center">
                <UnoCard card={room.topCard} />
                <p className="mt-2 text-sm text-zinc-400">Active color: <span className="font-bold text-white">{room.activeColor || "none"}</span></p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold">
              {room.status === "finished" ? "Game finished" : activePlayer ? `${activePlayer.username}'s turn` : "Waiting for players"}
            </p>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
              <button onClick={() => emit("game:draw")} disabled={!me?.isTurn} className="rounded bg-blue-500 px-4 py-2 font-black disabled:opacity-40">Draw Card</button>
              <button onClick={() => emit("game:uno")} disabled={room.status !== "playing" || me?.finished} className="rounded bg-red-500 px-4 py-2 font-black disabled:opacity-40">Say UNO</button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-lg font-black">Your Hand</h2>
            <div className="grid min-h-28 grid-cols-4 gap-2 pb-4 sm:flex sm:min-h-36 sm:gap-3 sm:overflow-x-auto">
              {(me?.hand || []).map((card) => (
                <UnoCard key={card.id} card={card} disabled={!me?.isTurn || room.status !== "playing" || me?.finished} onClick={() => play(card)} />
              ))}
              {!me?.hand?.length && <p className="text-zinc-400">No cards visible yet.</p>}
            </div>
          </div>
        </section>

        <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-3 sm:p-4">
          <h2 className="text-xl font-black">Chat</h2>
          <div className="mt-3 h-72 space-y-3 overflow-y-auto rounded bg-zinc-950/70 p-3">
            {room.chat?.map((chat) => (
              <p key={chat.id} className="text-sm"><span className="font-bold text-yellow-200">{chat.username}:</span> {chat.message}</p>
            ))}
            {room.events?.slice(-8).map((event) => (
              <p key={event.id} className="text-xs text-zinc-500">{event.text}</p>
            ))}
          </div>
          <form onSubmit={sendChat} className="mt-3 flex gap-2">
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message" className="min-w-0 flex-1 rounded border border-white/10 bg-zinc-950 px-3 py-2 outline-none focus:border-yellow-300" />
            <button className="rounded bg-yellow-300 px-3 font-black text-zinc-950">Send</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button key={emoji} onClick={() => emit("reaction:send", { emoji })} className="rounded border border-white/10 bg-zinc-950 px-3 py-2 text-xl">{emoji}</button>
            ))}
          </div>
          {room.winner && <p className="mt-4 rounded border border-green-400/30 bg-green-500/10 p-4 font-black text-green-200">{room.winner.username} wins!</p>}
        </aside>
      </div>

      {wildCard && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <h2 className="mb-4 text-xl font-black">Choose a color</h2>
            <div className="grid grid-cols-2 gap-3">
              {colorChoices.map((color) => (
                <button key={color} onClick={() => play(wildCard, color)} className={`card-${color} rounded px-8 py-5 font-black uppercase`}>
                  {color}
                </button>
              ))}
            </div>
            <button
              onClick={() => setWildCard(null)}
              className="mt-4 w-full rounded border border-white/20 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
