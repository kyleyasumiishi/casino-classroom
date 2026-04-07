import { Link } from 'react-router-dom';
import type { GameConfig } from '../../types/common';

interface GameCardProps {
  config: GameConfig;
}

export function GameCard({ config }: GameCardProps) {
  return (
    <div className="bg-felt-light border border-felt-light rounded-xl p-6 flex flex-col gap-4 hover:border-gold/50 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">{config.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-cream">{config.name}</h2>
          <p className="text-cream/60 text-sm">{config.tagline}</p>
        </div>
      </div>
      <p className="text-cream/80 text-sm leading-relaxed">{config.description}</p>
      <div className="flex gap-3 mt-auto">
        <Link
          to={config.learnPath}
          className="flex-1 text-center py-3 px-4 bg-casino-blue text-cream font-semibold rounded-lg hover:bg-casino-blue/80 transition-colors min-h-11"
        >
          Learn
        </Link>
        <Link
          to={config.playPath}
          className="flex-1 text-center py-3 px-4 bg-gold text-felt-dark font-semibold rounded-lg hover:bg-gold-light transition-colors min-h-11"
        >
          Play
        </Link>
      </div>
    </div>
  );
}
