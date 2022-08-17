export interface NavItem {
    menuId: number;
    isMenuYes:boolean;
    isMasterYes:boolean;
    isChildDisplayYes:boolean;
    displayName: string;
    iconName: string;
    route?: string;
    checked: boolean;
    children?: NavItem[];
  }
