import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'الرئيسية',
    icon: 'home',
    link: '/dashboard'
  },
  {
    label: 'الطلبات',
    icon: 'archive',
    link: '/orders'
  },
  {
    label: 'المهام',
    icon: 'truck',
    link: '/shipments'
  },
  {
    label: 'التقارير',
    icon: 'bar-chart-2',
    link: '/reports'
  },
];
