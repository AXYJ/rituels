# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Rituels: a real-time multiplayer (2-4 players) card game. Players draw and play cards; each card's symbol/color combination scores points under rules randomized at the start of each game. First to reach the score threshold wins. Live at https://rituels.xiao-web.com/.

## Commands

This is a two-package repo (`backend/`, `frontend/`) with no shared root dependencies — install each separately.

```bash
# Install (run once per package)
cd backend && npm install
cd frontend && npm install

# Run both dev servers concurrently from repo root
npm run dev

# Backend only (nodemon, auto-reload) - from backend/
npm run dev
# Backend production start - from backend/
npm start

# Frontend only - from frontend/
npm run dev      # Next.js dev server, http://localhost:3000
npm run build
npm run start
npm run lint
npm run format    # prettier --write, includes prettier-plugin-tailwindcss
```

There is no test suite in either package (backend's `npm test` is an unimplemented stub).

### Required environment variables

- Backend: `GROQ_API_KEY` (required — `gameLogic.js` throws at import time if unset), optional `GROQ_MODEL`, `GROQ_REASONING_EFFORT`, `PORT` (defaults to 3000).
- Frontend: `NEXT_PUBLIC_SOCKET_URL` (defaults to `http://localhost:4000` — note this doesn't match the backend's own default port of 3000, so set it explicitly for local dev).

## Architecture

The frontend and backend only communicate over Socket.io events — there is no REST API and no database; all game state lives in memory on the backend for the process lifetime.

**Backend (`backend/src/`)**: `server.js` creates the Socket.io server and owns the top-level `rooms` object (keyed by room code), plus shared connect/disconnect handling. Per-domain socket event handlers are split into `handlers/roomHandlers.js` (lobby: create/join/name/ready/threshold), `handlers/gameHandlers.js` (start game, play card, reset), and `handlers/chatHandlers.js` (chat), each registered onto every socket from `server.js`. All game rules (shuffling, rule generation, scoring, turn order) are pure functions in `gameLogic.js` — this is where the actual game mechanics live, not in the handlers.

**Frontend (`frontend/src/`)**: `context/GameContext.tsx` is the single global store — it owns the raw `socket.io-client` instance and all game/UI state, exposed app-wide via the `useGame()` hook. It never sets up socket listeners itself; that's delegated to `hooks/useSocketListeners.ts`, which mirrors the backend's split into `hooks/socketHandlers/{room,game,chat}Handlers.ts`. When adding a new server → client event, register it in the matching `socketHandlers/*.ts` file, not inline in the context or a component.

**Card/scoring model** (`backend/src/gameLogic.js`): each new game calls `generateRules()`, which randomly assigns the 5 symbols a shuffled value from `[3, 2, 1, 0, -1]` and the 5 colors a shuffled effect from `["Inversion", "Gel", "Répétition", "Neutre", "Neutre"]`. `calculateCardPoints` resolves a played card in two passes: first it applies the *previous* card's effect if it was "Gel" (zeroes this card's points — a remnant effect), then it applies this card's own effect ("Inversion" flips the sign; "Répétition" inherits whatever effect was actually in play on the previous turn, not the raw color effect). Any change to scoring must account for both passes, since they aren't symmetric.

**Player identity vs. socket id**: `Player.id` is the live `socket.id`, but a separate client-generated `sessionId` (stored in `localStorage`, sent on every `create_game`/`join_game`) is what actually identifies a person across reconnects/tab refreshes. `join_game` in `roomHandlers.js` looks up by `sessionId` first and, if found, remaps the player's `id` and `room.playerOrder` to the new socket id. Code that needs to persist identity across a reconnect must key off `sessionId`, not `socket.id`.

**Chat/name moderation**: `send_message` and `change_name` both go through Groq-backed LLM moderation (`moderatePseudo` / `moderateMessage` in `gameLogic.js`) before being broadcast — messages aren't filtered by a static wordlist.

**Deployment**: frontend on Vercel, backend on Render. The frontend's keep-alive `fetch` in `useSocketListeners.ts` (every 5 min) exists specifically to stop Render's free-tier backend from idling.
