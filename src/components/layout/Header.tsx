import { Link, useLocation } from 'react-router-dom';
import { ChipDisplay } from './ChipDisplay';

export function Header() {
  const location = useLocation();
  const isLobby = location.pathname === '/';

  return (
    <header className="bg-felt-dark border-b border-felt-light px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-gold font-bold text-xl hover:text-gold-light transition-colors"
        >
          Casino Classroom
        </Link>
        {!isLobby && (
          <Link
            to="/"
            className="text-cream/60 text-sm hover:text-cream transition-colors"
          >
            ← Lobby
          </Link>
        )}
      </div>
      <ChipDisplay />
    </header>
  );
}
