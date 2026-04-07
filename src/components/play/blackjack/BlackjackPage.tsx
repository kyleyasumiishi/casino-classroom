import { useBlackjack } from '../../../hooks/useBlackjack';
import { useWallet } from '../../../store/useWallet';
import { BlackjackTable } from './BlackjackTable';
import { BettingControls } from '../common/BettingControls';
import { ActionButton } from '../common/ActionButton';
import { GameMessage } from '../common/GameMessage';

export function BlackjackPage() {
  const game = useBlackjack();
  const balance = useWallet((s) => s.balance);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Result message */}
      {game.resultMessage && game.phase === 'resolved' && (
        <GameMessage
          result={game.resultMessage.result}
          amount={game.resultMessage.amount}
          onDismiss={game.newRound}
        />
      )}

      {/* Table */}
      <BlackjackTable
        dealerHand={game.dealerHand}
        playerHands={game.playerHands}
        activeHandIndex={game.activeHandIndex}
        phase={game.phase}
      />

      {/* Controls */}
      {game.phase === 'betting' && (
        <BettingControls
          onPlaceBet={game.placeBet}
          onClear={() => game.placeBet(0)}
          onAction={game.deal}
          currentBet={game.currentBet}
          balance={balance}
          actionLabel="Deal"
          disabled={false}
        />
      )}

      {game.phase === 'playerTurn' && (
        <div className="flex justify-center gap-3 flex-wrap">
          <ActionButton
            label="Hit"
            onClick={game.hit}
            disabled={!game.availableActions.includes('hit')}
          />
          <ActionButton
            label="Stand"
            onClick={game.stand}
            variant="secondary"
            disabled={!game.availableActions.includes('stand')}
          />
          <ActionButton
            label="Double"
            onClick={game.double}
            variant="secondary"
            disabled={!game.availableActions.includes('double')}
          />
          <ActionButton
            label="Split"
            onClick={game.split}
            variant="secondary"
            disabled={!game.availableActions.includes('split')}
          />
        </div>
      )}

      {game.phase === 'resolved' && (
        <div className="flex justify-center">
          <ActionButton label="New Hand" onClick={game.newRound} />
        </div>
      )}
    </div>
  );
}
