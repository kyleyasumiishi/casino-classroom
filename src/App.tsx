import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LobbyPage } from './components/lobby/LobbyPage';
import { LearnPage } from './components/learn/LearnPage';
import { BlackjackPage } from './components/play/blackjack/BlackjackPage';
import { BaccaratPage } from './components/play/baccarat/BaccaratPage';
import { CrapsPage } from './components/play/craps/CrapsPage';
import { NotFound } from './components/shared/NotFound';

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
