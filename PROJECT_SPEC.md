# Casino Classroom — Project Specification

## Overview

Casino Classroom is a single-page web app that teaches complete beginners how to play blackjack, baccarat, and craps through structured lessons, then lets them practice at virtual tables with fake chips. Each game offers a Learn mode (section-by-section lessons covering rules, bet types, payouts, and strategy) and a Play mode (fully functional table simulation with chip wagering). The app is designed for someone who has never set foot in a casino — the learning experience is the heart of the product.

**Estimated scope:** ~50 source files, ~5,500 lines of code (excluding generated lesson content data files)

## Tech Stack & Rationale

| Dependency | Version | Rationale |
|---|---|---|
| **React** | ^18.3 | Component model fits the game UI (cards, dice, chips, table layouts). Your standard stack. |
| **Vite** | ^5.4 | Fast HMR, simple config, first-class TypeScript support. |
| **TypeScript** | ^5.5 | Game logic has complex state (craps especially) — strict typing prevents payout bugs and state corruption. |
| **Tailwind CSS** | ^3.4 | Utility-first styling keeps casino theming co-located with components. No context-switching to CSS files, which is ideal for AI-assisted development. |
| **React Router** | ^6.26 | `createBrowserRouter` + `RouterProvider` for lobby → game → mode routing. Supports nested layouts cleanly. |
| **Zustand** | ^4.5 | Lightweight global state for shared chip balance and game settings. Simpler than Redux, more structured than raw Context for cross-game state like the chip wallet. Built-in localStorage middleware for persistence. |
| **Vitest** | ^2.0 | Fast, Vite-native test runner. No config overhead. |
| **@testing-library/react** | ^16.0 | Behavior-driven component testing. Query by role/text, not implementation details. |
| **@testing-library/user-event** | ^14.5 | Realistic user interaction simulation (full event sequences, not raw fireEvent). |
| **Vercel CLI** | ^37.0 | One-command deploy to Vercel. Native SPA routing support (no hash URLs), edge CDN, preview deploys on PRs. Already in your workflow from previous projects. |

## Scope

### In Scope
- Casino lobby page with game selection (blackjack, baccarat, craps)
- Learn mode for each game: structured, section-by-section lessons covering rules, every bet type, payout odds, basic strategy tips, and a quick-reference cheat sheet
- Play mode for each game: fully functional table simulation with chip wagering
- Blackjack: hit, stand, double down, split, insurance, dealer AI (stands on soft 17), 3:2 blackjack payout
- Baccarat (Punto Banco): player/banker/tie bets, automatic third-card draw rules, commission tracking
- Craps: full bet surface (pass/don't pass, come/don't come, odds, place, field, hardways, proposition bets, big 6/8), point tracking, beginner layout toggle
- Shared chip balance (starting 1,000) persisted in localStorage across all three games
- Simple SVG card graphics and dice animations
- Mobile-first responsive design (primary target: iPhone 14 Pro / 393×852 viewport on Firefox iOS, also usable on tablet/desktop)
- Keyboard accessibility baseline

### Out of Scope
- Multiplayer / real-time play
- Real money / payment integration
- User accounts / authentication / backend / database
- Card counting tools or advanced strategy calculators
- Bet history tracking or statistics dashboard
- Mobile-native app (this is a mobile-first PWA/web app, not a native iOS/Android app)
- Sound effects or music
- Configurable number of decks (v2)
- Blackjack basic strategy chart with percentage odds (v2)

## Table Rules for This App

These are the exact game rules the simulation follows. When in doubt, reference this section — not general "Vegas rules," which vary by casino.

### Blackjack Table Rules
- **Deck:** 6-deck shoe, reshuffled when ~75% dealt (no cut card simulation needed — just reshuffle)
- **Dealer:** Stands on all 17s (including soft 17)
- **Blackjack pays:** 3:2
- **Double down:** Allowed on any two cards, including after splitting
- **Splitting:** Allowed on any matching rank (e.g., two 8s, two Kings). Split Aces receive exactly one card each — no further hitting. Re-splitting is NOT allowed (max two hands from one split).
- **Insurance:** Offered when dealer shows an Ace. Pays 2:1. Costs up to half the original bet. Dealer peeks for blackjack — if dealer has blackjack, the round resolves immediately.
- **Surrender:** Not available in this app
- **Minimum bet:** 5 chips. **Maximum bet:** 500 chips.

### Baccarat Table Rules
- **Variant:** Punto Banco (standard North American rules)
- **Deck:** 8-deck shoe, reshuffled when ~75% dealt (abstracted — no cut card)
- **Third-card rules:** Standard Punto Banco tableau (see lesson content for full rules)
- **Banker commission:** 5% on Banker wins, deducted automatically from payout
- **Tie behavior:** Player and Banker bets push on a tie (returned to player). Only Tie bets win.
- **Minimum bet:** 5 chips. **Maximum bet:** 500 chips. Can bet on multiple outcomes simultaneously.

### Craps Table Rules
- **Dice:** Two standard 6-sided dice, random roll
- **Pass/Don't Pass:** Standard rules. Don't Pass bar 12 (come-out 12 is a push, not a win).
- **Odds bets:** 3x-4x-5x odds allowed (3x on 4/10, 4x on 5/9, 5x on 6/8). Must have a Pass/Come base bet.
- **Place bets:** Available during point phase only. Working on point rolls, OFF on come-out rolls by default.
- **Buy bets:** NOT playable in MVP — taught in lessons for awareness only.
- **Come/Don't Come:** Standard traveling bet rules. Odds can be placed once the bet travels to a number.
- **Field bet:** One-roll bet. Wins on 2, 3, 4, 9, 10, 11, 12. Loses on 5, 6, 7, 8. Pays 1:1 on most numbers, **2:1 on both 2 and 12** (this is the "double" field variant, not the "triple 12" variant where 12 pays 3:1). House edge: 5.56%.
- **Proposition bets:** One-roll bets, resolved immediately on next roll.
- **Hardway bets:** Standing bets, lose on easy number or 7.
- **Minimum bet:** 5 chips per bet zone. **Maximum bet:** 500 chips per bet zone.
- **Bet removal:** Place bets and odds bets can be removed at any time before a roll. Pass/Don't Pass and Come/Don't Come bets CANNOT be removed once a point is established (per real casino rules).

## Critical Instructions for Claude Code

### Workflow Rules
1. **Phase discipline.** Complete each phase fully before moving to the next. Do not skip ahead or partially implement future phases.
2. **Checkpoint at every phase boundary.** After completing a phase, stop and present the checkpoint summary. Wait for user review before proceeding.
3. **Tests alongside implementation.** Write tests in the same phase as the code they test. Never defer testing to a later phase.
4. **Git commit after each phase.** Every Definition of Done includes a commit step. This gives clean rollback points.
5. **Game logic purity.** Keep game logic (payout calculations, card evaluation, dice rules) in pure functions separate from React components. This makes them testable without rendering.
6. **Content data is separate.** Lesson content lives in dedicated data files (`src/data/lessons/`), not inline in components. The content will be generated separately and dropped into these files.

### Common Mistakes to Avoid

1. **SVG attributes must use camelCase in JSX.** `strokeWidth` not `stroke-width`, `fillOpacity` not `fill-opacity`, `viewBox` not `viewbox`. `class` must be `className`. This is the most common JSX mistake when building card/dice SVG components.

2. **Use `createBrowserRouter` + `RouterProvider` in React Router v6.** Not `<BrowserRouter>`. Use `<Outlet />` in layout components. Use `useParams()` to read URL params, `useNavigate()` for programmatic navigation. Don't use the v5 `<Switch>` API.

3. **Derived values should be computed, not stored.** If `handTotal` can be computed from `cards`, don't store it as separate state — compute it inline or with `useMemo`. Stored derived state gets out of sync. This applies heavily to: blackjack hand values, baccarat hand totals, craps point status.

4. **Fisher-Yates shuffle for deck randomization.** Don't use `.sort(() => Math.random() - 0.5)` — it's biased. Use a proper Fisher-Yates implementation. Store the shuffled deck in state to prevent re-shuffling on every render.

5. **Initialize state from localStorage with a function.** Use `useState(() => loadFromStorage())` to avoid reading localStorage on every render. Always wrap `JSON.parse` in try/catch with a fallback default. Include a `version` field in persisted state for future migration.

6. **Controlled components — store game state in the game engine, pass as props.** Card hands, chip counts, bet amounts, and game phase should live in the game's state hook, passed down to display components. Don't use `useRef` for values that affect rendering.

7. **Never use `\n` for line breaks in JSX.** Use separate `<p>` elements or `<br />`. Template literals with newlines inside JSX render as single-line text. This matters for lesson content rendering.

8. **Key prop on `.map()` lists.** Every `.map()` rendering cards, chips, bet options, or lesson sections needs a stable, unique `key`. Use card IDs, bet type enums, section slugs — never array index for lists that can change.

9. **Vercel SPA routing.** Vercel handles SPA routing natively, so use `createBrowserRouter` (not `createHashRouter`). No special config needed — Vercel automatically rewrites all routes to `index.html`.

10. **Craps payout precision.** Use integer math for payouts (e.g., store bets in whole chip units, compute payouts as ratios of integers) to avoid floating-point rounding errors. A 6:5 payout on a 5-chip bet is 6, not 5.999999.

11. **Touch targets must be at least 44×44px.** Every button, bet zone, chip selector, and interactive element needs a minimum tap target of 44×44px for mobile usability (Apple HIG). This is the most common mobile UX failure — elements that work fine with a mouse cursor but are impossible to tap accurately on a phone. Use `min-h-11 min-w-11` in Tailwind (44px).

12. **iOS WebKit auto-zoom on small text inputs.** If any `<input>`, `<select>`, or `<textarea>` has a font size below 16px, iOS WebKit will auto-zoom the viewport on focus, breaking the layout. Always use `text-base` (16px) or larger on form elements. This is a WebKit behavior that affects ALL iOS browsers including Firefox (which uses WebKit on iOS).

13. **Use `-webkit-` prefixes for iOS animations.** Firefox on iOS is WebKit under the hood, not Gecko. If you use CSS animations or transitions, ensure `-webkit-` prefixed versions are included (Autoprefixer handles this, but verify it's in the PostCSS config). Test with `transform` and `transition` properties specifically.

14. **Mobile-first Tailwind classes.** Write unprefixed classes for mobile (393px), then use `md:` (768px) and `lg:` (1280px) for larger screens. Wrong: `grid-cols-3 sm:grid-cols-1`. Right: `grid-cols-1 md:grid-cols-3`. The default (unprefixed) styles ARE the mobile styles in Tailwind.

15. **`100vh` is unreliable on iOS.** The iOS Safari/WebKit address bar causes `100vh` to be taller than the visible viewport. Use `100dvh` (dynamic viewport height) instead, or `min-height: -webkit-fill-available` as a fallback. This matters for full-screen table layouts.

## File & Folder Structure

```
casino-classroom/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                          # App entry point
│   ├── App.tsx                           # Router setup, global layout
│   ├── index.css                         # Tailwind directives, global resets, casino theme vars
│   │
│   ├── types/
│   │   ├── common.ts                     # Shared types: Chip, GameType, GameMode
│   │   ├── blackjack.ts                  # Card, Hand, BlackjackGameState, BlackjackAction
│   │   ├── baccarat.ts                   # BaccaratBet, BaccaratHand, BaccaratGameState
│   │   ├── craps.ts                      # CrapsBet, CrapsBetType, CrapsGameState, DiceRoll
│   │   └── lesson.ts                     # LessonSection, CheatSheetEntry, LessonData
│   │
│   ├── data/
│   │   ├── lessons/
│   │   │   ├── blackjack.ts              # Full blackjack lesson content
│   │   │   ├── baccarat.ts               # Full baccarat lesson content
│   │   │   └── craps.ts                  # Full craps lesson content
│   │   └── gameConfigs.ts                # Game metadata (names, descriptions, icons, routes)
│   │
│   ├── engine/
│   │   ├── deck.ts                       # createDeck, drawCard. Imports shuffle from utils/shuffle.ts.
│   │   ├── deck.test.ts
│   │   ├── blackjack.ts                  # evaluateHand, dealerShouldHit, getAvailableActions, resolveHand, calculatePayout
│   │   ├── blackjack.test.ts
│   │   ├── baccarat.ts                   # evaluateHand, shouldDrawThird (player/banker rules), resolveBaccarat, calculatePayout
│   │   ├── baccarat.test.ts
│   │   ├── craps.ts                      # rollDice, resolveBets, calculatePayout, isPointEstablished, PAYOUT_TABLE
│   │   ├── craps.test.ts
│   │   └── chips.ts                      # chipDenominations, calculateChipBreakdown, formatChipAmount
│   │
│   ├── store/
│   │   └── useWallet.ts                  # Zustand store: chipBalance, bet/win/lose, reset, localStorage persist
│   │
│   ├── hooks/
│   │   ├── useBlackjack.ts               # Game state machine: deal, hit, stand, double, split, resolve
│   │   ├── useBlackjack.test.ts
│   │   ├── useBaccarat.ts                # Game state machine: placeBet, deal, resolveRound
│   │   ├── useBaccarat.test.ts
│   │   ├── useCraps.ts                   # Game state machine: placeBets, roll, resolveRoll, point tracking
│   │   ├── useCraps.test.ts
│   │   ├── useLesson.ts                  # Lesson navigation: currentSection, next, prev, progress
│   │   └── useLesson.test.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Top-level layout: header, main content, footer
│   │   │   ├── Header.tsx                # App title, chip balance display, nav back to lobby
│   │   │   └── ChipDisplay.tsx           # Animated chip count in header
│   │   │
│   │   ├── lobby/
│   │   │   ├── LobbyPage.tsx             # Game selection grid with Learn/Play choices
│   │   │   └── GameCard.tsx              # Individual game card: icon, name, description, Learn/Play buttons
│   │   │
│   │   ├── learn/
│   │   │   ├── LearnPage.tsx             # Lesson viewer: sidebar nav + content area
│   │   │   ├── LessonNav.tsx             # Section sidebar with progress indicators
│   │   │   ├── LessonContent.tsx         # Renders current section content (markdown-like)
│   │   │   ├── CheatSheet.tsx            # Quick-reference overlay/drawer
│   │   │   └── PayoutTable.tsx           # Formatted payout odds table (reused in learn + play)
│   │   │
│   │   ├── play/
│   │   │   ├── common/
│   │   │   │   ├── BettingControls.tsx   # Chip selector, bet amount, deal/roll button
│   │   │   │   ├── ChipStack.tsx         # Visual chip stack SVG
│   │   │   │   ├── ActionButton.tsx      # Styled game action button (Hit, Stand, Roll, etc.)
│   │   │   │   ├── GameMessage.tsx       # Result banner (win/lose/push with amount)
│   │   │   │   └── Card.tsx              # SVG playing card component (face up/down, rank, suit)
│   │   │   │
│   │   │   ├── blackjack/
│   │   │   │   ├── BlackjackTable.tsx    # Full blackjack table layout: dealer hand, player hand(s), controls
│   │   │   │   ├── HandDisplay.tsx       # Renders a hand of cards with running total
│   │   │   │   └── BlackjackPage.tsx     # Orchestrates useBlackjack + BettingControls + Table
│   │   │   │
│   │   │   ├── baccarat/
│   │   │   │   ├── BaccaratTable.tsx     # Player/Banker layout with card positions
│   │   │   │   ├── BetSelector.tsx       # Player / Banker / Tie bet selection
│   │   │   │   └── BaccaratPage.tsx      # Orchestrates useBaccarat + betting + table
│   │   │   │
│   │   │   └── craps/
│   │   │       ├── CrapsTable.tsx        # Dual-layout: mobile card-based + desktop SVG table
│   │   │       ├── CrapsBetZone.tsx      # Individual clickable bet area on the table
│   │   │       ├── DiceDisplay.tsx       # SVG dice with roll animation
│   │   │       ├── PointMarker.tsx       # ON/OFF puck indicator
│   │   │       ├── BeginnerToggle.tsx    # Toggle between beginner (smart bets) and full table
│   │   │       └── CrapsPage.tsx         # Orchestrates useCraps + table + controls
│   │   │
│   │   └── shared/
│   │       ├── NotFound.tsx              # 404 page with link back to lobby
│   │       └── ResetButton.tsx           # Reset chips to 1,000 (with confirmation)
│   │
│   └── utils/
│       ├── shuffle.ts                    # Fisher-Yates shuffle implementation
│       ├── shuffle.test.ts
│       ├── storage.ts                    # localStorage helpers with versioning and try/catch
│       └── storage.test.ts
│
├── index.html                         # Must include: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"> to prevent iOS auto-zoom
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

**.gitignore:**
```
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
```

## Routing Plan

Uses `createBrowserRouter` for clean URLs. Vercel handles SPA routing natively — no server config needed.

| Path | Component | Description |
|---|---|---|
| `/` | `LobbyPage` | Game selection grid |
| `/:gameType/learn` | `LearnPage` | Lesson viewer (gameType = blackjack, baccarat, or craps) |
| `/blackjack/play` | `BlackjackPage` | Blackjack table |
| `/baccarat/play` | `BaccaratPage` | Baccarat table |
| `/craps/play` | `CrapsPage` | Craps table |
| `*` | `NotFound` | 404 with lobby link |

**Layout nesting:**
- `AppShell` wraps all routes (provides `Header` + `<Outlet />`)
- `LearnPage` reads `gameType` from `useParams()` and loads the corresponding lesson data from `src/data/lessons/`. Validates that `gameType` is one of `'blackjack' | 'baccarat' | 'craps'` — redirects to 404 otherwise.
- Each play page is a standalone concrete route (no shared play layout — games are too different). Play pages do not use `useParams()` — each page component knows its own game type.

## State Management

### Global State (Zustand — `useWallet.ts`)

```typescript
interface WalletState {
  balance: number;        // Current chip balance (starts at 1000)
  totalWon: number;       // Lifetime winnings tracker
  totalLost: number;      // Lifetime losses tracker
  placeBet: (amount: number) => boolean;  // Deducts amount from balance. Returns false if insufficient funds.
  winBet: (totalReturn: number, originalStake: number) => void;  // Called on win. totalReturn is FULL RETURN (stake + profit). Adds totalReturn to balance, adds profit (totalReturn - originalStake) to totalWon.
  pushBet: (amount: number) => void;      // Called on push/tie. Amount is the original stake. Returns it to balance. Does not affect totalWon/totalLost.
  loseBet: (amount: number) => void;      // Called on loss. Amount is the stake already deducted by placeBet. Adds amount to totalLost. Does NOT deduct from balance (already deducted).
  reset: () => void;                      // Resets to 1000, clears totals
}
```

**Wallet accounting rules:**
- `placeBet` is called when chips go on the table. Balance is reduced immediately. Chips are "in play" and not reflected in balance until the round resolves.
- `winBet` returns the full amount (stake + profit) and tracks profit separately. Example: $10 bet wins at 1:1 → `winBet(20, 10)`. Blackjack at 3:2 → `winBet(25, 10)`. Banker win with commission → `winBet(19.50, 10)`.
- `loseBet` is called for bookkeeping only — the stake was already deducted by `placeBet`. This just increments `totalLost`.
- `pushBet` returns exactly the original stake.
- **Craps standing bets:** chips are deducted via `placeBet` when placed and stay deducted until the bet resolves (which may be many rolls later). The balance reflects only "available" chips, not chips sitting on the table. When the player navigates away mid-round, all unresolved bets are silently refunded via `pushBet`.
- **Fractional balances:** The balance is stored as a `number` and can be fractional (e.g., 1009.50 after a baccarat banker win with 5% commission). Chip denominations (5, 10, 25, 50, 100) are a UI input mechanism for selecting bet size — they do not constrain the balance to whole numbers. Display the balance rounded to the nearest whole number in the header (`Math.round(balance)`). Payout calculations may produce fractional results; this is fine.

### Local State (per-game hooks)

Each game hook (`useBlackjack`, `useBaccarat`, `useCraps`) manages its own game state internally. These are React hooks, not Zustand stores — game state doesn't need to persist across page navigations. When a game round resolves, the hook calls `useWallet` methods to update the shared balance.

### Lesson State (`useLesson` hook)

```typescript
interface LessonState {
  currentSectionIndex: number;
  totalSections: number;
  goToSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  isFirst: boolean;       // Computed
  isLast: boolean;        // Computed
  progress: number;       // Computed: currentSectionIndex / totalSections
}
```

Not persisted — lessons restart when you navigate away. Keeping it simple for MVP.

## Type Definitions

### Common Types (`src/types/common.ts`)

```typescript
export type GameType = 'blackjack' | 'baccarat' | 'craps';
export type GameMode = 'learn' | 'play';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;            // Unique ID for React keys (e.g., "hearts-A-0")
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export interface GameConfig {
  type: GameType;
  name: string;
  tagline: string;
  description: string;
  icon: string;          // Emoji or SVG identifier
  learnPath: string;
  playPath: string;
}

export const STARTING_BALANCE = 1000;
export const MIN_BET = 5;
export const MAX_BET = 500;
export const CHIP_DENOMINATIONS = [5, 10, 25, 50, 100] as const;
```

### Blackjack Types (`src/types/blackjack.ts`)

```typescript
export type BlackjackPhase = 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'resolved';
export type BlackjackAction = 'hit' | 'stand' | 'double' | 'split' | 'insurance';
export type HandResult = 'blackjack' | 'win' | 'lose' | 'push' | 'bust';

export interface BlackjackHand {
  cards: Card[];
  bet: number;
  isDoubled: boolean;
  result?: HandResult;
}

export interface BlackjackGameState {
  phase: BlackjackPhase;
  deck: Card[];
  dealerHand: Card[];
  playerHands: BlackjackHand[];    // Array for split support
  activeHandIndex: number;          // Which hand the player is acting on
  insuranceBet: number | null;
  availableActions: BlackjackAction[];  // Computed each turn
}
```

### Baccarat Types (`src/types/baccarat.ts`)

```typescript
export type BaccaratBetType = 'player' | 'banker' | 'tie';
export type BaccaratPhase = 'betting' | 'dealing' | 'resolved';
export type BaccaratResult = 'player' | 'banker' | 'tie';

export interface BaccaratBet {
  type: BaccaratBetType;
  amount: number;
}

export interface BaccaratGameState {
  phase: BaccaratPhase;
  deck: Card[];
  playerHand: Card[];
  bankerHand: Card[];
  bets: BaccaratBet[];              // Can bet on multiple outcomes
  result?: BaccaratResult;
  // NOTE: playerTotal and bankerTotal are NOT stored — derive them via evaluateHand(playerHand)
  // and evaluateHand(bankerHand) to follow the derived-state principle (see Common Mistake #3).
}

// Payout ratios
export const BACCARAT_PAYOUTS: Record<BaccaratBetType, number> = {
  player: 1,     // 1:1
  banker: 0.95,  // 1:1 minus 5% commission
  tie: 8,        // 8:1
};
```

### Craps Types (`src/types/craps.ts`)

```typescript
export type CrapsPhase = 'comeOut' | 'point' | 'resolved';
// Phase transitions:
//   comeOut → point (when a point is established: 4,5,6,8,9,10)
//   comeOut → comeOut (when come-out roll is a natural 7/11 or craps 2/3/12 — bets resolve, new come-out)
//   point → comeOut (when point is hit or seven-out — bets resolve, phase resets to comeOut)
//   point → point (when roll is neither the point nor 7 — other bets may resolve, point phase continues)
//   'resolved' is a TRANSIENT display state entered briefly after a come-out natural/craps or a seven-out
//   to show results, then auto-transitions back to 'comeOut' after a short delay (~1.5s) or user click.
//   During 'resolved', no bets can be placed and no rolls triggered.

export type CrapsBetType =
  | 'pass' | 'dontPass'
  | 'come' | 'dontCome'
  | 'passOdds' | 'dontPassOdds'
  | 'comeOdds' | 'dontComeOdds'
  | 'place4' | 'place5' | 'place6' | 'place8' | 'place9' | 'place10'
  | 'field'
  | 'hardway4' | 'hardway6' | 'hardway8' | 'hardway10'
  | 'anySeven' | 'anyCraps' | 'eleven' | 'aceDeuce' | 'aces' | 'boxcars'
  | 'big6' | 'big8'
  | 'horn' | 'hornHigh';

export type BetCategory = 'smart' | 'standard' | 'sucker';

export interface CrapsBet {
  id: string;              // Unique ID for this bet (for React keys and odds-bet linking)
  type: CrapsBetType;
  amount: number;
  point?: number;          // For come/don't come bets that have traveled to a number
  parentBetId?: string;    // For odds bets: links to the parent pass/come/dontPass/dontCome bet ID
}

export interface DiceRoll {
  die1: number;            // 1-6
  die2: number;            // 1-6
  total: number;           // Computed: die1 + die2
  isHard: boolean;         // Computed: die1 === die2
}

export interface CrapsGameState {
  phase: CrapsPhase;
  point: number | null;            // The established point (4,5,6,8,9,10) or null
  activeBets: CrapsBet[];
  currentRoll: DiceRoll | null;
  lastResults: BetResolution[];    // Results from the most recent roll
  showBeginnerLayout: boolean;     // Toggle between beginner/full table
}

export interface BetResolution {
  bet: CrapsBet;
  outcome: 'win' | 'lose' | 'push';
  payout: number;          // Amount won (0 for loss, bet amount for push)
}

export interface PayoutInfo {
  betType: CrapsBetType;
  paysRatio: string;       // Display string: "6:5", "1:1", etc.
  houseEdge: string;       // Display string: "1.41%", "16.67%", etc.
  category: BetCategory;
}

// Complete payout table — the source of truth for all craps payouts
export const CRAPS_PAYOUT_TABLE: Record<CrapsBetType, PayoutInfo> = {
  pass:          { betType: 'pass', paysRatio: '1:1', houseEdge: '1.41%', category: 'smart' },
  dontPass:      { betType: 'dontPass', paysRatio: '1:1', houseEdge: '1.36%', category: 'smart' },
  come:          { betType: 'come', paysRatio: '1:1', houseEdge: '1.41%', category: 'smart' },
  dontCome:      { betType: 'dontCome', paysRatio: '1:1', houseEdge: '1.36%', category: 'smart' },
  passOdds:      { betType: 'passOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  dontPassOdds:  { betType: 'dontPassOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  comeOdds:      { betType: 'comeOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  dontComeOdds:  { betType: 'dontComeOdds', paysRatio: 'varies', houseEdge: '0%', category: 'smart' },
  place6:        { betType: 'place6', paysRatio: '7:6', houseEdge: '1.52%', category: 'smart' },
  place8:        { betType: 'place8', paysRatio: '7:6', houseEdge: '1.52%', category: 'smart' },
  place5:        { betType: 'place5', paysRatio: '7:5', houseEdge: '4.00%', category: 'standard' },
  place9:        { betType: 'place9', paysRatio: '7:5', houseEdge: '4.00%', category: 'standard' },
  place4:        { betType: 'place4', paysRatio: '9:5', houseEdge: '6.67%', category: 'standard' },
  place10:       { betType: 'place10', paysRatio: '9:5', houseEdge: '6.67%', category: 'standard' },
  field:         { betType: 'field', paysRatio: '1:1 / 2:1', houseEdge: '5.56%', category: 'standard' },
  big6:          { betType: 'big6', paysRatio: '1:1', houseEdge: '9.09%', category: 'sucker' },
  big8:          { betType: 'big8', paysRatio: '1:1', houseEdge: '9.09%', category: 'sucker' },
  hardway4:      { betType: 'hardway4', paysRatio: '7:1', houseEdge: '11.11%', category: 'sucker' },
  hardway6:      { betType: 'hardway6', paysRatio: '9:1', houseEdge: '9.09%', category: 'sucker' },
  hardway8:      { betType: 'hardway8', paysRatio: '9:1', houseEdge: '9.09%', category: 'sucker' },
  hardway10:     { betType: 'hardway10', paysRatio: '7:1', houseEdge: '11.11%', category: 'sucker' },
  anySeven:      { betType: 'anySeven', paysRatio: '4:1', houseEdge: '16.67%', category: 'sucker' },
  anyCraps:      { betType: 'anyCraps', paysRatio: '7:1', houseEdge: '11.11%', category: 'sucker' },
  eleven:        { betType: 'eleven', paysRatio: '15:1', houseEdge: '11.11%', category: 'sucker' },
  aceDeuce:      { betType: 'aceDeuce', paysRatio: '15:1', houseEdge: '11.11%', category: 'sucker' },
  aces:          { betType: 'aces', paysRatio: '30:1', houseEdge: '13.89%', category: 'sucker' },
  boxcars:       { betType: 'boxcars', paysRatio: '30:1', houseEdge: '13.89%', category: 'sucker' },
  horn:          { betType: 'horn', paysRatio: 'varies', houseEdge: '12.50%', category: 'sucker' },
  hornHigh:      { betType: 'hornHigh', paysRatio: 'varies', houseEdge: '12.50%', category: 'sucker' },
};
```

### Lesson Types (`src/types/lesson.ts`)

```typescript
export interface LessonSection {
  id: string;                // Unique slug: "blackjack-basics", "craps-pass-line"
  title: string;             // Display title: "The Basics"
  content: LessonBlock[];    // Ordered content blocks
}

export type LessonBlock =
  | { type: 'text'; body: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'tip'; body: string }
  | { type: 'warning'; body: string }
  | { type: 'example'; scenario: string; action: string; result: string }
  | { type: 'payoutTable'; rows: PayoutTableRow[] };

export interface PayoutTableRow {
  bet: string;
  pays: string;
  houseEdge: string;
  notes?: string;
  category?: BetCategory;  // Used by craps PayoutTable to color-code rows (green/yellow/red)
}

export interface CheatSheetEntry {
  label: string;
  value: string;
}

export interface LessonData {
  gameType: GameType;
  title: string;             // "Blackjack 101", "Craps: The Complete Guide"
  sections: LessonSection[];
  cheatSheet: CheatSheetEntry[];
}
```

## Component Inventory

### Layout Components

**`AppShell`** — Top-level layout wrapping all routes.
- Renders `Header` at top, `<Outlet />` for page content
- Provides consistent page structure

**`Header`** — Persistent navigation bar.
- Shows app title/logo (links to lobby)
- Displays current chip balance via `ChipDisplay`
- Shows "Back to Lobby" link when not on lobby page
- Props: none (reads wallet from Zustand, route from React Router)

**`ChipDisplay`** — Animated chip count.
- Renders current balance with chip icon
- Animates on balance change (brief scale + color flash: green for win, red for loss)
- Props: none (reads from `useWallet`)

### Lobby Components

**`LobbyPage`** — Game selection grid.
- Renders three `GameCard` components
- Centered layout with casino-themed styling
- Shows total chip balance prominently
- Includes `ResetButton` for chip reset

**`GameCard`** — Individual game selection card.
- Shows game icon, name, tagline
- Two CTA buttons: "Learn" and "Play"
- Visual hover state
- Props: `{ config: GameConfig }`

### Learn Components

**`LearnPage`** — Lesson viewer orchestrator.
- Reads `gameType` from URL params
- Loads corresponding lesson data from `src/data/lessons/`
- Uses `useLesson` hook for navigation state
- Renders `LessonNav` (sidebar) + `LessonContent` (main area) + `CheatSheet` (toggle overlay)
- Props: none (reads from URL params)

**`LessonNav`** — Section sidebar navigation.
- Lists all section titles with active indicator
- Shows progress (e.g., "3 of 8")
- Click to jump to any section
- Props: `{ sections: LessonSection[]; currentIndex: number; onSelect: (index: number) => void }`

**`LessonContent`** — Renders current lesson section.
- Iterates over `LessonBlock[]` and renders appropriate element for each type
- Text blocks as paragraphs, tips as callout boxes, examples as scenario cards, payout tables via `PayoutTable`
- Next/Previous navigation buttons at bottom
- Props: `{ section: LessonSection; onNext: () => void; onPrev: () => void; isFirst: boolean; isLast: boolean }`

**`CheatSheet`** — Quick-reference overlay.
- Slide-out drawer or modal
- Shows key facts, strategy tips, and payout odds in scannable format
- Toggle button fixed in corner while in Learn or Play mode
- Props: `{ entries: CheatSheetEntry[]; isOpen: boolean; onToggle: () => void }`

**`PayoutTable`** — Formatted payout odds table.
- Renders rows with bet name, payout ratio, house edge, and optional notes
- Used in both Learn mode (inline in lessons) and as reference in Play mode
- Craps version color-codes rows by `BetCategory` (green/yellow/red)
- Props: `{ rows: PayoutTableRow[]; showCategory?: boolean }`

### Play Common Components

**`BettingControls`** — Chip selection and bet placement.
- Chip denomination buttons (5, 10, 25, 50, 100)
- Current bet display with clear button
- Deal/Roll action button (disabled until valid bet placed)
- Shows current balance and validates against it
- Props: `{ onPlaceBet: (amount: number) => void; onClear: () => void; onAction: () => void; currentBet: number; balance: number; actionLabel: string; disabled: boolean }`

**`ChipStack`** — Visual chip representation SVG.
- Renders stacked chip graphic proportional to amount
- Color-coded by denomination
- Props: `{ amount: number; size?: 'sm' | 'md' | 'lg' }`

**`Card`** — SVG playing card.
- Renders card face (rank + suit with appropriate color) or card back
- Standard playing card proportions
- Subtle dealing animation on mount (slide-in from deck position)
- Props: `{ card: Card; className?: string }`

**`ActionButton`** — Styled game action button.
- Consistent styling for Hit, Stand, Double, Roll, etc.
- Disabled state styling
- Props: `{ label: string; onClick: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger' }`

**`GameMessage`** — Win/lose/push result banner.
- Slides in from top when round resolves
- Shows result text and amount won/lost
- Auto-dismisses or dismisses on click
- Props: `{ result: 'win' | 'lose' | 'push' | 'blackjack'; amount: number; onDismiss: () => void }`

### Blackjack Components

**`BlackjackPage`** — Orchestrates blackjack play mode.
- Uses `useBlackjack` hook for game state
- Wires `BettingControls` → deal, action buttons → hit/stand/double/split
- Shows `GameMessage` on round resolution
- Props: none

**`BlackjackTable`** — Table layout.
- Dealer hand area (top, one card face-down during player turn)
- Player hand area (bottom, supports split into two hands)
- Active hand indicator when split
- Props: `{ dealerHand: Card[]; playerHands: BlackjackHand[]; activeHandIndex: number; phase: BlackjackPhase }`

**`HandDisplay`** — Renders a single hand.
- Fanned card layout
- Running total displayed (with "soft" indicator for ace hands)
- Visual indicator for bust/blackjack
- Props: `{ cards: Card[]; showTotal: boolean; label?: string; isActive?: boolean }`

### Baccarat Components

**`BaccaratPage`** — Orchestrates baccarat play mode.
- Uses `useBaccarat` hook
- Bet selection → deal → automatic resolution (no player decisions during play)
- Props: none

**`BaccaratTable`** — Table layout.
- Player side (left) and Banker side (right)
- Card positions with third-card slot
- Running totals displayed
- Props: `{ playerHand: Card[]; bankerHand: Card[]; phase: BaccaratPhase }` (compute totals via `evaluateHand` inline)

**`BetSelector`** — Baccarat bet selection.
- Three large bet areas: Player (1:1), Banker (0.95:1), Tie (8:1)
- Can place bets on multiple outcomes
- Shows current bet amount on each
- Props: `{ bets: BaccaratBet[]; onPlaceBet: (type: BaccaratBetType, amount: number) => void; onClear: () => void; chipAmount: number; disabled: boolean }`

### Craps Components

**`CrapsPage`** — Orchestrates craps play mode.
- Uses `useCraps` hook
- Most complex page: bet placement on table → roll → resolution display → repeat
- Shows `BeginnerToggle` and `PointMarker`
- Props: none

**`CrapsTable`** — Full craps table layout (dual-mode).
- **Mobile (< 768px):** Card-based layout with bet zones organized as tappable cards/buttons grouped by category (Smart Bets, Standard, Sucker). Each bet zone card shows the bet name, payout ratio, and a chip stack if a bet is active. Uses vertical scroll. Beginner mode hides the Sucker group entirely.
- **Desktop (≥ 768px):** SVG-based traditional table layout with all bet zones as clickable regions. Beginner mode dims sucker bets.
- Both modes share the same `onPlaceBet` callback and `activeBets` state — only the presentation differs.
- Props: `{ activeBets: CrapsBet[]; onPlaceBet: (type: CrapsBetType) => void; showBeginnerLayout: boolean; point: number | null; chipAmount: number }`

**`CrapsBetZone`** — Individual clickable bet area.
- Renders bet zone label with payout info
- Shows placed chip stack if bet is active
- Highlighted border when available to bet
- Dimmed when in beginner mode and bet is `sucker` category
- Props: `{ betType: CrapsBetType; label: string; payout: string; isActive: boolean; chipAmount: number; dimmed: boolean; onClick: () => void }`

**`DiceDisplay`** — SVG dice pair.
- Shows current roll result with dot pips
- CSS animation on roll (brief tumble/spin)
- Props: `{ roll: DiceRoll | null; rolling: boolean }`

**`PointMarker`** — ON/OFF puck.
- Shows current point number or OFF
- Positioned on the table at the point number
- Props: `{ point: number | null }`

**`BeginnerToggle`** — Toggle switch.
- Switches between "Beginner" (smart bets highlighted) and "Full Table" (all bets visible)
- Props: `{ showBeginner: boolean; onToggle: () => void }`

### Shared Components

**`NotFound`** — 404 page.
- Friendly message with link back to lobby
- Props: none

**`ResetButton`** — Reset chips to starting amount.
- Confirmation dialog before reset
- Props: none (uses `useWallet.reset`)

## UI/UX Direction

### Visual Style
- **Casino-themed but clean.** Dark green felt background tones, gold/cream accents, but not gaudy. Think upscale card room, not Vegas strip. The aesthetic should feel welcoming to beginners, not intimidating.
- **Color palette:** Deep green (`#1a472a`) as primary background, cream/off-white (`#f5f0e8`) for text and cards, gold (`#c9a84c`) for accents and buttons, red (`#b91c1c`) for hearts/diamonds and loss indicators, deep blue (`#1e3a5f`) for secondary elements.
- **Typography:** Clean sans-serif for UI, slightly stylized for game headers. System font stack for performance.
- **Cards:** Simple SVG cards — white rectangle with rounded corners, rank in corners, suit symbol centered. Red for hearts/diamonds, dark for clubs/spades. Face-down cards show a crosshatch pattern.
- **Dice:** Clean SVG dice faces with dot pips. Brief CSS rotation animation on roll.
- **Chips:** Circular SVG chips color-coded by denomination: white ($5), red ($10), green ($25), blue ($50), black ($100).

### Target Device & Browser
- **Primary:** iPhone 14 Pro (393×852 CSS viewport, 3x DPR) on Firefox iOS
- **Note:** Firefox on iOS uses WebKit under the hood (Apple requires all iOS browsers to use WebKit), so this is effectively a WebKit target. All `-webkit-` prefixed CSS properties apply. Test in Safari DevTools for equivalent results.
- **Secondary:** Desktop (1280px+), tablet (768px)

### Layout Strategy
- **Mobile-first** — design for 393px width first, then scale up with breakpoints for tablet (768px) and desktop (1280px). All Tailwind classes should use unprefixed mobile defaults with `md:` and `lg:` overrides.
- **Lobby:** Single-column stacked game cards on mobile. Grid on desktop.
- **Learn mode:** Full-width content on mobile with collapsible section nav (hamburger or bottom sheet). Two-column sidebar layout on desktop. Fixed "Cheat Sheet" toggle button in bottom-right corner.
- **Play mode:** Single-column centered table with controls below. Tables must fit within 393px width without horizontal scroll (except craps — see below).
- **Craps table:** On mobile, use a simplified vertical/stacked layout with grouped bet zones rather than the traditional horizontal table. The full panoramic table layout is desktop only. On mobile, bet zones should be presented as tappable cards or a scrollable list grouped by category (Smart Bets, Standard, Sucker), not a scaled-down SVG of the full table.
- **Craps table mobile alternative (moved from Future Considerations to in-scope):** The craps table MUST have a dedicated mobile layout. A horizontal-scroll SVG is not acceptable as the primary mobile experience — tap targets will be too small and the UX will be frustrating.

### Interaction Patterns
- **Touch targets:** All tappable elements must be at least 44×44px (Apple HIG minimum). This applies to chip denomination buttons, bet zones, action buttons, and navigation elements. On mobile, prefer larger targets (48×48px+) since fingers are less precise than cursors.
- **Betting:** Tap chip denomination to select active chip size. Tap bet area to place one chip of that size. Tap same area again to add another chip. Selected chip denomination should have a persistent highlighted state so the user always knows which chip size is active. In craps, each bet zone is independently tappable.
- **Bet clearing (blackjack/baccarat):** "Clear" button removes all bets and returns chips to balance. Only available before dealing.
- **Bet clearing (craps):** Two options: "Clear All" removes all bets before a roll. Individual bet zones also have a remove option (tap the placed chips) for Place bets and Odds bets, which can be removed at any time. Pass/Don't Pass and Come/Don't Come bets cannot be removed once a point is established — the remove option is not shown for these.
- **Card games:** Cards animate in with a slide-from-deck motion (CSS transform + transition, ~300ms).
- **Dice:** Tap "Roll" triggers a brief CSS animation (~500ms tumble), then dice settle to show result.
- **Round resolution:** `GameMessage` banner slides in, holds for 2 seconds, then auto-fades or dismisses on tap. Balance animation plays in header.
- **Craps beginner toggle:** Instant — no animation needed. Sucker bets fade to 20% opacity, smart bets get a subtle glow border.
- **Mid-round navigation:** If the player navigates away (back button, lobby link, browser navigation) during an active round (cards dealt, dice in point phase), unresolved bets are silently refunded via `pushBet`. No confirmation dialog — just clean up gracefully. The game hook's cleanup function handles this on unmount.
- **Disabled actions:** Action buttons that aren't available (e.g., "Split" when cards don't match, "Double" when balance is insufficient) are visually dimmed and non-tappable. No tooltip explanation needed for MVP — the button label makes the action self-evident.
- **iOS input zoom prevention:** All form inputs (if any) and interactive text elements must use a minimum font size of 16px to prevent iOS WebKit from auto-zooming on focus. This includes any bet amount displays that use `<input>` elements.

### Accessibility Baseline
- Semantic HTML: `<nav>`, `<main>`, `<button>`, `<table>` where appropriate
- Keyboard navigable: all interactive elements focusable, game actions triggerable via keyboard
- Focus management: after dealing cards or rolling dice, focus moves to first available action button
- Aria labels on SVG elements (cards announce rank and suit, dice announce roll result)
- Color is not the only indicator (icons + text accompany color-coded elements)
- Reduced motion: respect `prefers-reduced-motion` — skip card slide and dice tumble animations

## Data & Content Layer

### Content Strategy

Each game's lesson data lives in `src/data/lessons/{game}.ts` as a typed `LessonData` export. Content will be generated via the Content Generation Prompt (see end of spec) in a separate Claude conversation and pasted into these files.

### Lesson Structure Per Game

**Blackjack (6 sections):**
1. The Basics — what the game is, objective, table layout
2. Card Values & Hand Totals — hard vs. soft hands, naturals
3. Player Actions — hit, stand, double down, split, insurance
4. Dealer Rules — dealer must hit/stand rules, what this means for you
5. Payouts & Odds — payout ratios, house edge, why insurance is a bad bet
6. Beginner Strategy Tips — when to always hit, always stand, basic heuristics

**Baccarat (5 sections):**
1. The Basics — simplest game in the casino, just bet and watch
2. Card Values & Hand Totals — mod-10 counting, natural 8/9
3. Third-Card Rules — when player draws, when banker draws (the tableau)
4. Bet Types & Payouts — player, banker, tie, commission explained
5. Beginner Strategy Tips — always bet banker, avoid tie, bankroll management

**Craps (8 sections):**
1. The Basics — what craps is, the table, the shooter, the energy
2. The Come-Out Roll — pass line, don't pass, natural/craps/point
3. The Point Phase — how the point works, odds bets explained
4. Come & Don't Come — pass line's cousin, traveling bets
5. Place Bets — betting on specific numbers, buy bets (buy bets are taught for awareness but NOT playable in MVP)
6. Field, Big 6 & Big 8 — one-roll and standing bets
7. Proposition & Hardway Bets — the sucker bets and why they exist
8. The Smart Player's Guide — which bets to make, house edge ranking, bankroll management

### Example Lesson Section (Quality Benchmark)

This example shows the target format, tone, depth, and block variety for a single lesson section. The Content Generation Prompt should produce all sections matching this quality.

```typescript
// From src/data/lessons/blackjack.ts
export const blackjackLesson: LessonData = {
  gameType: 'blackjack',
  title: 'Blackjack 101',
  sections: [
    {
      id: 'blackjack-basics',
      title: 'The Basics',
      content: [
        {
          type: 'text',
          body: 'Blackjack is the most popular table game in every casino in the world, and for good reason — it\'s simple to learn, fast to play, and gives you better odds than almost any other game on the floor. Your goal is straightforward: get a hand closer to 21 than the dealer, without going over.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'How a Round Works'
        },
        {
          type: 'text',
          body: 'Every round starts the same way. You place a bet, the dealer gives you two cards face up, and deals themselves two cards — one face up, one face down (the "hole card"). Now you make decisions: take more cards to get closer to 21, or stop where you are and hope the dealer busts. Once all players are done, the dealer reveals their hole card and plays by a strict set of rules — no choices, no bluffing.'
        },
        {
          type: 'tip',
          body: 'Unlike poker, you\'re not competing against other players at the table. It\'s just you versus the dealer. The other players\' hands don\'t affect yours at all.'
        },
        {
          type: 'example',
          scenario: 'You\'re dealt a 10 and a 7 (total: 17). The dealer shows a 6.',
          action: 'You stand — 17 is a solid hand, and the dealer is likely to bust with a 6 showing.',
          result: 'The dealer reveals a 10 underneath (total: 16), must hit, draws a 9, and busts with 25. You win!'
        },
        {
          type: 'text',
          body: 'That\'s the whole game at its core. The strategy comes from knowing when to take risks and when to play it safe — and we\'ll get into all of that in the next sections.'
        }
      ]
    },
    // ... remaining sections generated via Content Generation Prompt
  ],
  cheatSheet: [
    { label: 'Goal', value: 'Beat the dealer by getting closer to 21 without going over' },
    { label: 'Blackjack', value: 'Ace + 10-value card = instant win, pays 3:2' },
    { label: 'Dealer rule', value: 'Must hit on 16 or less, must stand on 17+' },
    { label: 'Soft hand', value: 'Any hand with an Ace counted as 11' },
    { label: 'Best move', value: 'Always stand on 17+. Always hit on 8 or less.' },
    { label: 'Avoid', value: 'Insurance bet — it\'s a sucker bet (house edge ~7%)' },
    { label: 'House edge', value: '~0.5% with basic strategy, ~2% without' },
  ]
};
```

### Cheat Sheet Content (per game)

**Blackjack cheat sheet:** ~7 entries covering goal, blackjack payout, dealer rules, soft/hard hands, basic decision heuristics, what to avoid.

**Baccarat cheat sheet:** ~5 entries covering goal, natural win, commission, always-bet-banker, tie bet warning.

**Craps cheat sheet:** ~8 entries covering come-out roll outcomes, pass line basics, odds bets (0% edge), best bets (pass + odds, come + odds, place 6/8), bets to avoid, point numbers.

## Testing Strategy

### Framework Setup

Vitest with React Testing Library, configured in `vite.config.ts`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: false,
  },
});
```

```typescript
// src/test-setup.ts
import '@testing-library/jest-dom';

afterEach(() => {
  localStorage.clear();
});
```

### Testing Philosophy

- **Test game engines heavily.** The pure functions in `src/engine/` are the core correctness guarantees — payout calculations, hand evaluation, third-card rules, dice resolution. These get exhaustive unit tests.
- **Test game hooks moderately.** State transitions (betting → dealing → playerTurn → resolved) and edge cases (split aces, craps come-out 7, baccarat natural).
- **Test components lightly.** Verify rendering, user interactions trigger correct callbacks, and key UI states display correctly. Don't test Tailwind classes or pixel positions.
- **Don't test lesson content.** The data files are static content — trust them. Test the `useLesson` navigation hook instead.

### Example Test Pattern

```typescript
// src/engine/blackjack.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateHand } from './blackjack';

describe('evaluateHand', () => {
  it('counts number cards at face value', () => {
    const hand = [card('7', 'hearts'), card('5', 'clubs')];
    expect(evaluateHand(hand)).toEqual({ total: 12, isSoft: false, isBust: false, isBlackjack: false });
  });

  it('counts face cards as 10', () => {
    const hand = [card('K', 'spades'), card('Q', 'hearts')];
    expect(evaluateHand(hand)).toEqual({ total: 20, isSoft: false, isBust: false, isBlackjack: false });
  });

  it('counts ace as 11 when total <= 21 (soft hand)', () => {
    const hand = [card('A', 'diamonds'), card('6', 'clubs')];
    expect(evaluateHand(hand)).toEqual({ total: 17, isSoft: true, isBust: false, isBlackjack: false });
  });

  it('counts ace as 1 when 11 would bust', () => {
    const hand = [card('A', 'hearts'), card('7', 'clubs'), card('8', 'spades')];
    expect(evaluateHand(hand)).toEqual({ total: 16, isSoft: false, isBust: false, isBlackjack: false });
  });

  it('detects blackjack (ace + 10-value)', () => {
    const hand = [card('A', 'clubs'), card('10', 'hearts')];
    expect(evaluateHand(hand)).toEqual({ total: 21, isSoft: true, isBust: false, isBlackjack: true });
  });

  it('detects bust (over 21)', () => {
    const hand = [card('K', 'hearts'), card('8', 'clubs'), card('5', 'diamonds')];
    expect(evaluateHand(hand)).toEqual({ total: 23, isSoft: false, isBust: true, isBlackjack: false });
  });
});
```

## Build Phases

### Phase 1: Foundation + Lobby
**Goal:** App scaffolded with routing, types defined, lobby page renders with three game cards linking to placeholder pages.

**Build:**
1. `npm create vite@latest casino-classroom -- --template react-ts` — scaffold project
2. Install dependencies: `tailwind`, `postcss`, `autoprefixer`, `react-router-dom`, `zustand`
3. Configure Tailwind with casino color palette in `tailwind.config.js`
4. Create all type files in `src/types/` (common, blackjack, baccarat, craps, lesson)
5. Create `src/data/gameConfigs.ts` with metadata for all three games
6. Create `src/utils/shuffle.ts` (Fisher-Yates) and `src/utils/storage.ts` (localStorage helpers with versioning)
7. Create `src/store/useWallet.ts` Zustand store with `persist` middleware
8. Set up `createBrowserRouter` in `App.tsx` with all routes — game routes render placeholder `<div>Game: {name} / Mode: {mode}</div>` for now
9. Create `AppShell`, `Header`, `ChipDisplay` layout components
10. Create `LobbyPage` and `GameCard` — lobby renders three cards with working Learn/Play links
11. Create `NotFound` and `ResetButton` components

**Tests:**
```
src/utils/shuffle.test.ts
├── returns array of same length
├── contains all original elements
├── does not mutate original array
├── produces different orderings (run 10x, not all identical)
└── handles empty array

src/utils/storage.test.ts
├── saves and loads data correctly
├── returns fallback on missing key
├── returns fallback on corrupted JSON
├── returns fallback on wrong version
└── handles localStorage unavailable (throws → fallback)

src/store/useWallet.test.ts
├── initial balance is 1000
├── placeBet deducts from balance
├── placeBet returns false if insufficient balance
├── winBet adds to balance and totalWon
├── pushBet returns exact bet amount
├── reset restores to 1000 and clears totals
└── persists to localStorage across store recreations
```

**Definition of Done:**
- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] App loads at `localhost:5173` — lobby shows three game cards
- [ ] Clicking "Learn" or "Play" on any game navigates to the correct route (placeholder content)
- [ ] Chip balance shows "1,000" in header
- [ ] Reset button works (with confirmation)
- [ ] Invalid URL shows 404 page with lobby link
- [ ] Git commit: "Phase 1: Foundation — scaffold, types, routing, lobby"

**⏸️ CHECKPOINT:** Stop and ask the user to review. Summary: "Phase 1 complete: project scaffolded with all types, routing, Zustand wallet store, lobby page with three game cards, and utility functions. All placeholder routes working. [X] tests passing. Please verify the lobby renders correctly and navigation works."

---

### Phase 2: Learn Mode
**Goal:** Full lesson viewer with sidebar navigation, content rendering for all block types, cheat sheet overlay, and payout table component. Lessons display placeholder content (one section per game) pending content generation.

**Build:**
1. Create `src/hooks/useLesson.ts` — manages currentSectionIndex, navigation methods, computed progress
2. Create `src/components/learn/LessonContent.tsx` — renders `LessonBlock[]` with appropriate elements for each type: text → `<p>`, heading → `<h2>`/`<h3>`, tip → green callout box, warning → amber callout box, example → scenario/action/result card, payoutTable → `PayoutTable`
3. Create `src/components/learn/PayoutTable.tsx` — renders payout odds table with optional category color-coding
4. Create `src/components/learn/LessonNav.tsx` — sidebar with section titles, active indicator, progress display
5. Create `src/components/learn/CheatSheet.tsx` — slide-out drawer with cheat sheet entries, toggle button
6. Create `src/components/learn/LearnPage.tsx` — orchestrates everything: reads `gameType` from URL params, loads lesson data, renders LessonNav + LessonContent + CheatSheet
7. Create placeholder lesson data files (`src/data/lessons/blackjack.ts`, `baccarat.ts`, `craps.ts`) with the example section from this spec plus one additional minimal section per game, using all block types for testing. Full content will be generated later.
8. Update routing to wire `LearnPage` to all three `/game/learn` routes

**Tests:**
```
src/hooks/useLesson.test.ts
├── initializes at section 0
├── nextSection increments index
├── prevSection decrements index
├── nextSection does not exceed total sections
├── prevSection does not go below 0
├── goToSection jumps to specified index
├── isFirst is true at index 0
├── isLast is true at final index
└── progress computes correctly (e.g., 2/5 = 0.4)

src/components/learn/LessonContent.test.tsx
├── renders text blocks as paragraphs
├── renders headings at correct level
├── renders tip blocks with tip styling
├── renders warning blocks with warning styling
├── renders example blocks with scenario/action/result
├── renders payout table blocks
├── next button calls onNext
├── prev button calls onPrev
├── prev button hidden when isFirst is true
└── next button shows "Finish" when isLast is true

src/components/learn/CheatSheet.test.tsx
├── renders all cheat sheet entries when open
├── toggle button opens/closes drawer
└── entries show label and value
```

**Definition of Done:**
- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] Navigate to `/blackjack/learn` — lesson loads with sidebar and content
- [ ] Click through sections — content updates, progress indicator advances
- [ ] All block types render correctly (text, heading, tip, warning, example, payout table)
- [ ] Cheat sheet toggle opens/closes drawer with entries
- [ ] Navigate to `/baccarat/learn` and `/craps/learn` — both load their placeholder content
- [ ] Responsive: section nav collapses to top/hamburger on mobile (393px), shows as sidebar on desktop
- [ ] Git commit: "Phase 2: Learn mode — lesson viewer, navigation, cheat sheet, all block types"

**⏸️ CHECKPOINT:** Stop and ask the user to review. Summary: "Phase 2 complete: full learn mode with section navigation, all content block types rendering, cheat sheet overlay, and payout table component. Currently showing placeholder content — full lesson content will be generated separately and dropped in. [X] tests passing."

---

### Phase 3: Blackjack Play Mode
**Goal:** Fully playable blackjack table — bet, deal, hit/stand/double/split, dealer plays automatically, correct payouts credited.

**Build:**
1. Create `src/engine/deck.ts` — `createDeck(numDecks: number = 1)` returns `52 × numDecks` cards with unique IDs (include deck index in ID, e.g., `"hearts-A-0-d3"`), `drawCard()` pops from deck. Blackjack uses `createDeck(6)` (312 cards), baccarat uses `createDeck(8)` (416 cards).
2. Create `src/engine/blackjack.ts` — pure functions:
   - `evaluateHand(cards)` → `{ total, isSoft, isBust, isBlackjack }`
   - `dealerShouldHit(cards)` → boolean (hits below 17, stands on soft 17)
   - `getAvailableActions(playerHand, dealerUpCard, balance)` → `BlackjackAction[]`
   - `calculatePayout(bet, result)` → number
3. Create `src/hooks/useBlackjack.ts` — game state machine:
   - `placeBet(amount)` → transitions to dealing
   - `deal()` → shuffles deck, deals 2 cards each, checks for blackjack
   - `hit()` → draws card, checks bust
   - `stand()` → moves to next hand or dealer turn
   - `double()` → doubles bet, draws one card, stands
   - `split()` → splits pair into two hands
   - `dealerPlay()` → dealer draws until ≥17
   - `resolve()` → compares hands, calculates payouts, updates wallet
4. Create `src/components/play/common/Card.tsx` — SVG playing card (face up: rank + suit, face down: pattern)
5. Create `src/components/play/common/BettingControls.tsx` — chip selection + bet amount + deal button
6. Create `src/components/play/common/ActionButton.tsx` — styled action button
7. Create `src/components/play/common/GameMessage.tsx` — result banner
8. Create `src/components/play/common/ChipStack.tsx` — visual chip SVG
9. Create `src/components/play/blackjack/HandDisplay.tsx` — renders fanned cards + total
10. Create `src/components/play/blackjack/BlackjackTable.tsx` — dealer + player layout
11. Create `src/components/play/blackjack/BlackjackPage.tsx` — orchestrates full game loop
12. Update routing to wire `BlackjackPage` to `/blackjack/play`

**Tests:**
```
src/engine/deck.test.ts
├── createDeck(1) returns 52 cards
├── createDeck(6) returns 312 cards (blackjack shoe)
├── createDeck(8) returns 416 cards (baccarat shoe)
├── all cards have unique IDs (even across decks in a shoe)
├── single deck contains 4 suits × 13 ranks
├── multi-deck shoe contains correct duplicates (e.g., 6 Ace of Spades in a 6-deck shoe)
└── drawCard removes and returns top card

src/engine/blackjack.test.ts
├── evaluateHand counts number cards at face value
├── evaluateHand counts face cards as 10
├── evaluateHand counts ace as 11 (soft hand)
├── evaluateHand counts ace as 1 when 11 would bust
├── evaluateHand handles multiple aces
├── evaluateHand detects blackjack (ace + 10-value, 2 cards only)
├── evaluateHand does not flag 21 with 3+ cards as blackjack
├── evaluateHand detects bust
├── dealerShouldHit returns true for 16
├── dealerShouldHit returns false for 17
├── dealerShouldHit returns false for soft 17 (this app uses S17 — dealer stands on soft 17)
├── getAvailableActions includes hit and stand always
├── getAvailableActions includes double on first two cards with sufficient balance
├── getAvailableActions includes split on matching ranks with sufficient balance
├── getAvailableActions excludes split on non-matching ranks
├── calculatePayout returns 1.5x bet for blackjack
├── calculatePayout returns 1x bet for regular win
├── calculatePayout returns 0 for loss
└── calculatePayout returns bet amount for push

src/hooks/useBlackjack.test.ts
├── initializes in betting phase
├── deal transitions to playerTurn (or dealerTurn on dealer blackjack)
├── hit adds card to active hand
├── hit transitions to resolved on bust
├── stand on single hand transitions to dealerTurn
├── double doubles bet, adds one card, transitions to dealerTurn
├── split creates two hands from a pair
├── split plays each hand sequentially
├── dealer plays until >= 17
├── resolve correctly identifies win/lose/push/blackjack
├── resolve calls wallet.winBet on win
├── resolve calls wallet.placeBet on initial deal
└── newRound resets to betting phase
```

**Definition of Done:**
- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] Navigate to `/blackjack/play` — betting controls appear
- [ ] Place a bet with chips, click "Deal" — two cards appear for player and dealer (one face down)
- [ ] Hit adds a card; busting shows loss message
- [ ] Stand triggers dealer play — dealer draws until 17+
- [ ] Winning hand shows win message and credits balance
- [ ] Blackjack (ace + face) pays 3:2
- [ ] Push returns bet
- [ ] Double doubles bet, draws exactly one card
- [ ] Split works on matching ranks, plays each hand
- [ ] Cannot bet more than current balance
- [ ] Balance in header updates correctly after each round
- [ ] Git commit: "Phase 3: Blackjack play mode — full game loop with split/double"

**⏸️ CHECKPOINT:** Stop and ask the user to review. Summary: "Phase 3 complete: fully playable blackjack with hit, stand, double, split, dealer AI, and correct payouts. Card SVGs rendering, chip balance updating. [X] tests passing. Please play several hands — test a blackjack, a bust, a push, a split, and a double."

---

### Phase 4: Baccarat Play Mode
**Goal:** Fully playable baccarat table — place bets on player/banker/tie, cards dealt automatically with correct third-card rules, payouts credited with banker commission.

**Build:**
1. Create `src/engine/baccarat.ts` — pure functions:
   - `evaluateHand(cards)` → number (sum mod 10)
   - `shouldPlayerDraw(playerTotal, playerCardCount)` → boolean
   - `shouldBankerDraw(bankerTotal, bankerCardCount, playerThirdCard)` → boolean (full tableau rules)
   - `resolveBaccarat(playerTotal, bankerTotal)` → `BaccaratResult`
   - `calculatePayout(bet, result)` → number (handles 5% banker commission)
2. Create `src/hooks/useBaccarat.ts` — game state machine:
   - `placeBet(type, amount)` → adds/updates bet
   - `deal()` → deals initial 4 cards, applies third-card rules automatically, resolves
   - `newRound()` → resets for next hand
3. Create `src/components/play/baccarat/BetSelector.tsx` — three large bet areas
4. Create `src/components/play/baccarat/BaccaratTable.tsx` — player/banker card layout with totals
5. Create `src/components/play/baccarat/BaccaratPage.tsx` — orchestrates game loop
6. Update routing to wire `BaccaratPage` to `/baccarat/play`

**Tests:**
```
src/engine/baccarat.test.ts
├── evaluateHand returns sum mod 10
├── evaluateHand: face cards count as 0
├── evaluateHand: ace counts as 1
├── evaluateHand: 7 + 6 = 3 (13 mod 10)
├── shouldPlayerDraw: true when total <= 5
├── shouldPlayerDraw: false when total >= 6
├── shouldPlayerDraw: false on natural (8 or 9)
├── shouldBankerDraw with no player third card (player stood): true when <= 5
├── shouldBankerDraw: banker 3, player third card 8 → false
├── shouldBankerDraw: banker 4, player third card 1 → false
├── shouldBankerDraw: banker 4, player third card 2 → true
├── shouldBankerDraw: banker 4, player third card 3 → true
├── shouldBankerDraw: banker 4, player third card 7 → true
├── shouldBankerDraw: banker 4, player third card 8 → false
├── shouldBankerDraw: banker 6, player third card 6 → true
├── shouldBankerDraw: banker 6, player third card 7 → true
├── shouldBankerDraw: banker 7 → false (always stands)
├── shouldBankerDraw: false on natural (8 or 9)
├── resolveBaccarat: higher total wins
├── resolveBaccarat: equal totals → tie
├── calculatePayout: player bet wins → 1:1
├── calculatePayout: banker bet wins → 0.95:1 (5% commission)
├── calculatePayout: tie bet wins → 8:1
├── calculatePayout: losing bet → 0
└── calculatePayout: tie result with player/banker bet → push (return bet)

src/hooks/useBaccarat.test.ts
├── initializes in betting phase
├── placeBet adds bet to bets array
├── placeBet on same type increases existing bet
├── deal transitions through dealing to resolved
├── third card dealt to player when total <= 5
├── third card dealt to banker per tableau rules
├── no third cards on natural 8 or 9
├── resolve updates wallet correctly for win
├── resolve pushes player/banker bets on tie
└── newRound resets to betting phase
```

**Definition of Done:**
- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] Navigate to `/baccarat/play` — bet selector shows Player/Banker/Tie
- [ ] Place bet on Banker, click "Deal" — cards dealt automatically
- [ ] Third-card rules apply correctly (test several hands)
- [ ] Natural 8 or 9 stops immediately — no third cards
- [ ] Banker win with banker bet shows payout minus 5% commission
- [ ] Tie with player bet pushes (returns bet)
- [ ] Tie with tie bet pays 8:1
- [ ] Can bet on multiple outcomes simultaneously
- [ ] Balance updates correctly
- [ ] Git commit: "Phase 4: Baccarat play mode — full Punto Banco with third-card rules"

**⏸️ CHECKPOINT:** Stop and ask the user to review. Summary: "Phase 4 complete: fully playable baccarat with all third-card rules implemented, 5% banker commission, tie payouts, and multi-outcome betting. [X] tests passing. Please play 10+ hands and verify the third-card draws look correct."

---

### Phase 5: Craps Play Mode
**Goal:** Fully playable craps table with all bet types, come-out and point phases, beginner/full table toggle, correct payout resolution for every bet.

**Build:**
1. Create `src/engine/craps.ts` — pure functions:
   - `rollDice()` → `DiceRoll` (random die1 + die2)
   - `resolveComeOutRoll(roll, bets)` → `BetResolution[]` (natural 7/11, craps 2/3/12, point established)
   - `resolvePointRoll(roll, point, bets)` → `BetResolution[]` (point hit, seven-out, place/field/prop/hardway resolution)
   - `calculateCrapsPayout(betType, amount, point?)` → number (uses CRAPS_PAYOUT_TABLE, handles odds bet variable payouts)
   - `getAvailableBets(phase, point, activeBets)` → `CrapsBetType[]` (which bets can be placed in current state)
2. Create `src/hooks/useCraps.ts` — game state machine:
   - `placeBet(type, amount)` → adds/updates bet (validates via getAvailableBets)
   - `roll()` → generates dice roll, resolves all active bets, updates phase/point
   - `removeBet(type)` → removes an active bet (only if removable — odds bets, place bets)
   - `newShooter()` → resets for new come-out roll after seven-out
3. Create `src/components/play/craps/DiceDisplay.tsx` — SVG dice pair with tumble animation
4. Create `src/components/play/craps/PointMarker.tsx` — ON/OFF puck
5. Create `src/components/play/craps/CrapsBetZone.tsx` — individual clickable bet zone
6. Create `src/components/play/craps/CrapsTable.tsx` — dual-layout craps table: mobile-first card-based layout (bet zones as tappable grouped cards, 393px target) + desktop SVG table layout (768px+). Build mobile layout first, verify all bet zones are tappable at 44px+ targets, then add desktop SVG.
7. Create `src/components/play/craps/BeginnerToggle.tsx` — beginner/full toggle
8. Create `src/components/play/craps/CrapsPage.tsx` — orchestrates full game loop
9. Update routing to wire `CrapsPage` to `/craps/play`

**Tests:**
```
src/engine/craps.test.ts
├── rollDice returns values 1-6 for each die
├── rollDice total equals sum of dice
├── rollDice isHard true when dice match
├── resolveComeOutRoll: 7 → pass wins, don't pass loses
├── resolveComeOutRoll: 11 → pass wins, don't pass loses
├── resolveComeOutRoll: 2 → pass loses, don't pass wins
├── resolveComeOutRoll: 3 → pass loses, don't pass wins
├── resolveComeOutRoll: 12 → pass loses, don't pass pushes (bar 12)
├── resolveComeOutRoll: 4,5,6,8,9,10 → point established, no bets resolved
├── resolvePointRoll: point hit → pass wins, don't pass loses
├── resolvePointRoll: 7 → pass loses, don't pass wins (seven-out)
├── resolvePointRoll: 7 → all place bets lose
├── resolvePointRoll: field bet on 3 → wins 1:1
├── resolvePointRoll: field bet on 2 → wins 2:1
├── resolvePointRoll: field bet on 12 → wins 2:1
├── resolvePointRoll: field bet on 7 → loses
├── resolvePointRoll: place6 hit → pays 7:6
├── resolvePointRoll: hardway6 (3+3) → pays 9:1
├── resolvePointRoll: hardway6 with easy 6 (4+2) → hardway loses
├── resolvePointRoll: hardway loses on 7
├── resolvePointRoll: anySeven on 7 → pays 4:1
├── resolvePointRoll: anyCraps on 2 → pays 7:1
├── calculateCrapsPayout: pass odds on 4/10 → 2:1
├── calculateCrapsPayout: pass odds on 5/9 → 3:2
├── calculateCrapsPayout: pass odds on 6/8 → 6:5
├── calculateCrapsPayout: don't pass odds on 4/10 → 1:2
├── calculateCrapsPayout: uses integer math (no floating point errors)
├── getAvailableBets: comeOut → pass, dontPass, field, props
├── getAvailableBets: point → come, dontCome, odds, place, field, props, hardways
└── getAvailableBets: excludes bets already at max

src/hooks/useCraps.test.ts
├── initializes in comeOut phase with no point
├── placeBet adds to activeBets
├── placeBet rejects invalid bets for current phase
├── roll on come-out: 7 resolves pass/dontPass, stays in comeOut
├── roll on come-out: 4 establishes point, transitions to point phase
├── roll on point: point hit → resolves, new come-out
├── roll on point: 7 → seven-out, all bets resolved, new shooter
├── come bet travels to number on non-7/11/craps roll
├── come odds can be placed on traveled come bet
├── removeBet removes place bet (allowed)
├── removeBet does not remove pass bet (not allowed once point established)
├── beginner toggle filters displayed bet zones
└── roll resolves all active bets correctly in single roll
```

**Definition of Done:**
- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] Navigate to `/craps/play` — craps table renders with all bet zones
- [ ] Mobile (393px): craps uses card-based layout with grouped bet zones, all tap targets ≥44px
- [ ] Desktop (768px+): craps uses traditional SVG table layout
- [ ] Place pass line bet, roll — come-out 7 wins, come-out 4 sets point
- [ ] Point phase: rolling point number wins pass, rolling 7 loses (seven-out)
- [ ] Place odds bet behind pass line — correct payout ratios (2:1, 3:2, 6:5)
- [ ] Field bet resolves correctly (2 and 12 pay 2:1, 3/4/9/10/11 pay 1:1, else lose)
- [ ] Place bets pay correct ratios (7:6 on 6/8, 7:5 on 5/9, 9:5 on 4/10)
- [ ] Hardway bets win on hard number, lose on easy number or 7
- [ ] Proposition bets (any seven, any craps, etc.) resolve correctly
- [ ] Don't pass bar 12 (pushes on come-out 12)
- [ ] Beginner toggle dims sucker bets, highlights smart bets
- [ ] Dice animation plays on roll
- [ ] Point marker shows ON with number or OFF
- [ ] Balance updates correctly
- [ ] Git commit: "Phase 5: Craps play mode — full table, all bets, beginner toggle"

**⏸️ CHECKPOINT:** Stop and ask the user to review. Summary: "Phase 5 complete: fully playable craps with every bet type, come-out and point phases, beginner/full table toggle, and correct payouts. This is the most complex phase — please test extensively. Try: pass + odds, come bets traveling, place bets, field bets, hardways, and a few prop bets. Toggle between beginner and full table views. [X] tests passing."

---

### Phase 6: Polish & Deploy
**Goal:** Responsive cleanup, accessibility pass, edge cases handled, deploy to Vercel, README written.

**Build:**
1. Responsive audit: test all pages at 393px (iPhone 14 Pro — primary target), 768px (tablet), 1280px (desktop). Verify layouts at each breakpoint.
   - Lobby: single-column stacked cards at 393px, grid at 768px+
   - Learn mode: full-width content with collapsible nav at 393px, sidebar layout at 768px+
   - Play mode: tables fit within 393px without horizontal scroll (blackjack, baccarat). Craps uses dedicated mobile layout with grouped bet zones.
   - All tap targets are at least 44×44px on mobile
2. Accessibility pass:
   - Add `aria-label` to all SVG cards (e.g., "Ace of Spades") and dice ("Rolled 3 and 4, total 7")
   - Ensure all buttons have visible focus indicators
   - Tab order follows logical flow: bet controls → action buttons → result dismiss
   - Test with keyboard only — every game action achievable without mouse
   - Add `prefers-reduced-motion` media query: skip card slide and dice tumble animations
3. Edge cases:
   - Chip balance hits 0: show "You're out of chips!" message with reset button
   - Attempting to bet more than balance: disable deal/roll, show message
   - Rapid clicking during animations: disable action buttons during dealing/rolling transitions
   - Browser back/forward during game: gracefully return to lobby (don't leave game in broken state)
4. Visual polish:
   - Card dealing animation (CSS transform slide-in, ~300ms)
   - Chip balance change animation (scale + color flash)
   - Smooth transitions between game phases
   - Loading state while "dealing" (brief delay to feel natural)
5. Deploy setup:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` from project root — follow prompts to link to Vercel project
   - Verify deploy at generated `.vercel.app` URL — all routes should work with clean URLs
   - For future deploys: `vercel --prod`
6. Write `README.md`: project description, screenshots placeholder, tech stack, how to run locally, how to deploy

**Tests:**
```
No new unit tests in this phase. Focus is on manual testing and visual verification.

Manual test checklist:
├── iPhone 14 Pro (393px): lobby stacks, learn nav collapses, tables fit, all tap targets ≥44px
├── Tablet (768px): two-column layouts work, tables comfortable
├── Desktop (1280px): full layouts, tables centered
├── iOS WebKit: no auto-zoom on input focus (font sizes ≥16px)
├── iOS WebKit: 100dvh used instead of 100vh (no address bar overlap)
├── Touch: can complete a full blackjack round using only touch (no hover-dependent interactions)
├── Touch: craps bet zones are individually tappable without mis-taps on adjacent zones
├── Keyboard: tab through entire blackjack round without mouse (desktop)
├── Keyboard: tab through craps betting without mouse (desktop)
├── Screen reader: cards announce rank and suit
├── Screen reader: dice announce roll total
├── Reduced motion: no animations with prefers-reduced-motion
├── Zero balance: shows out-of-chips state
├── Rapid tap: can't double-hit or double-deal
└── Deploy: site loads on Vercel, all routes work with clean URLs
```

**Definition of Done:**
- [ ] `npx vitest run` — all existing tests still pass
- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] Responsive: all pages fully usable at 393px (iPhone 14 Pro), 768px, 1280px
- [ ] Touch: all tap targets ≥44px, complete a blackjack round via touch only
- [ ] iOS WebKit: no auto-zoom on focus, no 100vh overflow
- [ ] Keyboard: complete a full blackjack round using only keyboard (desktop)
- [ ] Accessibility: cards and dice have aria-labels
- [ ] Zero balance: shows reset prompt
- [ ] Animations: cards slide in, dice tumble, balance animates
- [ ] Reduced motion: animations disabled with `prefers-reduced-motion`
- [ ] Deployed to Vercel and all routes work with clean URLs
- [ ] README written
- [ ] Git commit: "Phase 6: Polish — responsive, a11y, animations, deploy"

**⏸️ CHECKPOINT:** Stop and ask the user to review. Summary: "Phase 6 complete: mobile-first responsive design (primary target: iPhone 14 Pro on Firefox iOS), keyboard accessibility, touch target compliance, animations, edge case handling, and deployed to Vercel. [X] tests passing. Please test on your iPhone 14 Pro in Firefox — play a full round of each game via touch. Also try navigating entirely with keyboard on desktop. Site should be live at the Vercel URL."

## Dependency List

```json
{
  "name": "casino-classroom",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "vitest": "^2.0.0"
  }
}
```

## Tricky Parts — Notes for Claude Code

🔴 **Hard: Craps bet resolution engine.** Craps has ~25 bet types, each with different resolution conditions (come-out vs. point phase, specific numbers, hard vs. easy). The `resolveBets` function must correctly handle ALL of these in a single roll, including come bets that "travel" to numbers. Strategy: build a lookup table mapping each bet type to its resolution conditions, then iterate all active bets against the roll. Test exhaustively — every bet type × every relevant roll outcome.

🔴 **Hard: Craps table layout (dual-mode: mobile + desktop).** The craps table needs TWO layouts: (1) a mobile-first layout at 393px where bet zones are presented as tappable grouped cards/list (organized by Smart/Standard/Sucker category) — this is the primary layout; (2) a desktop layout (768px+) with the traditional SVG table with clickable zones and chip placement. The mobile layout is the higher priority — it must work perfectly on iPhone 14 Pro with 44px+ tap targets. The desktop SVG is the visual polish layer. Strategy: build the mobile card-based layout first, get all bet placement and resolution working, then add the desktop SVG table as a responsive alternative. Don't try to make one SVG scale to both — they're fundamentally different interaction patterns.

🟡 **Medium: Baccarat third-card rules.** The banker's third-card decision depends on the banker's total AND the player's third card (if drawn). This is a lookup table (the "tableau"), not intuitive logic. Key detail: when Banker has 4, they draw if the Player's third card is 2, 3, 4, 5, 6, or 7 (NOT 0, 1, 8, or 9). Many sources present this confusingly — double-check against the Wikipedia tableau. Strategy: implement as a pure function with exhaustive test cases covering every row of the tableau. Reference: https://en.wikipedia.org/wiki/Baccarat_(card_game)#Tableau_of_drawing_rules

🟡 **Medium: Blackjack split handling.** Splitting creates two independent hands that must be played sequentially. The `activeHandIndex` must track which hand the player is acting on, and each hand maintains its own bet (doubled if the player doubles on a split hand). Strategy: treat `playerHands` as an array from the start (even before splitting), so the single-hand case is just `playerHands[0]`.

🟡 **Medium: Card SVG components.** Building clean, readable playing card SVGs with correct suit symbols, rank placement, and face-up/face-down states. Strategy: start with a simple rectangle + text approach (rank in corners, suit emoji centered), then refine. Don't attempt photorealistic cards — clean and functional beats pretty.

🟢 **Easy: Chip denomination math.** Breaking a payout amount into chip denominations for visual display. Strategy: greedy algorithm, largest denomination first. This is a display concern only — the wallet stores a single integer balance.

🟢 **Easy: Fisher-Yates shuffle.** Well-known algorithm, just don't use the `.sort(() => Math.random() - 0.5)` anti-pattern. Implement once in `src/utils/shuffle.ts` and reuse everywhere.

## Content Generation Prompt

The following prompt should be copied into a separate Claude conversation to generate the project's content layer. Provide this spec document as context alongside the prompt.

---

**PROMPT:**

You are generating the complete lesson content for Casino Classroom, an educational web app that teaches beginners how to play blackjack, baccarat, and craps. The content must conform to the TypeScript types defined in this project spec (see the `LessonData`, `LessonSection`, `LessonBlock`, `CheatSheetEntry`, and `PayoutTableRow` types in the Type Definitions section).

**Quality benchmark:** Use the example section for "blackjack-basics" (The Basics) in the Data & Content Layer section as your reference for tone, depth, format, and block variety. Match its style exactly. Every section should use a mix of block types — don't write sections that are all `text` blocks.

**Voice/tone:** You're a friendly, experienced casino dealer teaching your friend how to play before their first Vegas trip. Conversational, encouraging, no jargon without explanation, analogies to everyday life where helpful. Assume the reader knows absolutely nothing about casinos. Use "you" throughout. Inject personality — this shouldn't read like a textbook.

**Accuracy requirements:** All payout ratios, house edge percentages, and game rules must be mathematically accurate. Craps payouts must match the `CRAPS_PAYOUT_TABLE` defined in the spec. Baccarat third-card rules must match standard Punto Banco tableau. Blackjack follows Vegas rules: dealer stands on soft 17, blackjack pays 3:2, double after split allowed.

**Items to generate:**

1. **Blackjack lesson** (`src/data/lessons/blackjack.ts`) — 6 sections:
   - The Basics (use the example from the spec as-is, then verify it matches the quality bar)
   - Card Values & Hand Totals
   - Player Actions (hit, stand, double, split, insurance — explain each with examples)
   - Dealer Rules
   - Payouts & Odds
   - Beginner Strategy Tips
   - Cheat sheet: 7 entries

2. **Baccarat lesson** (`src/data/lessons/baccarat.ts`) — 5 sections:
   - The Basics
   - Card Values & Hand Totals
   - Third-Card Rules (make the tableau understandable — this is where beginners get lost)
   - Bet Types & Payouts
   - Beginner Strategy Tips
   - Cheat sheet: 5 entries

3. **Craps lesson** (`src/data/lessons/craps.ts`) — 8 sections:
   - The Basics (what craps is, the energy, the table, the shooter concept)
   - The Come-Out Roll (pass/don't pass, naturals, craps, establishing the point)
   - The Point Phase (how it works, odds bets — emphasize that odds bets are the best bet in the casino)
   - Come & Don't Come (traveling bets, how they mirror pass/don't pass)
   - Place Bets (place, buy — when to use each; note that buy bets are taught for awareness but not playable in the practice table)
   - Field, Big 6 & Big 8 (simple bets, why Big 6/8 is inferior to Place 6/8)
   - Proposition & Hardway Bets (the sucker bets — explain why they exist and why to avoid them, but teach them so the player recognizes them at the table)
   - The Smart Player's Guide (rank all bets by house edge, recommended betting strategy for beginners, bankroll management basics)
   - Cheat sheet: 8 entries

**Content guidelines:**
- Every section should have at least one `tip` or `warning` block
- Every section should have at least one `example` block with a concrete scenario
- Use `payoutTable` blocks whenever listing multiple payouts — don't describe payout ratios in prose
- Sections should be 4-8 blocks each (roughly 300-600 words)
- Craps sections can be longer given the complexity — up to 10 blocks and 800 words
- Cheat sheet entries should be concise (label: 3-5 words, value: 1 sentence max)
- Include `warning` blocks for common beginner mistakes (e.g., taking insurance, betting tie, prop bets)

**Output format:** Three TypeScript files, each exporting a `LessonData` object. Ready to paste directly into the corresponding `src/data/lessons/` file with no editing required. Include the import statement for types at the top of each file.

---

## Future Considerations

These are explicitly deferred from the MVP but worth noting for v2:

- **Blackjack basic strategy chart** — interactive chart showing optimal play (hit/stand/double/split) for every player hand vs. dealer upcard combination, with percentage odds for each outcome
- **Configurable number of decks (blackjack)** — single deck, double deck, 6-deck shoe, 8-deck shoe. Affects card counting viability and some strategy adjustments. Would require deck management changes in the engine.
- **Bet history & statistics dashboard** — track win/loss over time, most profitable game, session length, biggest win/loss
- **Sound effects** — card flip, chip clink, dice roll, win/lose jingles
- **Multiplayer practice** — multiple players at blackjack table (still vs. dealer, but simulates the social experience)
- **Achievements / milestones** — "First blackjack!", "Survived 10 craps rolls", "Banker streak of 5"
