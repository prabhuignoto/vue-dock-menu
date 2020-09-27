export interface MenuItemModel {
  name: string;
  id?: string;
  onSelected?: (id: string) => void;
  items?: MenuItemModel[];
  disable?: boolean;
}