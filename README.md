# PokeAPI Explorer 🚀

A modern, lightning-fast, and fully-featured Pokémon Explorer built with a **Backend-For-Frontend (BFF)** architecture. This project connects to the public [PokeAPI](https://pokeapi.co/) and provides a seamless, highly responsive user interface to browse Pokémon, Items, Berries, Moves, Machines, and Regions.

## ✨ Features

- 📚 **Comprehensive Pokédex**: Browse thousands of Pokémon with real-time search, filtering by type/generation, and dynamic pagination.
- 🧬 **Interactive Evolution Chains**: View complete evolution family trees with leveling and item requirements.
- 🗺️ **Region-First Maps**: Navigate the Pokémon world by Region (Kanto, Johto, etc.) and explore specific routes and locations.
- 🎒 **Items & Berries**: Detailed views for items, including customized flavor profiles and farming statistics for Berries.
- 💿 **Machines (TMs/HMs/TRs)**: Search and view technical machines, identifying exactly what moves they teach across every game generation.
- ⚡ **BFF Caching Architecture**: An Express backend proxies PokeAPI requests and heavily caches data in-memory to guarantee instant search and filtering on the frontend.
- 🎨 **Premium UI/UX**: Designed with Tailwind CSS, utilizing glassmorphism, fluid animations, and a sleek dark mode.

---

## 🛠️ Technology Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

**Backend (BFF)**
- Node.js
- Express
- TypeScript
- Axios
- In-memory Caching

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Setup the Backend
The backend runs an Express server that acts as a proxy and cache for PokeAPI.

```bash
cd backend
npm install
npm run dev
```
The backend will start on `http://localhost:3001`. On startup, it will fetch and cache the primary indices from PokeAPI for fast searching.

### 2. Setup the Frontend
The frontend is a Next.js application.

```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`.

---

## 🏗️ Architecture (Backend-For-Frontend)

This application strictly adheres to the BFF pattern:
1. **Frontend**: Never communicates directly with `pokeapi.co`. It only makes requests to our local `localhost:3001` backend.
2. **Backend**: Fetches large payloads (like all 1000+ Pokémon names and URLs) from `pokeapi.co` once, stores them in memory, and handles all the heavy lifting for searching, filtering, and pagination.
3. **Performance**: Because the frontend asks the backend for exactly what it needs (e.g., "Give me page 2 of Fire-type Pokémon"), the frontend remains extremely lightweight, and network requests are instantaneous.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
