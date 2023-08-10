import { CustomerTypes } from '../enums/customer-type';
import { SortOrders } from '../enums/sort-order';

export interface ControllerOptions {
  page: number;
  limit: number;
  filter: Record<string, string | number>;
  sortField: string;
  sortOrder: SortOrders;
}

export type OrderGetControllerOptions = ControllerOptions;

export interface CustomerControllerOptions extends Omit<ControllerOptions, 'filter'> {
  customerType: CustomerTypes;
  searchText: string;
}
