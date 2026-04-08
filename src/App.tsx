import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LobbyPage } from './components/lobby/LobbyPage';
import { LearnPage } from './components/learn/LearnPage';
import { BlackjackPage } from './components/play/blackjack/BlackjackPage';
import { BaccaratPage } from './components/play/baccarat/BaccaratPage';
import { CrapsPage } from './components/play/craps/CrapsPage';
import { NotFound } from './components/shared/NotFound';

function PlaceholderPage({ game, mode }: { game: string; mode: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gold mb-2 capitalize">{game}</h1>
        <p className="text-cream/60 capitalize">{mode} Mode — Coming Soon</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <LobbyPage /> },
      { path: ':gameType/learn', element: <LearnPage /> },
      { path: 'blackjack/play', element: <BlackjackPage /> },
      { path: 'baccarat/play', element: <BaccaratPage /> },
      { path: 'craps/play', element: <CrapsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
