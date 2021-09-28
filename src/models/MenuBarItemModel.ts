import { MenuItemModel } from './MenuItemModel';

export interface MenuBarItemModel {
  name: string;
  id?: string;
  title: string;
  onSelect?: (id: string) => void;
  menu?: MenuItemModel[];
  showMenu?:  boolean;
}