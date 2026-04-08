import { useBaccarat } from '../../../hooks/useBaccarat';
import { useWallet } from '../../../store/useWallet';
import { BaccaratTable } from './BaccaratTable';
import { BetSelector } from './BetSelector';
import { ActionButton } from '../common/ActionButton';
import { OutOfChips } from '../../shared/OutOfChips';
import { MIN_BET } from '../../../types/common';

const resultLabels: Record<string, string> = {
  player: 'Player Wins!',
  banker: 'Banker Wins!',
  tie: "It's a Tie!",
};

const resultColors: Record<string, string> = {
  player: 'bg-blue-600 text-white',
  banker: 'bg-casino-red text-white',
  tie: 'bg-green-600 text-white',
};

export function BaccaratPage() {
  const game = useBaccarat();
  const balance = useWallet((s) => s.balance);

  const totalBet = game.bets.reduce((sum, b) => sum + b.amount, 0);
  const canDeal = totalBet >= MIN_BET;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Result message */}
      {game.resultMessage && game.phase === 'resolved' && (
        <button
          onClick={game.newRound}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-center shadow-lg motion-safe:animate-[slideDown_0.3s_ease-out] ${
            resultColors[game.resultMessage.result]
          }`}
        >
          <span>{resultLabels[game.resultMessage.result]}</span>
          {game.resultMessage.netAmount > 0 && (
            <span className="ml-2">
              {game.resultMessage.result === 'tie' &&
              game.bets.some((b) => b.type === 'tie')
                ? '+'
                : game.result === 'player' && game.bets.some((b) => b.type === 'player')
                  ? '+'
                  : game.result === 'banker' && game.bets.some((b) => b.type === 'banker')
                    ? '+'
                    : '-'}
              {Math.round(game.resultMessage.netAmount)}
            </span>
          )}
        </button>
      )}

      {/* Table */}
      <BaccaratTable
        playerHand={game.playerHand}
        bankerHand={game.bankerHand}
        phase={game.phase}
      />

      {/* Betting controls */}
      {game.phase === 'betting' && (
        <>
          <BetSelector
            bets={game.bets}
            onPlaceBet={game.placeBet}
            onClear={game.clearBets}
            chipAmount={balance}
            disabled={false}
          />
          <div className="flex justify-center">
            <ActionButton
              label="Deal"
              onClick={game.deal}
              disabled={!canDeal}
            />
          </div>
        </>
      )}

      {/* New round button */}
      {game.phase === 'resolved' && (
        <div className="flex justify-center">
          <ActionButton label="New Hand" onClick={game.newRound} />
        </div>
      )}

      <OutOfChips />
    </div>
  );
}
