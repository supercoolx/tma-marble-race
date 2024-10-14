import Buy from '@/pages/Buy';
import Menu from '@/pages/Menu';
import Game from '@/pages/Game';
import RubleMenu from '@/pages/RubleMenu';
import EnterCount from '@/pages/EnterCount';
import Race from '@/pages/Race';
import Invite from '@/pages/Invite';

export const routes = [
  { path: '/buy', Component: Buy },
  { path: '/', Component: Menu },
  { path: '/game', Component: Game },
  { path: '/ruble', Component: RubleMenu },
  { path: '/enterCount', Component: EnterCount },
  { path: '/race', Component: Race},
  { path: '/friend', Component: Invite}
];
