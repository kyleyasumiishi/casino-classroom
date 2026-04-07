import type { GameConfig } from '../types/common';

export const gameConfigs: GameConfig[] = [
  {
    type: 'blackjack',
    name: 'Blackjack',
    tagline: 'Beat the dealer to 21',
    description: 'The most popular table game in the casino. Simple to learn, strategic to master. Get closer to 21 than the dealer without going over.',
    icon: '🃏',
    learnPath: '/blackjack/learn',
    playPath: '/blackjack/play',
  },
  {
    type: 'baccarat',
    name: 'Baccarat',
    tagline: 'Bet on the winning hand',
    description: 'The simplest game on the floor. Place your bet on Player, Banker, or Tie — then sit back and watch the cards fall.',
    icon: '🎴',
    learnPath: '/baccarat/learn',
    playPath: '/baccarat/play',
  },
  {
    type: 'craps',
    name: 'Craps',
    tagline: 'Roll the dice',
    description: 'The most exciting game in the casino. Looks intimidating, but the core bets are simple — and some have the best odds in the house.',
    icon: '🎲',
    learnPath: '/craps/learn',
    playPath: '/craps/play',
  },
];
