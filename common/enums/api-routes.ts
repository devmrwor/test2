export enum Routes {
  AUTH = 'auth',
  ROOT = '/',
  ADMIN = 'admin',
  FORBIDDEN = '403',
  CATEGORIES = 'categories',
  UPDATE_USER_INFO = 'me',
  PROFILE = 'profile',
  PROFILES = 'profiles',
  ORDERS = 'orders',
  FEEDBACKS = 'feedbacks',
  NOTIFICATIONS = 'notifications',
  USERS = 'users',
  REPORTS = 'reports',
  TAGS = 'tags',
  IMPORT_EXPORT = 'import-export',
  SETTINGS = 'settings',
  EMAIL = 'email',
}

export enum AuthRoutes {
  LOGIN = 'login',
  REGISTER = 'register',
}

export enum EmailRoutes {
  VERIFIED = 'verified',
  ERROR = 'error',
  CHECK_EMAIL = 'check-email',
  RESET = 'reset',
}

export enum ApiEmailSubRoutes {
  USER = 'user',
  PROFILE_MAIN_EMAIL = 'profile-main-email',
  GENERATE_TOKEN = 'generate-token',
}

export enum CategoryRoutes {
  CREATE = 'create',
}

export enum NotificationRoutes {
  CREATE = 'create',
}

export enum UserRoutes {
  EXECUTORS = 'executors',
  CUSTOMERS = 'customers',
  ADMINS = 'administrators',
  PARTNERS = 'partners',
  CREATE = 'create',
}

export enum AdminRoutes {
  CREATE = 'create',
  UPDATE = 'update',
}

export enum UserSubRoutes {
  MAIN = 'main',
  PROFILES = 'profiles',
  RATING = 'rating',
  DETAILS = 'details',
  FEEDBACKS = 'feedbacks',
  ORDERS = 'orders',
  MESSENGERS = 'messengers',
  SETTINGS = 'settings',
}

export enum FeedbackRoutes {
  ME = 'me',
  PENDING = 'pending',
  MY = 'my',
}

export enum OrderRoutes {
  NEW = 'new',
  CUSTOMER = 'customer',
  EXECUTOR = 'executor',
}

export enum ApiRoutes {
  ROOT = 'api',
  SOCKET = 'socket',
  CATEGORIES = 'categories',
  USERS = 'users',
  AUTH = 'auth',
  PROFILES = 'profiles',
  ORDERS = 'orders',
  FEEDBACKS = 'feedbacks',
  EXPORT_DATA = 'export',
  NOTIFICATIONS = 'notifications',
  TAGS = 'categories/tags',
  PROFILES_PUBLIC = 'profiles/public',
  ID = 'id',
  CREATE_TOKEN = 'create-token',
  VERIFY_EMAIL = 'email',
  PUBLIC = 'public',
  ME = 'me',
  EMAIL = 'email',
  MY = 'my',
  CHAT = 'chat',
}

export enum ApiChatRoutes {
  MESSAGES = 'messages',
}

export enum ApiFeedbacksRoutes {
  ME = 'me',
}

export enum ApiOrdersRoutes {
  ME = 'me',
  EXECUTOR = 'me/executor',
  AGREE = 'agree',
}

export enum ApiAuthRoutes {
  LOGIN = 'login',
  REGISTER = 'register',
  RESET_PASSWORD = 'reset-password',
}

export enum ApiUsersRoutes {
  ME = 'me',
  NOTIFICATIONS = 'notifications',
  MAIN_PROFILE = 'main-profile',
}

export enum ApiProfileRoutes {
  ME = 'me',
  MAIN = 'main',
  CUSTOMER = 'customer',
  CUSTOMERS = 'customers',
  USER = 'user',
  NOTIFICATIONS = 'notifications',
  MESSENGERS = 'messengers',
  MULTIPLE = 'multiple',
  DOCUMENTS = 'documents',
  RATING = 'rating',
  COPY = 'copy',
}

export enum ClientRoutes {
  HOME = '',
  CLIENT = 'client',
  ORDER = 'client/order',
  CUSTOMER = 'customer',
  EXECUTOR = 'executor',
  REVIEWS = 'reviews',
  VERIFY_EMAIL = 'verify-email',
  LOGIN = 'login',
  ORDERS = 'orders',
  CREATE_ORDER = 'edit-order',
  CLOSE_ORDER = 'close-order',
  CHATS = 'chats',
  CHAT = 'chat',
}
