export interface MenuItemModel {
  name?: string;
  id?: string;
  onSelected?: (id: string) => void;
  menu?: MenuItemModel[];
  disable?: boolean;
  highlight?: boolean;
  isDivider?: boolean;
}