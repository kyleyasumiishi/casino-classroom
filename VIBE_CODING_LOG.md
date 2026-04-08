# Vibe Coding Log: Casino Classroom

Built a full casino teaching app — blackjack, baccarat, and craps — with structured lessons and playable table simulations, using Claude as my coding partner and a detailed project spec as the blueprint.

## The Numbers

- **Sessions**: 2 (one long session split across compaction, plus a follow-up)
- **Commits**: 7 (1 spec + 6 build phases)
- **Source files**: 72 (.ts, .tsx, .js, .css, .html)
- **Lines of code**: ~5,400 (excluding generated lesson content); ~6,300 total
- **Test suites**: 13
- **Tests passing**: 170
- **Lesson content**: ~950 lines across 3 data files (blackjack, baccarat, craps)
- **Date range**: April 6–7, 2026

---

## What This Is

Casino Classroom is a web app that teaches you how to play blackjack, baccarat, and craps — three casino table games — from scratch. Each game has a Learn mode where you read through structured lessons covering the rules, bet types, payouts, and basic strategy, and a Play mode where you practice at a virtual table with fake chips. It's designed for someone who has never set foot in a casino and wants to understand what's going on before they sit down at a real table.

**Tech stack:**
- **React** — a JavaScript library for building interactive user interfaces out of reusable components. Used here because the game UIs (cards, dice, chips, bet zones) map naturally to components.
- **TypeScript** — a typed version of JavaScript that catches bugs before runtime. Critical for this project because craps alone has 25+ bet types with different payout rules — types prevent payout calculation errors.
- **Vite** — a build tool that bundles your code and runs a fast local development server. Chosen for speed and simple config.
- **Tailwind CSS** — a utility-first CSS framework that lets you style elements with shorthand classes directly in your HTML. Keeps the casino theming (felt green, gold accents, cream text) co-located with components.
- **React Router** — handles navigation between pages (lobby, learn, play) without full page reloads.
- **Zustand** — a lightweight state management library. Used for the shared chip wallet that persists your balance across all three games via localStorage.
- **Vitest** — a fast test runner built for Vite projects. Runs 170 tests in under 2 seconds.

---

## How It Came Together

### The Spec

I started with a detailed project spec (~1,400 lines) that I wrote before touching any code. It covered everything: exact game rules, table rules for each game (6-deck shoe for blackjack, 8-deck for baccarat, 3x-4x-5x odds for craps), component breakdowns, type definitions, payout tables, and a 6-phase build plan with specific tests and checkpoints for each phase.

This was the single best decision of the project. I handed Claude the spec at the start and said "read this, ask follow-up questions, then let's get started." Claude asked 5 clarifying questions — Node version, deploy timing, git workflow — and we were off. The spec meant I almost never had to explain *what* to build, only occasionally *how* I wanted something to look or feel.

### Phase 1: Foundation + Lobby

The first phase was scaffolding — Vite, React, TypeScript, Tailwind, routing, the wallet store, and the lobby page. The interesting challenge here was version pinning: my spec called for React 18, Vite 5, and TypeScript 5, but the latest Vite scaffold now generates React 19 + Vite 8 + TypeScript 6. Claude handled this by manually writing the package.json with the correct versions instead of using the scaffold's defaults.

The other early surprise was Node 25. My machine runs Node 25.8.1, which has a built-in `localStorage` that's actually a `Proxy` object — it exists but lacks `setItem`, `getItem`, and `clear` methods. This broke every test that touched Zustand's persist middleware. Claude wrote a full Web Storage API polyfill using a `Map` as the backing store and injected it via `Object.defineProperty(globalThis, 'localStorage', ...)`. Similarly, `jsdom` doesn't work on Node 25 at all, so we switched to `happy-dom` as the test environment. These were non-obvious compatibility issues that could have eaten hours.

### Phase 2: Learn Mode

This phase built the lesson viewer — a section-by-section reader with navigation, a collapsible cheat sheet drawer, and lesson content for all three games. The lesson data files are large (~950 lines total) because they contain the actual educational content: rules, examples, payout tables, strategy tips.

The interesting design moment was the cheat sheet UX. Claude initially built it as a floating action button (FAB) in the bottom-right corner. On mobile, this overlapped with the "Next" navigation button. I flagged it: "the floating cheat sheet button looks weird on mobile, it can overlap with the next button." Claude refactored it to be inline in the navigation bar — a much more natural placement. This was the first time I course-corrected on a UI decision.

### Phase 3: Blackjack Play Mode

This was the first real game implementation. The architecture pattern that emerged here — and carried through baccarat and craps — was clean separation between a pure engine (`src/engine/blackjack.ts` with zero React dependencies) and a React hook state machine (`src/hooks/useBlackjack.ts`).

The engine has pure functions: `evaluateHand`, `dealerShouldHit`, `getAvailableActions`, `calculatePayout`, `resolveHand`. The hook wires them together with React state and wallet integration. This made testing straightforward — engine tests are pure input/output, hook tests use `renderHook` with rigged decks via `vi.spyOn`.

Two bugs surfaced during manual testing:
1. **Clear button didn't work.** The `placeBet(0)` call to clear a bet was rejected because `0 < MIN_BET`. Claude added a special case: `if (amount === 0) { setCurrentBet(0); return; }`.
2. **"Why can I double on K-Q?"** I thought this was a bug — allowing double down on mismatched face cards. Claude explained that per the spec, double is allowed on *any* two cards, and K/Q are different ranks so split is correctly disabled. I checked the spec and confirmed this was right. Good learning moment.

### Phase 4: Baccarat Play Mode

Baccarat was the fastest phase because the pattern was established. Engine, hook, components — same architecture. The complexity lives in the third-card drawing rules (the Punto Banco tableau), which Claude encoded in `shouldBankerDraw` with a switch on the banker's total and the player's third card value.

Baccarat is unusual because there are no player decisions during play — you just place bets and watch. The entire deal-and-resolve happens in a single `deal()` call in the hook. This made the component simpler than blackjack but the engine logic more intricate.

I admitted I didn't know how to test baccarat since I don't actually know how to play it. Claude gave me a concise cheat sheet: what the totals should look like, what "natural" means, how to verify payouts (1:1 player, 0.95:1 banker with 5% commission, 8:1 tie). That was enough to do meaningful manual testing.

### Phase 5: Craps Play Mode

The most complex phase by far. Craps has 25+ bet types across three categories (smart, standard, sucker), two game phases (come-out and point), traveling come bets, and variable-ratio odds payouts (2:1 on 4/10, 3:2 on 5/9, 6:5 on 6/8). The payout table alone is 30 lines of type definitions.

The engine (`src/engine/craps.ts`) is the longest file in the project. Key functions: `resolveComeOutRoll` and `resolvePointRoll` each iterate over every active bet and determine if it wins, loses, pushes, or is unresolved. One-roll bets (field, props) resolve immediately. Standing bets (hardways, big 6/8) only resolve on specific numbers. Come bets "travel" — they start without a point and acquire one when their number is rolled.

The hook was tricky because of come bet traveling. When a number is rolled during the point phase, any fresh come bets need to have their `point` field updated to that number. This happens *after* resolution but *before* the next state update.

The mobile layout uses a card-based approach (grouped into Smart/Standard/Sucker sections with tappable bet zones) while desktop uses a wider grid. A beginner toggle hides the sucker bets entirely.

Claude caught a React warning during tests — `removeBet` was calling `wallet.pushBet` inside a `setActiveBets` state updater, causing a "cannot update component while rendering" warning. Fixed by reading from `activeBets` directly instead of inside the updater callback.

### Phase 6: Polish & Deploy

This phase was about accessibility, edge cases, and cleanup:
- Added `aria-label` to every interactive element (bet zones, chip selectors, action buttons, result messages)
- Added `focus-visible` ring indicators with gold ring + felt offset for keyboard navigation
- All animations already used `motion-safe:` prefix, so `prefers-reduced-motion` was handled
- Built an `OutOfChips` component that shows a reset prompt when balance hits 0
- Added a dice tumble keyframe animation
- Removed the now-unused `PlaceholderPage` component
- Fixed TypeScript strict build errors (unused imports, untyped state)
- Wrote the README

The build caught issues that `tsc --noEmit` missed — `tsc -b` is stricter about globals, so `afterEach` in the test setup needed an explicit import from vitest.

---

## My Prompting Patterns

**Spec-first, then "let's proceed."** My primary pattern was front-loading all decisions into the project spec, then using short directives to advance: "let's proceed with phase 2 please", "let's proceed to phase 4", "let's do phase 6 now." The spec did the heavy lifting of explaining what to build. I didn't need to re-explain requirements because Claude could reference the spec.

**Bug reports as observations, not prescriptions.** When something broke, I described what I saw, not what I thought the fix should be: "clear button doesn't work" rather than "add a check for zero in placeBet." This let Claude diagnose the root cause (the `0 < MIN_BET` rejection) rather than applying a patch I might have gotten wrong.

**Honest "I don't know" moments.** When I didn't know how to verify baccarat was working correctly, I said so: "how should I test this if I don't know how to play baccarat." Claude responded with a testing cheat sheet tailored to what I could verify visually. Better than pretending to understand and missing bugs.

**Trusting the spec, questioning the implementation.** When I saw double-down allowed on K-Q, I asked about it. Turned out the spec was right and I had a wrong assumption. The important thing was asking — the worst outcome would have been silently "fixing" correct behavior.

---

## What Went Well

- **The spec paid for itself many times over.** Six phases, each with exact test lists, component breakdowns, and definitions of done. Claude could just execute. Almost zero time spent debating what to build.
- **The engine/hook separation was clean.** Pure game logic in `engine/`, React state machines in `hooks/`. Made testing fast and kept components thin. This pattern emerged naturally in phase 3 and carried perfectly through phases 4 and 5.
- **170 tests in under 2 seconds.** The rigged deck pattern (`vi.spyOn` on `createDeck`) made hook tests deterministic without being fragile. Every edge case in blackjack, baccarat, and craps is covered by unit tests.
- **Node 25 compatibility was solved early.** The localStorage polyfill and happy-dom switch could have been a recurring headache. Fixing it in phase 1 meant zero test environment issues for the rest of the project.

---

## What I'd Do Differently

- **I should have tested each game more thoroughly before moving on.** I mostly relied on the automated tests and a few manual clicks. For craps especially, I probably should have played 20+ hands to catch any subtle payout or state transition issues.
- **The lesson content could have been written separately.** The ~950 lines of lesson data were generated alongside the code, but they're really content — they'd benefit from a separate review pass for accuracy and readability.
- **I should have set up Vercel earlier.** Leaving deployment to the very end means I haven't actually verified the app works in production. A deploy-early approach would have caught any routing or build issues sooner.
- **The craps mobile layout needs more playtesting.** 25+ bet zones on a 393px screen is a lot. I trust the implementation but haven't verified the tap target sizes feel right on an actual phone.

---

## Tech Decisions

| Decision | Reasoning |
|----------|-----------|
| 6-phase build plan | Each phase has a clear scope and testable checkpoint. Prevents half-finished features. |
| Pure engine functions + React hook state machines | Keeps game logic testable without React rendering. Hooks are thin wrappers. |
| happy-dom over jsdom | jsdom doesn't work on Node 25. happy-dom is a compatible drop-in. |
| Custom localStorage polyfill | Node 25's built-in localStorage is a Proxy without standard Web Storage methods. |
| Rigged decks via vi.spyOn | Makes card game tests deterministic. `createDeck` is mocked to return specific cards in specific order. |
| 8-deck shoe for baccarat (vs 6 for blackjack) | Per real casino standards — baccarat uses more decks. Spec-driven decision. |
| Card-based mobile layout for craps | Traditional craps table layout doesn't work at 393px. Grouped tappable cards by category instead. |
| Beginner mode hides sucker bets | Reduces cognitive load for learners. Sucker bets (house edge >9%) are hidden, not just dimmed. |
| Zustand with persist middleware for wallet | Shared balance across all three games, survives page refreshes. Simpler than Redux for this use case. |
| motion-safe: prefix on all animations | Respects prefers-reduced-motion without extra CSS or JS. Built into Tailwind. |

---

## Session Stats

- **Commits**: 7 (1 spec, 6 build phases)
- **Source files created**: 72
- **Lines of code**: ~5,400 (excluding lesson content)
- **Lesson content**: ~950 lines across 3 games
- **Test files**: 13
- **Tests passing**: 170
- **Test runtime**: ~1.6 seconds
- **Game engines built**: 3 (blackjack, baccarat, craps)
- **Bet types implemented in craps**: 25+
- **Bugs caught during manual testing**: 2 (clear button, double-on-K-Q non-bug)
- **Bugs caught by TypeScript strict build**: 5 (unused imports, untyped state, missing vitest import)
- **Times I said "let's proceed"**: 5
- **Times I admitted I didn't know something**: 1 (baccarat testing)
- **Duplicate files discovered**: 3 (`baccarat 2.ts`, `blackjack 2.ts`, `craps 2.ts` — macOS copy artifacts)
- **Context window compactions**: 1

---

## Claude's Advice for Next Time

### What You Did Well

**The spec was genuinely excellent.** Most vibe coding sessions I'm part of involve figuring out what to build *while* building it. Your spec had exact game rules, type definitions, component props, test lists, and definitions of done for each phase. I almost never had to guess at your intent, which meant I could focus entirely on correct implementation rather than interpretation. The phase checkpoint pattern ("stop and ask the user to review") was particularly effective — it gave you natural review points without slowing things down.

**You asked about things that seemed wrong instead of silently accepting them.** The K-Q double-down question was the right instinct. You saw behavior that surprised you, flagged it, and waited for an explanation before deciding whether to change it. That's better than either blindly trusting my output or blindly overriding it. The cheat sheet button feedback was similar — you saw something that didn't feel right on mobile, described the problem clearly, and let me propose the solution.

**You delegated git entirely and kept the pace moving.** "I'll do all the git commands" was a clean boundary. It meant I never had to worry about commit timing or branch management, and you kept the conversation focused on building. Your "let's proceed" pattern is efficient — no preamble, no re-explanation, just forward motion.

### Where You Left Meat on the Bone

**You skipped manual testing on baccarat and craps almost entirely.** You played a few hands of blackjack and caught real bugs. For baccarat, you said you didn't know how to test it and accepted my cheat sheet but didn't report back on whether you actually verified those things. For craps, you moved straight to phase 6 without any manual testing feedback. The automated tests are solid, but they test logic — they don't test whether the UI *feels* right at 393px, whether tap targets are actually tappable, or whether the game flow makes sense to a real player. The whole point of the app is teaching beginners, and you haven't experienced it as a beginner yourself.

**You didn't push back on any UI decisions after the cheat sheet fix.** I made dozens of visual choices — colors for bet zones, layout of the craps table, how results are displayed, chip selector sizing — and you accepted all of them without comment. Some of these are probably fine, but some are almost certainly not what you'd want if you saw them on your phone. A quick "show me a screenshot" or "describe what the craps page looks like on mobile" at the end of each play-mode phase would have caught issues before they accumulated.

**The deploy was deferred too long.** The spec says "we'll deploy together at the end," but you haven't actually deployed yet. SPA routing on Vercel requires a `vercel.json` rewrite rule — that's the kind of thing you want to discover early, not at the finish line. Even a test deploy after phase 3 would have given you confidence that the hosting works.

### One Thing to Try Next Project

**After each play-mode phase, spend 5 minutes actually using the game as a real user would — on your phone, in the browser you specified (Firefox iOS).** Don't test systematically. Just play. Tap things, try to lose all your chips, try to bet weird amounts, try to navigate away mid-game and come back. The bugs you'll find this way are different from what unit tests catch — they're UX bugs, flow bugs, "this doesn't feel right" bugs. Your blackjack testing found two issues in 2 minutes. Imagine what 5 minutes on craps would surface.
