# 🏮 Sam Poo Kong Digital Tour Guide

Panduan digital interaktif untuk Klenteng Sam Poo Kong, Semarang.

## Struktur Proyek

```
sampokong/
├── client/          # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
├── server/          # Backend (Express.js)
│   ├── index.js
│   ├── package.json
│   └── .env
├── package.json     # Root scripts (menjalankan keduanya)
└── README.md
```

## Cara Menjalankan

### 1. Install semua dependencies

```bash
npm run install:all
```

### 2. Jalankan keduanya (frontend + backend)

```bash
npm install        # Install concurrently di root
npm run dev        # Jalankan client & server bersamaan
```

### 3. Jalankan secara terpisah

```bash
# Frontend saja (port 5173)
npm run dev:client

# Backend saja (port 3001)
npm run dev:server
```

## Konfigurasi

### Client (.env)
- `VITE_FIREBASE_*` — Konfigurasi Firebase
- `VITE_MIDTRANS_CLIENT_KEY` — Client key Midtrans
- `VITE_API_URL` — URL backend API

### Server (.env)
- `MIDTRANS_SERVER_KEY` — Server key Midtrans
- `MIDTRANS_CLIENT_KEY` — Client key Midtrans
- `PORT` — Port server (default: 3001)
- `FRONTEND_URL` — URL frontend untuk CORS
