# UNO Arena

A complete real-time multiplayer UNO website built with Next.js App Router, JavaScript, Tailwind CSS, Socket.io, and MongoDB Atlas.

## Features

- Landing page, auth, dashboard, create room, join room, game room, leaderboard, profile, rules
- Real-time Socket.io rooms for 2-10 players
- Full UNO deck: red, yellow, green, blue, 0-9, Skip, Reverse, +2, Wild, +4
- Turn validation, draw button, Say UNO button, UNO penalty, winner detection
- In-game chat and emoji reactions
- MongoDB Atlas users, profiles, match history, leaderboard
- Server memory for live game state
- Optional Upstash Redis placeholders for future scaling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/uno-arena
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run the Socket.io-enabled Next server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Notes

- The live room state is stored in memory inside `server.js`.
- MongoDB stores users, match history, profile stats, XP, coins, wins, and losses.
- For production, deploy to a Node runtime that supports custom servers and sticky WebSocket sessions.
- Redis or Upstash can later replace the in-memory `rooms` map in `src/lib/game/uno-engine.js`.
