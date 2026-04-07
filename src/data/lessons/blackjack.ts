import type { LessonData } from '../../types/lesson';

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
    {
      id: 'blackjack-card-values',
      title: 'Card Values & Hand Totals',
      content: [
        {
          type: 'text',
          body: 'Counting your hand in blackjack is easy — way easier than you think. Number cards (2 through 10) are worth their face value. A 7 is worth 7. A 3 is worth 3. No surprises there.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Face Cards and Aces'
        },
        {
          type: 'text',
          body: 'Face cards — Jack, Queen, and King — are all worth 10. It doesn\'t matter which one you get; they\'re all the same for counting purposes. That means 16 out of every 52 cards in the deck are worth 10 (the four 10s plus twelve face cards). This is important — roughly a third of the deck is a 10-value card, and that shapes a lot of strategy.'
        },
        {
          type: 'text',
          body: 'The Ace is the most powerful card in blackjack because it can be worth either 1 or 11 — whichever helps your hand more. This creates two types of hands that you\'ll hear people talk about at the table:'
        },
        {
          type: 'tip',
          body: 'A "soft" hand contains an Ace being counted as 11. It\'s called soft because you can\'t bust by taking another card — the Ace just drops to 1. A "hard" hand has no Ace, or has an Ace forced to count as 1. For example, Ace + 6 = soft 17. Ace + 6 + King = hard 17 (the Ace has to be 1 to avoid busting).'
        },
        {
          type: 'example',
          scenario: 'You\'re dealt an Ace and a 5.',
          action: 'Your hand is a soft 16 (Ace = 11, plus 5). You hit and draw a 9.',
          result: 'Now the Ace shifts to count as 1 (1 + 5 + 9 = 15). You didn\'t bust! You have a hard 15 and can decide to hit again or stand.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'What Is a Blackjack?'
        },
        {
          type: 'text',
          body: 'A "blackjack" (also called a "natural") is the best possible hand: an Ace plus any 10-value card (10, Jack, Queen, or King), dealt as your first two cards. It totals 21 and beats everything except another blackjack, which results in a push (tie). Getting 21 with three or more cards is just 21 — it\'s good, but it\'s not a blackjack and doesn\'t get the bonus payout.'
        },
        {
          type: 'warning',
          body: 'Don\'t confuse "21" with "blackjack." If you split a pair of Aces and draw a King on one of them, that\'s 21 but NOT a blackjack — it pays 1:1, not 3:2. A blackjack must be your original two-card hand.'
        }
      ]
    },
    {
      id: 'blackjack-player-actions',
      title: 'Player Actions',
      content: [
        {
          type: 'text',
          body: 'After your initial two cards are dealt, you have several options. Not every option is available every time — some depend on your hand, the dealer\'s upcard, or how much you can bet. Here\'s every action you can take at the table:'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Hit & Stand'
        },
        {
          type: 'text',
          body: 'These are your bread and butter. "Hit" means take another card. "Stand" means you\'re done — play your hand as-is. You can hit as many times as you want, but if your total goes over 21 you bust and lose immediately, before the dealer even plays.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Double Down'
        },
        {
          type: 'text',
          body: 'When you double down, you double your original bet and receive exactly one more card — no more, no less. This is your power move. You use it when you have a strong starting total and the dealer looks weak. You\'re telling the table "I like my chances so much, I\'m putting up more money."'
        },
        {
          type: 'example',
          scenario: 'You\'re dealt a 6 and a 5 (total: 11). The dealer shows a 5.',
          action: 'You double down. Your bet goes from $10 to $20, and you receive one card: a 10.',
          result: 'You now have 21 — the best possible total — with double the bet on the table. The dealer reveals a 10 underneath (15), hits, draws a Queen, and busts. You win $20!'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Split'
        },
        {
          type: 'text',
          body: 'When your two cards are the same rank (two 8s, two Aces, two 7s, etc.), you can split them into two separate hands, each with its own bet equal to your original. Each hand gets a second card and you play them one at a time. You can hit, stand, or even double down on most split hands. This is how you can turn a terrible hand into two good ones. One exception: split Aces receive exactly one card each — no hitting, no doubling. That\'s a standard casino rule, and it applies here too.'
        },
        {
          type: 'tip',
          body: 'Two rules to always follow: ALWAYS split Aces and 8s. Never split 10s or 5s. A pair of 8s gives you 16 — the worst hand in blackjack. But split them and each 8 has a chance to become 18. A pair of Aces? Each one could become 21.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Insurance'
        },
        {
          type: 'text',
          body: 'When the dealer\'s upcard is an Ace, the casino offers you "insurance" — a side bet of up to half your original bet that the dealer has a blackjack. If the dealer does have blackjack, insurance pays 2:1 and you break even on the round. Sounds safe, right?'
        },
        {
          type: 'warning',
          body: 'Insurance is a bad bet — full stop. The house edge on insurance is about 7.4%. The math doesn\'t work in your favor regardless of what cards you\'re holding. Experienced players almost never take it. Think of it this way: the casino wouldn\'t offer it if it wasn\'t profitable for them.'
        }
      ]
    },
    {
      id: 'blackjack-dealer-rules',
      title: 'Dealer Rules',
      content: [
        {
          type: 'text',
          body: 'Here\'s the thing that makes blackjack different from every other casino game: the dealer has no choices. Zero. They follow a set of rigid rules printed right on the table felt, and they can\'t deviate no matter what. This is your edge — you get to make decisions while they\'re on autopilot.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Dealer\'s Algorithm'
        },
        {
          type: 'text',
          body: 'The rule is simple: the dealer must hit on 16 or less, and must stand on 17 or more. In this version of blackjack, the dealer also stands on a "soft 17" (an Ace plus a 6). That\'s the entire strategy — no thinking, no reading the table, no gut feelings. Just math.'
        },
        {
          type: 'example',
          scenario: 'The dealer reveals their hole card, showing a 10 and a 3 (total: 13).',
          action: 'The dealer must hit. They draw a 5 (total: 18).',
          result: 'The dealer stands on 18. Now your hand is compared to 18 — if you have 19 or more, you win. If you have 18, it\'s a push. If you have 17 or less, you lose.'
        },
        {
          type: 'text',
          body: 'Why does this matter for you? Because you can predict what the dealer will do. If the dealer shows a 6, you know they probably have 16 and must hit — which means they have a high chance of busting. If they show a 10, they probably have a strong hand. This information shapes every decision you make.'
        },
        {
          type: 'tip',
          body: 'Dealer "bust cards" are 2 through 6. When the dealer shows one of these, they\'re most likely to bust. This is when you play conservatively with your hand and aggressively with your bets (double down more, stand on lower totals). When the dealer shows 7 through Ace, they\'re likely to end up with 17-21 — you need to be aggressive with your hand to beat them.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The House Edge'
        },
        {
          type: 'text',
          body: 'The dealer\'s biggest advantage isn\'t their rules — it\'s the order of play. You go first, and if you bust, you lose immediately. The dealer never even has to play their hand. Even if the dealer would have busted too, your money is already gone. This "double bust" rule is where the house edge comes from.'
        }
      ]
    },
    {
      id: 'blackjack-payouts',
      title: 'Payouts & Odds',
      content: [
        {
          type: 'text',
          body: 'Understanding what you get paid and how much the house takes is critical to being a smart player. Blackjack has some of the most favorable odds in the casino — if you play correctly.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Regular win', pays: '1:1', houseEdge: '~0.5%', notes: 'Your hand beats the dealer\'s hand' },
            { bet: 'Blackjack (natural 21)', pays: '3:2', houseEdge: '~0.5%', notes: 'Ace + 10-value card on first two cards' },
            { bet: 'Insurance', pays: '2:1', houseEdge: '~7.4%', notes: 'Side bet that dealer has blackjack — avoid this' },
            { bet: 'Push (tie)', pays: '0:0', houseEdge: 'N/A', notes: 'Your bet is returned, no win or loss' }
          ]
        },
        {
          type: 'heading',
          level: 3,
          text: 'What Does "3:2" Actually Mean?'
        },
        {
          type: 'text',
          body: 'A 3:2 payout means for every $2 you bet, you win $3. So a $10 bet on a blackjack pays $15 in profit (plus your $10 back). A regular win at 1:1 means you win exactly what you bet — $10 bet wins $10. Simple as that.'
        },
        {
          type: 'warning',
          body: 'Watch out for tables advertising "6:5 blackjack." This means a $10 blackjack only pays $12 instead of $15. It looks like a small difference, but it nearly triples the house edge. Always look for 3:2 tables — it should be printed right on the felt.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Best Odds in the House'
        },
        {
          type: 'text',
          body: 'With basic strategy (which we\'ll cover next), the house edge in blackjack drops to around 0.5%. That means for every $100 you bet over time, you\'d expect to lose about 50 cents. Compare that to roulette (5.26%) or slot machines (5-15%). Blackjack gives you the best shot of any common casino game — but only if you learn the right moves.'
        },
        {
          type: 'example',
          scenario: 'You bet $10. You\'re dealt an Ace and a Queen — blackjack!',
          action: 'The dealer checks their hole card. No dealer blackjack.',
          result: 'You win $15 at 3:2 odds, plus your original $10 back. Total returned: $25.'
        }
      ]
    },
    {
      id: 'blackjack-strategy',
      title: 'Beginner Strategy Tips',
      content: [
        {
          type: 'text',
          body: 'Full "basic strategy" is a mathematically perfect decision for every possible hand — and we\'ll add a detailed chart in a future update. For now, here are the core rules that will get you 90% of the way there. Memorize these and you\'ll play better than most people at the table.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Always Rules'
        },
        {
          type: 'text',
          body: 'These are never-deviate, no-thinking-required plays. Always stand on 17 or higher — you\'re too likely to bust. Always hit on 8 or less — you literally can\'t bust with one more card, and your total is too low to win. Always split Aces and 8s. Never split 10s or 5s.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Read the Dealer'
        },
        {
          type: 'text',
          body: 'The dealer\'s upcard tells you how aggressive to be. When the dealer shows 2 through 6 (bust cards), they\'re in trouble — stand on 12 or higher and let them bust. When the dealer shows 7 through Ace, they probably have a strong hand — hit until you reach at least 17.'
        },
        {
          type: 'example',
          scenario: 'You have 13. The dealer shows a 5.',
          action: 'You stand. 13 is normally a bad hand, but the dealer\'s 5 means they\'ll likely bust.',
          result: 'The dealer has 15, hits, draws a 10, and busts with 25. Your ugly 13 wins because you were patient.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'When to Double Down'
        },
        {
          type: 'text',
          body: 'Double down on 11 almost always — you\'re very likely to hit 21 or close to it. Double on 10 when the dealer shows 2-9. Double on 9 when the dealer shows 3-6. In all of these spots, the math heavily favors putting more money on the table.'
        },
        {
          type: 'tip',
          body: 'The single most important beginner tip: never take insurance, and never play at a 6:5 table. These two things alone will save you more money than any other strategy advice. After that, just follow the "always" rules and read the dealer\'s upcard — you\'ll be ahead of most casual players.'
        },
        {
          type: 'warning',
          body: 'Don\'t chase losses by increasing your bet after a losing streak. Each hand is independent — the cards don\'t know or care that you just lost five in a row. Stick to consistent bet sizing and let the math work in your favor over time.'
        }
      ]
    }
  ],
  cheatSheet: [
    { label: 'Goal', value: 'Beat the dealer by getting closer to 21 without going over' },
    { label: 'Blackjack', value: 'Ace + 10-value card = instant win, pays 3:2' },
    { label: 'Dealer rule', value: 'Must hit on 16 or less, must stand on 17+' },
    { label: 'Soft hand', value: 'Any hand with an Ace counted as 11' },
    { label: 'Best move', value: 'Always stand on 17+. Always hit on 8 or less.' },
    { label: 'Avoid', value: 'Insurance bet — it\'s a sucker bet (house edge ~7%)' },
    { label: 'House edge', value: '~0.5% with basic strategy, ~2% without' }
  ]
};
