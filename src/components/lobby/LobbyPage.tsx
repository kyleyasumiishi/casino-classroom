import { gameConfigs } from '../../data/gameConfigs';
import { GameCard } from './GameCard';
import { ResetButton } from '../shared/ResetButton';

export function LobbyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gold mb-2">
          Welcome to Casino Classroom
        </h1>
        <p className="text-cream/70 text-lg">
          Learn the games. Practice with fake chips. Walk in confident.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {gameConfigs.map((config) => (
          <GameCard key={config.type} config={config} />
        ))}
      </div>

      <div className="text-center">
        <ResetButton />
      </div>
    </div>
  );
}
