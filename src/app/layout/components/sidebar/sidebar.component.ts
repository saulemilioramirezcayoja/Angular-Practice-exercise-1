import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";

interface SectionColor {
  main: string;
  hover: string;
  active: string;
}

interface MenuRoute {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  color?: SectionColor;
  children?: {
    route: string;
    label: string;
  }[];
}

interface UserProfile {
  initials: string;
  name: string;
  role: string;
}

export const MENU_ROUTES: MenuRoute[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard'
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'users',
    children: [
      {route: '/users/list', label: 'List Users'},
      {route: '/users/profile', label: 'Profile Users'}
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'reports',
    children: [
      {route: '/reports/sales', label: 'Sales Report'},
      {route: '/reports/customers', label: 'Customer Analytics'},
      {route: '/reports/inventory', label: 'Inventory Status'},
      {route: '/reports/performance', label: 'Performance Stats'}
    ]
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isCollapsed = true;
  @Output() toggleCollapse = new EventEmitter<boolean>();
  @Input() userProfile: UserProfile = {
    initials: 'ER',
    name: 'Emilio Ramirez',
    role: 'User'
  };

  expandedMenus: { [key: string]: boolean } = {};
  menuItems: MenuRoute[] = [];

  private colorPalette: SectionColor[] = [
    {
      main: '#3b82f6',
      hover: 'rgba(59, 130, 246, 0.04)',
      active: 'rgba(59, 130, 246, 0.08)'
    },
    {
      main: '#6366f1',
      hover: 'rgba(99, 102, 241, 0.04)',
      active: 'rgba(99, 102, 241, 0.08)'
    },
    {
      main: '#059669',
      hover: 'rgba(5, 150, 105, 0.04)',
      active: 'rgba(5, 150, 105, 0.08)'
    },
    {
      main: '#ea580c',
      hover: 'rgba(234, 88, 12, 0.04)',
      active: 'rgba(234, 88, 12, 0.08)'
    }
  ];

  constructor(private router: Router) {
    this.initializeMenu();
  }

  private initializeMenu(): void {
    this.menuItems = MENU_ROUTES.map((item, index) => ({
      ...item,
      color: this.getColorForIndex(index)
    }));
  }

  private getColorForIndex(index: number): SectionColor {
    return this.colorPalette[index % this.colorPalette.length];
  }

  getSectionColor(itemId: string): SectionColor {
    const item = this.menuItems.find(i => i.id === itemId);
    return item?.color || this.colorPalette[0];
  }

  getItemStyles(itemId: string): { [key: string]: string } {
    const color = this.getSectionColor(itemId);

    if (itemId.includes('child-')) {
      return {
        '--hover-color': color.hover,
        '--active-color': color.active,
        'color': color.main,
        'transition': 'all 0.2s ease'
      };
    }

    return {
      'color': itemId === 'profile' ? '#ffffff' : color.main,
      'background-color': color.hover,
      'border-color': color.main
    };
  }

  onToggle(): void {
    this.toggleCollapse.emit(this.isCollapsed);
  }

  onToggleMenu(event: Event, menuId: string): void {
    event.preventDefault();
    if (!this.isCollapsed) {
      Object.keys(this.expandedMenus).forEach(key => {
        if (key !== menuId) {
          this.expandedMenus[key] = false;
        }
      });
      this.expandedMenus[menuId] = !this.expandedMenus[menuId];
    }
  }

  isMenuActive(menuId: string): boolean {
    const menu = this.menuItems.find(item => item.id === menuId);
    if (!menu) return false;

    if (menu.route) {
      return this.router.url === menu.route;
    }

    return menu.children?.some(child => this.router.url.includes(child.route)) || false;
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus[menuId] || false;
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}

