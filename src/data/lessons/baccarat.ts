import type { LessonData } from '../../types/lesson';

export const baccaratLesson: LessonData = {
  gameType: 'baccarat',
  title: 'Baccarat Made Simple',
  sections: [
    {
      id: 'baccarat-basics',
      title: 'The Basics',
      content: [
        {
          type: 'text',
          body: 'Baccarat has a reputation as a high-roller game — you\'ve probably seen it in James Bond movies with tuxedos and velvet ropes. But here\'s the secret: it\'s actually the simplest table game in the entire casino. You make one decision (where to place your bet), and then the cards play themselves. No strategy required during the hand. No choices to agonize over. Just bet and watch.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'How a Round Works'
        },
        {
          type: 'text',
          body: 'Two hands are dealt on the table: the "Player" hand and the "Banker" hand. Don\'t let the names confuse you — you\'re not the Player, and the Banker isn\'t the house. They\'re just the two sides you can bet on, like home and away in a football game. You bet on which hand will end up closer to a total of 9. That\'s it.'
        },
        {
          type: 'tip',
          body: 'You can also bet on a Tie — that both hands will have the same total. It pays 8:1, which sounds amazing, but we\'ll get to why it\'s actually a terrible bet in the strategy section.'
        },
        {
          type: 'text',
          body: 'Each side gets two cards to start. Depending on the totals, a third card may be drawn for one or both sides following strict rules (more on those later). Once all cards are dealt, the side closest to 9 wins. If you bet on the winning side, you get paid.'
        },
        {
          type: 'example',
          scenario: 'You place a $10 bet on "Banker." Two cards are dealt to each side.',
          action: 'Player gets a 7 and a King (total: 7). Banker gets a 9 and a 4 (total: 3). A third card is drawn for Banker: a 5.',
          result: 'Banker\'s final total is 8. Player has 7. Banker wins! You collect $9.50 ($10 minus the 5% commission on Banker wins).'
        },
        {
          type: 'text',
          body: 'The pace is fast, the decisions are minimal, and the house edge is one of the lowest in the casino. Baccarat isn\'t complicated — it just looks fancy.'
        }
      ]
    },
    {
      id: 'baccarat-card-values',
      title: 'Card Values & Hand Totals',
      content: [
        {
          type: 'text',
          body: 'Baccarat counts cards differently from blackjack, but the system is just as simple once you see it. The goal is to get as close to 9 as possible — not 21. That one difference changes everything.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Card Values'
        },
        {
          type: 'text',
          body: 'Number cards (2-9) are worth their face value, just like blackjack. But here\'s where it diverges: 10s and face cards (Jack, Queen, King) are all worth zero. And Aces are always worth 1 — no dual-value magic like in blackjack. A King is a zero. A Queen is a zero. Just dead weight in your hand.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Mod-10 Rule'
        },
        {
          type: 'text',
          body: 'Here\'s the key to baccarat math: only the last digit of the total matters. If your cards add up to 15, your hand is worth 5. If they add up to 23, your hand is worth 3. You basically drop the tens digit. Think of it like a clock — when you go past 9, you loop back around to 0.'
        },
        {
          type: 'example',
          scenario: 'The Player hand is dealt a 7 and an 8.',
          action: '7 + 8 = 15. Drop the tens digit.',
          result: 'The Player hand total is 5. In any other game, 15 would be decent. In baccarat, 5 is just okay — and it means the Player will draw a third card.'
        },
        {
          type: 'tip',
          body: 'The best possible hand in baccarat is a "natural" — a two-card total of 8 or 9. If either side is dealt a natural, the round ends immediately. No third cards, no drama. A natural 9 beats a natural 8, and a natural beats any three-card hand.'
        },
        {
          type: 'warning',
          body: 'Don\'t add card values the way you do in blackjack. A hand of King + 7 is worth 7 in baccarat (0 + 7), not 17. This trips up a lot of first-timers.'
        }
      ]
    },
    {
      id: 'baccarat-third-card',
      title: 'Third-Card Rules',
      content: [
        {
          type: 'text',
          body: 'This is the part of baccarat that scares people off — the third-card rules. But here\'s the good news: you never have to make a decision about any of this. The dealer handles it all automatically. You just need to understand why a third card is being dealt so you can follow along.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'When It\'s Automatic'
        },
        {
          type: 'text',
          body: 'Two situations end the round immediately with no third card: if either the Player or Banker has a natural (8 or 9) on their first two cards, everybody stops. Game over, highest natural wins (or tie if both are equal). No third card is ever drawn against a natural.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Player\'s Third Card'
        },
        {
          type: 'text',
          body: 'The Player side always acts first, and the rule is dead simple: if the Player\'s two-card total is 0-5, the Player draws a third card. If it\'s 6 or 7, the Player stands. That\'s the entire rule. No exceptions, no judgment calls.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Banker\'s Third Card'
        },
        {
          type: 'text',
          body: 'The Banker\'s rule is more complex because it depends on what the Player\'s third card was. If the Player stood (didn\'t draw), the Banker follows the same simple rule: draw on 0-5, stand on 6-7. But if the Player drew a third card, the Banker consults a specific chart called the "tableau." The Banker\'s decision depends on their own total AND the specific card the Player drew.'
        },
        {
          type: 'text',
          body: 'Here\'s the Banker tableau in plain language. The Banker draws a third card when their total is 0, 1, or 2 regardless of what the Player drew. Beyond that: with a total of 3, the Banker draws unless the Player\'s third card was an 8. With 4, the Banker draws if the Player\'s third card was 2 through 7. With 5, the Banker draws if the Player\'s third card was 4 through 7. With 6, the Banker draws only if the Player\'s third card was a 6 or 7. With 7, the Banker always stands.'
        },
        {
          type: 'tip',
          body: 'You absolutely do NOT need to memorize the Banker tableau. The dealer handles it automatically — it\'s literally built into the game. Just know that it exists and that the Banker rules slightly favor the Banker side winning more often, which is why Banker bets have a small commission.'
        },
        {
          type: 'example',
          scenario: 'Player\'s first two cards are a 3 and an Ace (total: 4). Banker\'s first two cards are a King and a 5 (total: 5).',
          action: 'Player has 4, so Player draws a third card: a 6. The dealer checks the tableau: Banker has 5, and the Player\'s third card was a 6. The rule says Banker draws when the Player\'s third card is 4 through 7.',
          result: 'Banker draws a 2, making Banker\'s total 5 + 2 = 7. Player\'s total is 3 + 1 + 6 = 10, mod 10 = 0. Banker wins with 7 vs 0.'
        }
      ]
    },
    {
      id: 'baccarat-payouts',
      title: 'Bet Types & Payouts',
      content: [
        {
          type: 'text',
          body: 'Baccarat keeps things refreshingly simple — there are only three bets you can make. No side bets to learn, no complicated parlays. Just pick a side and watch.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Player', pays: '1:1', houseEdge: '1.24%', notes: 'Straightforward even-money bet' },
            { bet: 'Banker', pays: '0.95:1', houseEdge: '1.06%', notes: '5% commission on wins (still the best bet)' },
            { bet: 'Tie', pays: '8:1', houseEdge: '14.36%', notes: 'Looks tempting — don\'t fall for it' }
          ]
        },
        {
          type: 'heading',
          level: 3,
          text: 'Why the Banker Commission?'
        },
        {
          type: 'text',
          body: 'You might wonder why the casino takes a 5% cut on Banker wins. It\'s because the Banker side has a slight mathematical advantage thanks to the third-card rules — the Banker acts second and gets to "react" to the Player\'s third card. Without the commission, everyone would just bet Banker every time and the casino would lose money. Even with the 5% cut, Banker is still the best bet at the table.'
        },
        {
          type: 'example',
          scenario: 'You bet $20 on Banker. Banker wins the round.',
          action: 'The casino applies the 5% commission: $20 × 0.05 = $1.',
          result: 'You receive $19 in profit ($20 win minus $1 commission) plus your original $20 back. Total returned: $39.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'What Happens on a Tie?'
        },
        {
          type: 'text',
          body: 'If you bet on Player or Banker and the round results in a tie, your bet is returned — it\'s a push. You don\'t win and you don\'t lose. Only Tie bets win on a tie outcome. This is actually a nice safety net built into the Player and Banker bets.'
        },
        {
          type: 'warning',
          body: 'The Tie bet looks incredible at 8:1, but ties only occur about 9.5% of the time. The house edge is a brutal 14.36% — that\'s worse than most slot machines. The casino loves when you bet Tie. Don\'t be the person they love.'
        }
      ]
    },
    {
      id: 'baccarat-strategy',
      title: 'Beginner Strategy Tips',
      content: [
        {
          type: 'text',
          body: 'Baccarat strategy is the easiest strategy section you\'ll ever read, because there\'s barely any strategy to talk about. You have no decisions during the hand — no hitting, no standing, no doubling. Your only choice is where to put your chips before the cards are dealt.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The One Rule: Bet Banker'
        },
        {
          type: 'text',
          body: 'If you want the mathematically optimal approach, bet Banker every single time. With a house edge of 1.06% (even after the 5% commission), it\'s one of the best bets in the entire casino. The Player bet at 1.24% is also respectable — switching between the two is fine if Banker feels boring. Just never bet Tie.'
        },
        {
          type: 'tip',
          body: 'Many players track results looking for "patterns" or "streaks" — you\'ll see scoreboards at baccarat tables for this. Here\'s the truth: every hand is independent. The cards don\'t remember what happened last round. Streak-chasing is fun but it doesn\'t change your odds. Bet Banker and relax.'
        },
        {
          type: 'example',
          scenario: 'You sit down with $200 and plan to play 50 hands, betting $10 each time on Banker.',
          action: 'Over 50 hands, you\'ll bet a total of $500. With a 1.06% house edge, the expected loss is about $5.30.',
          result: 'You\'ll probably leave with somewhere around $195 — give or take the natural variance. Compare that to 50 spins on roulette where you\'d expect to lose $26. Baccarat is gentle on your bankroll.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Bankroll Management'
        },
        {
          type: 'text',
          body: 'Set a budget before you sit down and stick to it. Baccarat moves fast — you can play 40-60 hands per hour. A good rule of thumb is to bring at least 20-30 times your base bet. If you\'re betting $10 a hand, have at least $200-$300 in your stack. This gives you enough cushion to ride out cold streaks without going broke.'
        },
        {
          type: 'warning',
          body: 'Don\'t use "progression" betting systems like Martingale (doubling your bet after every loss). They don\'t overcome the house edge — they just guarantee that when you lose, you lose big. Flat betting (the same amount every hand) is the safest approach for beginners.'
        }
      ]
    }
  ],
  cheatSheet: [
    { label: 'Goal', value: 'Bet on the hand that finishes closest to 9' },
    { label: 'Card values', value: '2-9 face value, 10s and face cards = 0, Ace = 1' },
    { label: 'Best bet', value: 'Banker — 1.06% house edge even after 5% commission' },
    { label: 'Natural', value: 'Two-card total of 8 or 9 — round ends immediately' },
    { label: 'Avoid', value: 'Tie bet — 14.36% house edge despite the 8:1 payout' }
  ]
};
