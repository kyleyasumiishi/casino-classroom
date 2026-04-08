# Casino Classroom

A single-page web app that teaches complete beginners how to play blackjack, baccarat, and craps through structured lessons, then lets them practice at virtual tables with fake chips.

https://casino-classroom.vercel.app/

## Games

- **Blackjack** — Hit, stand, double down, split. 6-deck shoe, dealer stands on all 17s, 3:2 blackjack payout.
- **Baccarat** — Punto Banco with automatic third-card rules, 5% banker commission, 8:1 tie payout.
- **Craps** — Full bet surface: pass/don't pass, come/don't come, odds, place, field, hardways, and propositions. Beginner mode hides sucker bets.

Each game has a **Learn** mode (structured lessons with cheat sheets) and a **Play** mode (virtual table simulation).

## Tech Stack

| Tool | Version |
|---|---|
| React | ^18.3 |
| TypeScript | ^5.5 |
| Vite | ^5.4 |
| Tailwind CSS | ^3.4 |
| React Router | ^6.26 |
| Zustand | ^4.5 |
| Vitest | ^2.0 |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Type check
npx tsc --noEmit

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/        # React components
│   ├── layout/        # AppShell, Header
│   ├── lobby/         # Game selection
│   ├── learn/         # Lesson viewer, cheat sheets
│   ├── play/
│   │   ├── common/    # Card, BettingControls, ActionButton
│   │   ├── blackjack/ # Blackjack table & page
│   │   ├── baccarat/  # Baccarat table & page
│   │   └── craps/     # Craps table, dice, bet zones
│   └── shared/        # NotFound, ResetButton, OutOfChips
├── data/              # Lesson content, game configs
├── engine/            # Pure game logic (no React)
├── hooks/             # Game state machines (useBlackjack, useBaccarat, useCraps)
├── store/             # Zustand wallet store
├── types/             # TypeScript type definitions
└── utils/             # Shuffle, storage helpers
```

## Design

- Mobile-first (primary target: iPhone 14 Pro, 393px)
- Casino theme: felt green, cream, gold accents
- `prefers-reduced-motion` respected
- Keyboard accessible
- Shared chip balance persisted in localStorage

## Deploy

```bash
npm run build
vercel --prod
```
