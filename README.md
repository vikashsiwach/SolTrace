# SolTrace

SolTrace is a sleek Expo + React Native app for exploring Solana wallets, tracking balances, saving watchlists, sending SOL, and swapping tokens through Jupiter.

It is built for fast wallet inspection with a mobile-first UI and persistent local state, while also supporting wallet connect flows through the Solana Mobile Wallet Adapter.

## Highlights

- Explore any Solana wallet address on Mainnet or Devnet
- View SOL balance, token holdings, and recent transactions
- Connect a mobile wallet and instantly inspect the connected address
- Send SOL directly from the app
- Swap supported tokens through Jupiter on Mainnet
- Save favorite wallets to a watchlist
- Keep recent searches with swipe-to-delete history
- Persist app data locally with MMKV + Zustand

## Demo Video
https://github.com/user-attachments/assets/34142521-962c-4be1-895d-ceb612e878e5

## Tech Stack

- Expo Router
- React Native
- TypeScript
- Zustand
- React Native MMKV
- Solana Web3.js
- Solana Mobile Wallet Adapter
- Jupiter Swap API

## App Flow

### 1. Wallet Explorer

The main screen lets users search any Solana wallet address and fetch:

- SOL balance
- SPL token accounts with non-zero balances
- Recent transactions

It also supports:

- loading the connected wallet automatically
- saving wallets to favorites
- opening token detail pages
- opening transactions on Solscan

### 2. Swap

The swap screen integrates Jupiter quotes and swap transactions for supported tokens:

- SOL
- USDC
- USDT
- BONK
- JUP
- WIF

Users can:

- pick input and output tokens
- get live quote previews
- inspect route, rate, and price impact
- sign and execute swaps from the connected wallet

Note: swaps are Mainnet-only in the current implementation.

### 3. Settings

The settings screen allows users to:

- switch between Mainnet and Devnet
- open the saved wallet watchlist
- review search history counts
- clear stored search history

### 4. Watchlist

Favorited wallets are stored locally and displayed with live balance refresh support.

## Project Structure

```text
SolTrace/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Wallet explorer
│   │   ├── swap.tsx         # Token swap UI
│   │   ├── settings.tsx     # Network + data settings
│   │   └── _layout.tsx      # Bottom tab navigation
│   ├── send.tsx             # SOL transfer screen
│   ├── token/[mint].tsx     # Token detail screen
│   └── watchlist.tsx        # Saved wallets
├── src/
│   ├── components/          # Reusable UI pieces
│   ├── hooks/               # Wallet logic
│   ├── lib/                 # Local storage adapter
│   ├── services/            # RPC + Jupiter helpers
│   └── stores/              # Zustand state store
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo CLI tooling
- Android Studio or Xcode for native runs

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_JUPITER_API_KEY=your_jupiter_api_key
```

### Run The App

```bash
npm run start
```

For native targets:

```bash
npm run android
npm run ios
```

For web:

```bash
npm run web
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run start` | Start the Expo development server |
| `npm run android` | Run the app on Android |
| `npm run ios` | Run the app on iOS |
| `npm run web` | Run the app in the browser |


## Current Notes

- Wallet connect and signing are built around the Solana Mobile Wallet Adapter flow
- Jupiter swaps are disabled on Devnet
- Local persistence is handled with MMKV-backed Zustand storage

## Why SolTrace

SolTrace combines wallet exploration, lightweight portfolio checking, transaction inspection, sending, and swapping into one focused mobile experience for the Solana ecosystem.


## License

This project is private.
