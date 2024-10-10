import Buy from '@/pages/Buy';
import Menu from '@/pages/Menu';
import Game from '@/pages/Game';
import RubleMenu from '@/pages/RubleMenu';
import Go from '@/pages/Go';
import EnterCount from '@/pages/EnterCount';

export const routes = [
  { path: '/', Component: Buy },
  { path: '/menu', Component: Menu },
  { path: '/game', Component: Game },
  { path: '/ruble', Component: RubleMenu },
  { path: '/go', Component: Go},
  { path: '/enterCount', Component: EnterCount },
];
