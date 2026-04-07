import type { LessonData } from '../../types/lesson';

export const crapsLesson: LessonData = {
  gameType: 'craps',
  title: 'Craps: The Complete Guide',
  sections: [
    {
      id: 'craps-basics',
      title: 'The Basics',
      content: [
        {
          type: 'text',
          body: 'Craps is the loudest, most exciting game on the casino floor. You know the craps table before you see it — you hear it. People cheering, groaning, high-fiving strangers. It looks intimidating from the outside with its giant felt layout covered in numbers and bet areas, but once you understand the core concept, the rest clicks into place.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Core Concept'
        },
        {
          type: 'text',
          body: 'At its heart, craps is a dice game. One player (the "shooter") rolls two dice, and everyone at the table bets on the outcome. Unlike blackjack where you\'re playing your own hand, craps is a communal game — most of the table is betting together, cheering for the same numbers. That\'s where the energy comes from.'
        },
        {
          type: 'text',
          body: 'The game has two main phases: the "come-out roll" (the opening roll) and the "point phase" (what happens after a point number is set). Don\'t worry — we\'ll break down each phase in detail. For now, just know that the dice keep rolling until a specific outcome resolves the round.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Table'
        },
        {
          type: 'text',
          body: 'A craps table looks like organized chaos, but it\'s really just a bunch of different bet areas arranged on the felt. There are two identical halves (so players on both sides can reach), a center section for the risky bets, and a crew of dealers managing it all. You don\'t need to know every zone right now — we\'ll build up to the full table over the next sections.'
        },
        {
          type: 'tip',
          body: 'You don\'t have to be the shooter. Anyone at the table can bet, and most bets don\'t depend on who\'s throwing the dice. When it\'s your turn to shoot, you can pass it to the next player if you\'re not comfortable. No judgment.'
        },
        {
          type: 'example',
          scenario: 'You walk up to a craps table for the first time.',
          action: 'You put a $10 chip on the "Pass Line" — the most fundamental bet in craps. The shooter picks up the dice and rolls.',
          result: 'The dice show a 7. The whole table erupts. Your $10 Pass Line bet wins $10, and you haven\'t even learned most of the rules yet. That\'s the beauty of the Pass Line — it\'s the simplest entry point into the game.'
        }
      ]
    },
    {
      id: 'craps-come-out',
      title: 'The Come-Out Roll',
      content: [
        {
          type: 'text',
          body: 'Every craps round begins with the come-out roll. This is the shooter\'s first roll (or first roll after the previous round ended). Before this roll, you place your most basic bet: the Pass Line. Think of the Pass Line as betting "with" the shooter — you\'re rooting for them to roll good numbers.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'What Can Happen'
        },
        {
          type: 'text',
          body: 'Three things can happen on a come-out roll, depending on the total of the two dice. Roll a 7 or 11: that\'s a "natural" — Pass Line bets win immediately. Roll a 2, 3, or 12: that\'s "craps" — Pass Line bets lose immediately. Roll anything else (4, 5, 6, 8, 9, or 10): that number becomes "the point," and the game enters the point phase.'
        },
        {
          type: 'tip',
          body: 'Here\'s a helpful way to remember: on the come-out roll, 7 is your best friend if you bet the Pass Line. Later, during the point phase, 7 becomes your enemy. This flip is the heartbeat of craps.'
        },
        {
          type: 'example',
          scenario: 'You have $10 on the Pass Line. The shooter rolls for the first time.',
          action: 'The dice show 4 + 2 = 6.',
          result: 'The dealer places a white puck on the number 6, flipped to "ON." The point is now 6. Your Pass Line bet is still alive — you need the shooter to roll another 6 before rolling a 7.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Don\'t Pass Line'
        },
        {
          type: 'text',
          body: 'The Don\'t Pass Line is the opposite of the Pass Line — you\'re betting against the shooter. On the come-out, 2 or 3 wins for you, 7 or 11 loses, and 12 is a push (your bet is returned, neither win nor loss). During the point phase, you win if a 7 comes before the point number. The house edge on Don\'t Pass is actually slightly better than Pass (1.36% vs 1.41%), but be warned: you\'re betting against the table, and that can make you unpopular with the crowd.'
        },
        {
          type: 'warning',
          body: 'There\'s nothing wrong with betting Don\'t Pass — the math is actually slightly better for you. But you\'ll be winning when everyone else is losing. Some players find this uncomfortable at a hot table. It\'s your call — the math doesn\'t care about social dynamics.'
        }
      ]
    },
    {
      id: 'craps-point-phase',
      title: 'The Point Phase',
      content: [
        {
          type: 'text',
          body: 'Once a point is established (the shooter rolled a 4, 5, 6, 8, 9, or 10 on the come-out), the game enters the point phase. The goal is simple now: the shooter keeps rolling until they hit the point number again (Pass Line wins) or roll a 7 (Pass Line loses, called a "seven-out"). Everything else? Doesn\'t affect the Pass Line bet — the shooter just keeps rolling.'
        },
        {
          type: 'example',
          scenario: 'The point is 8. You have $10 on the Pass Line. The shooter rolls...',
          action: 'Roll 1: 5 (nothing happens). Roll 2: 11 (still nothing for the Pass Line). Roll 3: 3 (nope). Roll 4: 8!',
          result: 'The point was hit! Your $10 Pass Line bet pays $10. The puck flips to "OFF," and a new come-out roll begins.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Odds Bets — The Best Bet in the Casino'
        },
        {
          type: 'text',
          body: 'Here\'s where craps gets genuinely exciting from a math perspective. Once a point is established, you can place an additional bet behind your Pass Line bet called an "odds bet." This is the single best bet in the entire casino — it pays true odds with zero house edge. The casino makes no money on this bet. Zero percent.'
        },
        {
          type: 'text',
          body: 'Odds bets pay differently depending on the point number because some numbers are harder to roll than others. The 6 and 8 each have five ways to be rolled (and six ways to roll a 7), so odds on 6 or 8 pay 6:5. The 5 and 9 have four ways each, so odds pay 3:2. The 4 and 10 have only three ways each, so odds pay 2:1.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Odds on 4 or 10', pays: '2:1', houseEdge: '0%', notes: '3 ways to roll vs 6 ways to roll 7' },
            { bet: 'Odds on 5 or 9', pays: '3:2', houseEdge: '0%', notes: '4 ways to roll vs 6 ways to roll 7' },
            { bet: 'Odds on 6 or 8', pays: '6:5', houseEdge: '0%', notes: '5 ways to roll vs 6 ways to roll 7' }
          ]
        },
        {
          type: 'tip',
          body: 'Most casinos limit odds bets to 3x, 4x, or 5x your Pass Line bet (called "3-4-5x odds"). Always take the maximum odds you\'re comfortable with — since the house edge is literally zero, this is the only bet in the casino where betting more doesn\'t cost you anything extra in expected losses.'
        },
        {
          type: 'warning',
          body: 'You can\'t place an odds bet on its own — it must be backed by a Pass Line (or Come) bet. The casino requires the flat bet with its built-in house edge before letting you access the free odds.'
        }
      ]
    },
    {
      id: 'craps-come-dont-come',
      title: 'Come & Don\'t Come',
      content: [
        {
          type: 'text',
          body: 'Come and Don\'t Come bets are identical to Pass and Don\'t Pass — but you can place them at any time during the point phase. Think of it this way: a Come bet creates a brand new "mini game" that follows the exact same rules as the Pass Line, starting from scratch with the next roll as its own come-out roll.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'How Come Bets Work'
        },
        {
          type: 'text',
          body: 'You place a Come bet during the point phase. The very next roll acts as a come-out roll for your Come bet: 7 or 11 wins, 2/3/12 loses, and any point number (4/5/6/8/9/10) means your bet "travels" to that number. Once your Come bet is on a number, you win if that number is rolled before a 7, and you lose on a 7 — just like the Pass Line in the point phase.'
        },
        {
          type: 'text',
          body: 'You can also back your Come bet with odds once it travels to a number, just like Pass Line odds. Same 0% house edge, same true-odds payouts.'
        },
        {
          type: 'example',
          scenario: 'The point is 9. You have $10 on the Pass Line and place a $10 Come bet.',
          action: 'The shooter rolls a 6. Your Come bet travels to 6. Now you have two numbers working: 9 (Pass Line) and 6 (Come bet).',
          result: 'The shooter rolls a 6. Your Come bet wins $10! Your Pass Line bet on 9 is still alive. You can place another Come bet to have even more numbers working.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Don\'t Come'
        },
        {
          type: 'text',
          body: 'Don\'t Come is to Come what Don\'t Pass is to Pass — you\'re betting against the number. After it travels, you win on a 7 and lose if the number hits. Same house edge as Don\'t Pass (1.36%). Same "betting against the table" social dynamic.'
        },
        {
          type: 'tip',
          body: 'Experienced craps players often use Come bets to "spread" across multiple numbers. With a Pass Line bet and two Come bets, you might have three different numbers working at once — any of them hitting pays you. It\'s more action, same low house edge on each bet.'
        },
        {
          type: 'warning',
          body: 'Here\'s the tricky part: if a 7 rolls while you have Come bets on numbers, ALL of them lose. Spreading across multiple numbers gives you more chances to win on any given roll, but a 7 wipes everything out at once.'
        }
      ]
    },
    {
      id: 'craps-place-bets',
      title: 'Place Bets',
      content: [
        {
          type: 'text',
          body: 'Place bets are the simpler cousin of Come bets. Instead of waiting for your bet to "travel" to a number, you just pick a number and put your chips on it directly. You\'re betting that number will be rolled before a 7. No come-out roll, no two-step process — just pick and bet.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Place Bet Payouts'
        },
        {
          type: 'text',
          body: 'The trade-off for this convenience is slightly worse odds compared to Come bets with odds. Place bets don\'t pay true odds — the payouts are rounded down, which is where the house gets its edge. But on the 6 and 8, the difference is tiny.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Place 6 or 8', pays: '7:6', houseEdge: '1.52%', notes: 'Best Place bets — nearly as good as Pass Line' },
            { bet: 'Place 5 or 9', pays: '7:5', houseEdge: '4.00%', notes: 'Acceptable, but noticeably worse' },
            { bet: 'Place 4 or 10', pays: '9:5', houseEdge: '6.67%', notes: 'High house edge — consider Buy bets instead' }
          ]
        },
        {
          type: 'tip',
          body: 'Place 6 and Place 8 are the sweet spot. At 1.52% house edge, they\'re almost as good as the Pass Line (1.41%), and you skip the come-out roll entirely — your bet is immediately working on the number you want. Bet in multiples of $6 so the 7:6 payout comes out even.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Buy Bets'
        },
        {
          type: 'text',
          body: 'Buy bets work the same as Place bets, but instead of accepting rounded-down payouts, you pay a 5% commission upfront to get true odds. This is only worth it on the 4 and 10, where the Buy bet (4.76% house edge with commission) beats the Place bet (6.67%). On 5, 6, 8, and 9, Place bets are better.'
        },
        {
          type: 'example',
          scenario: 'You want to bet on the 8 being rolled before a 7.',
          action: 'You place $12 on the Place 8. The shooter rolls an 8.',
          result: 'Place 8 pays 7:6, so your $12 bet wins $14. Your bet stays up (Place bets are "standing" bets — they stay active until you take them down or a 7 rolls).'
        },
        {
          type: 'warning',
          body: 'Place bets on 4 and 10 have a steep 6.67% house edge. If you really want these numbers, use Buy bets instead or — better yet — use Come bets with odds to get them at 0% house edge on the odds portion.'
        }
      ]
    },
    {
      id: 'craps-field-big',
      title: 'Field, Big 6 & Big 8',
      content: [
        {
          type: 'text',
          body: 'These bets occupy some of the most prominent real estate on the craps table. They\'re easy to find, easy to understand, and designed to attract beginners. Unfortunately, "easy to find" and "good bet" aren\'t the same thing.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Field Bet'
        },
        {
          type: 'text',
          body: 'The Field is a one-roll bet — it wins or loses on the very next roll. If the dice show 2, 3, 4, 9, 10, 11, or 12, you win. If they show 5, 6, 7, or 8, you lose. Sounds like you\'re covering a lot of numbers, right? You are — but the numbers you\'re NOT covering (5, 6, 7, 8) are the most frequently rolled numbers.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Field (3, 4, 9, 10, 11)', pays: '1:1', houseEdge: '5.56%', notes: 'Even money on most Field numbers' },
            { bet: 'Field (2)', pays: '2:1', houseEdge: '5.56%', notes: 'Double payout on snake eyes' },
            { bet: 'Field (12)', pays: '2:1', houseEdge: '5.56%', notes: 'Double payout on boxcars' }
          ]
        },
        {
          type: 'example',
          scenario: 'You put $10 on the Field. The shooter rolls.',
          action: 'The dice show a 12 (boxcars).',
          result: 'The Field pays 2:1 on 12, so you win $20 plus your $10 back. Nice hit — but the 5.56% house edge means the math is against you long-term.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Big 6 and Big 8'
        },
        {
          type: 'text',
          body: 'Big 6 and Big 8 are standing bets that the 6 (or 8) will be rolled before a 7. They pay even money (1:1). Sounds reasonable until you realize that Place 6 and Place 8 bet on the exact same thing but pay 7:6 instead. Big 6/8 has a 9.09% house edge compared to 1.52% for Place 6/8.'
        },
        {
          type: 'warning',
          body: 'Big 6 and Big 8 are objectively the worst versions of bets you can make elsewhere on the table for far better odds. They exist because they\'re in an easy-to-reach spot and pay simple even money, which attracts beginners. Always use Place 6/8 instead — same bet, vastly better payout.'
        },
        {
          type: 'tip',
          body: 'A good rule of thumb: if a bet is easy to reach and easy to understand on the craps table, it probably has a high house edge. The casino designs the layout to put the worst bets in the most convenient locations.'
        }
      ]
    },
    {
      id: 'craps-props-hardways',
      title: 'Proposition & Hardway Bets',
      content: [
        {
          type: 'text',
          body: 'The center of the craps table is a danger zone for your bankroll. This is where the proposition bets and hardway bets live — flashy, exciting, high-payout bets that the casino absolutely loves because the house edge is enormous. You need to know what they are so you recognize them at the table, but you also need to know why to avoid them.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Hardway Bets'
        },
        {
          type: 'text',
          body: 'A "hard" number means both dice show the same value: hard 4 is 2+2, hard 6 is 3+3, hard 8 is 4+4, hard 10 is 5+5. A hardway bet wins if the number is rolled the "hard" way before it\'s rolled the "easy" way (any other combination) or before a 7. For example, hard 6 wins on 3+3 but loses on 4+2, 5+1, or any 7.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Hard 4 or Hard 10', pays: '7:1', houseEdge: '11.11%', notes: 'Only 1 way to win vs 9 ways to lose' },
            { bet: 'Hard 6 or Hard 8', pays: '9:1', houseEdge: '9.09%', notes: '1 way to win vs 10 ways to lose' }
          ]
        },
        {
          type: 'heading',
          level: 3,
          text: 'Proposition Bets (One-Roll Bets)'
        },
        {
          type: 'text',
          body: 'Proposition bets are one-roll bets on a specific outcome. They\'re resolved on the very next throw of the dice — win or lose, it\'s over in one roll. The payouts look great on paper but the odds are terrible.'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Any Seven', pays: '4:1', houseEdge: '16.67%', notes: 'The worst bet on the table' },
            { bet: 'Any Craps (2, 3, or 12)', pays: '7:1', houseEdge: '11.11%', notes: 'Bet that the next roll is craps' },
            { bet: 'Eleven (Yo)', pays: '15:1', houseEdge: '11.11%', notes: 'Specific roll of 11 — called "Yo" to avoid confusion with 7' },
            { bet: 'Ace-Deuce (3)', pays: '15:1', houseEdge: '11.11%', notes: 'Specific roll of 3' },
            { bet: 'Aces (2, snake eyes)', pays: '30:1', houseEdge: '13.89%', notes: 'Only 1 way to roll a 2 out of 36 combinations' },
            { bet: 'Boxcars (12)', pays: '30:1', houseEdge: '13.89%', notes: 'Only 1 way to roll a 12 out of 36 combinations' },
            { bet: 'Horn', pays: 'Varies', houseEdge: '12.50%', notes: 'Combination bet on 2, 3, 11, and 12' }
          ]
        },
        {
          type: 'example',
          scenario: 'The stickman calls out "Bet the hard 8!" You throw $5 on Hard 8.',
          action: 'Three rolls go by: 5+3 (nothing), 2+4 (nothing), 6+2 = easy 8.',
          result: 'Your hard 8 bet loses — the 8 was rolled the easy way (6+2, not 4+4). You needed exactly 4+4 to win. That\'s the fundamental problem with hardways: there\'s only one way to win and many ways to lose.'
        },
        {
          type: 'warning',
          body: 'Any Seven has a 16.67% house edge — for every $100 you bet on it over time, you\'ll lose about $16.67. Compare that to the Pass Line at $1.41. The stickman will call out these bets enthusiastically because the casino makes a fortune on them. Enjoy the theater, but keep your chips on the Pass Line.'
        },
        {
          type: 'tip',
          body: 'You\'ll hear the stickman say things like "Bet the hard 6!" or "Yo eleven, who wants it?" between every roll. This is their job — they\'re salespeople for the center bets. It\'s fun and it\'s part of the craps experience, but don\'t let the hype pull you into bad bets.'
        }
      ]
    },
    {
      id: 'craps-smart-guide',
      title: 'The Smart Player\'s Guide',
      content: [
        {
          type: 'text',
          body: 'Now that you know every bet on the table, let\'s put it all together. The craps table has over 25 different bets available at any time, but a smart player only needs three or four of them. Here\'s the complete house edge ranking so you can see exactly where every bet stands.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'All Bets Ranked by House Edge'
        },
        {
          type: 'payoutTable',
          rows: [
            { bet: 'Pass/Come Odds', pays: 'True odds', houseEdge: '0%', notes: '⭐ The best bet in any casino' },
            { bet: 'Don\'t Pass/Don\'t Come Odds', pays: 'True odds', houseEdge: '0%', notes: '⭐ Equally good' },
            { bet: 'Don\'t Pass / Don\'t Come', pays: '1:1', houseEdge: '1.36%', notes: '⭐ Excellent' },
            { bet: 'Pass Line / Come', pays: '1:1', houseEdge: '1.41%', notes: '⭐ Excellent' },
            { bet: 'Place 6 or 8', pays: '7:6', houseEdge: '1.52%', notes: '⭐ Nearly as good as Pass Line' },
            { bet: 'Place 5 or 9', pays: '7:5', houseEdge: '4.00%', notes: 'Acceptable' },
            { bet: 'Field', pays: '1:1 / 2:1', houseEdge: '5.56%', notes: 'Getting expensive' },
            { bet: 'Place 4 or 10', pays: '9:5', houseEdge: '6.67%', notes: 'Use Buy bets instead' },
            { bet: 'Big 6 / Big 8', pays: '1:1', houseEdge: '9.09%', notes: '❌ Use Place 6/8 instead' },
            { bet: 'Hard 6 / Hard 8', pays: '9:1', houseEdge: '9.09%', notes: '❌ Entertainment only' },
            { bet: 'Hard 4 / Hard 10', pays: '7:1', houseEdge: '11.11%', notes: '❌ Avoid' },
            { bet: 'Any Craps', pays: '7:1', houseEdge: '11.11%', notes: '❌ Avoid' },
            { bet: 'Yo (11) / Ace-Deuce (3)', pays: '15:1', houseEdge: '11.11%', notes: '❌ Avoid' },
            { bet: 'Horn', pays: 'Varies', houseEdge: '12.50%', notes: '❌ Avoid' },
            { bet: 'Aces / Boxcars', pays: '30:1', houseEdge: '13.89%', notes: '❌ Avoid' },
            { bet: 'Any Seven', pays: '4:1', houseEdge: '16.67%', notes: '❌ The worst bet on the table' }
          ]
        },
        {
          type: 'heading',
          level: 3,
          text: 'The Beginner Strategy'
        },
        {
          type: 'text',
          body: 'Start with just the Pass Line plus maximum odds. That\'s it. This is the single best combination on the table and it\'s the simplest. Once you\'re comfortable, add one or two Come bets with odds to spread across multiple numbers. If you want even more action, Place the 6 and 8. This gives you five numbers working (your Pass Line point, two Come numbers, Place 6, and Place 8) — all with house edges under 1.6%.'
        },
        {
          type: 'example',
          scenario: 'You sit down at a craps table with $200. The minimum bet is $10.',
          action: 'You put $10 on the Pass Line. The point is set at 8. You back it with $20 in odds (2x). You place a $10 Come bet. It travels to 5. You back it with $20 in odds. You\'re now covering the 8 and the 5.',
          result: 'The shooter rolls a 5. Your Come bet wins $10 (flat) plus $30 (3:2 odds on 5). Your Pass Line bet on 8 is still working. You\'re playing smart and profitably.'
        },
        {
          type: 'heading',
          level: 3,
          text: 'Bankroll Management'
        },
        {
          type: 'text',
          body: 'Craps is a high-variance game — you can have big swings in either direction. Bring at least 30-40 times your base bet. If you\'re betting $10 on the Pass Line plus $20 in odds, you\'re risking $30 per shooter, so bring at least $400-$500. Set a stop-loss (the most you\'re willing to lose) and a win goal (the amount that would make you happy to walk away). Stick to both.'
        },
        {
          type: 'tip',
          body: 'The best craps strategy is simple: Pass Line + maximum odds, maybe a Come bet or two, and Place 6/8 for extra action. Everything else on the table is the casino\'s profit center. You now know more about craps odds than 90% of the people at the table — use that knowledge.'
        },
        {
          type: 'warning',
          body: 'Never increase your bets to chase losses. The dice don\'t know you\'re losing, and doubling up after a bad streak just means bigger losses when the streak continues. Flat betting with maximum odds is the mathematically optimal approach.'
        }
      ]
    }
  ],
  cheatSheet: [
    { label: 'Come-out 7 or 11', value: 'Pass Line wins immediately ("natural")' },
    { label: 'Come-out 2, 3, 12', value: 'Pass Line loses immediately ("craps")' },
    { label: 'The point', value: 'Any other come-out roll (4,5,6,8,9,10) sets the point' },
    { label: 'Odds bets', value: '0% house edge — the best bet in any casino' },
    { label: 'Best bets', value: 'Pass/Come + odds, Place 6 and 8' },
    { label: 'Worst bet', value: 'Any Seven — 16.67% house edge' },
    { label: 'Seven-out', value: 'Rolling 7 during point phase loses all Pass/Come/Place bets' },
    { label: 'Don\'t Pass bar 12', value: 'Come-out 12 is a push on Don\'t Pass, not a win' }
  ]
};
