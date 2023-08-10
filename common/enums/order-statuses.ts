export enum OrderStatuses {
  PAID = 'paid',
  UNPAID = 'unpaid',
  CLOSED = 'closed',
  CANCELED = 'canceled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CREATED = 'created',
}

export enum OrderStatusesTabs {
  CREATED = 'created',
  CLOSED = 'closed',
  CANCELED = 'canceled',
}

export enum OrderFinished {
  SERVICE_DONE = 'service_done',
  REFUSED = 'refused',
  ELSE = 'else',
}

export enum OrderStatusesFilter {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  CLOSING = 'closing',
}
