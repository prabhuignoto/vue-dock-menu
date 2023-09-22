export interface MenuItemModel {
  name?: string;
  id?: string;
  mid?: string;
  onSelected?: (id: string) => void;
  menu?: MenuItemModel[];
  disable?: boolean;
  highlight?: boolean;
  isDivider?: boolean;
  iconSlot?: string;
}