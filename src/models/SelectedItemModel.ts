export interface SelectedItemModel {
  mid: string;
  name: string;
  path: string;
  event: MouseEvent | KeyboardEvent;
  isParent?: boolean;
  disable?: boolean;
}