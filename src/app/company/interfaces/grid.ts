import { GridAction } from '../enums/grid-action.enum';
import { GridColumnField } from './field';

export interface GridInfo {
  title: string;
  titleFields?: Array<GridColumnField>;
}

export interface Column {
  gridColumnField: GridColumnField;
  width?: number;
  hidden?: boolean;
  hideSmall?: boolean;
  columnIsNotSortable?: boolean;
}

export interface GridRequest {
  data?: any;
  gridAction: GridAction;
  selectedData?: any;
  crudAction?: 'edit' | 'duplicate' | 'delete' | 'cancel';
  fromShortKey?: boolean;
}
