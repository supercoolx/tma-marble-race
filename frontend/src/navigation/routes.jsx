import Buy from '@/pages/Buy';
import GameMode from '@/pages/GameMode';
import Rumble from '@/pages/Rumble';
import RumbleMenu from '@/pages/RumbleMenu';
import EnterCount from '@/pages/EnterCount';
import Race from '@/pages/Race';
import Invite from '@/pages/Invite';
import RaceMenu from '@/pages/Racemenu';
import PickColor from '@/pages/PickColor';

export const routes = [
  { path: '/buy', Component: Buy },
  { path: '/', Component: GameMode },
  { path: '/rumble', Component: Rumble },
  { path: '/rumbleMenu', Component: RumbleMenu },
  { path: '/enterCount', Component: EnterCount },
  { path: '/race', Component: Race},
  { path: '/friend', Component: Invite},
  { path: 'raceMenu', Component: RaceMenu},
  { path: 'pickColor', Component: PickColor},
];
