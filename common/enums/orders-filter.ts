export enum OrderFilter {
  PAID = 'paid',
  UNPAID = 'unpaid',
  CLOSED = 'closed',
  CANCELED = 'canceled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CREATED = 'created',
}

export enum OrderStatusesFilter {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  CLOSING = 'closing',
}

export enum SortOrders {
  NEW = 'new',
  OLD = 'old',
}
