import { NavItem } from '../types/navigation';

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: 'HomeIcon',
  },
  {
    id: 'nodes',
    title: 'Node List',
    path: '/nodes',
    icon: 'ServerIcon',
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: 'CogIcon',
  },
];