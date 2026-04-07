import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
      <p className="text-cream/70 text-lg mb-6">
        This table doesn't exist. Let's get you back to the lobby.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-gold text-felt-dark font-semibold rounded-lg hover:bg-gold-light transition-colors min-h-11"
      >
        Back to Lobby
      </Link>
    </div>
  );
}
