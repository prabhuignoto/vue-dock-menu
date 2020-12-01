export interface SelectedItemModel {
  name: string;
  path: string;
  event: MouseEvent | KeyboardEvent;
  isParent?: boolean;
  disable?: boolean;
}