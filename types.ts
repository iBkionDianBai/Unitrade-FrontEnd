export enum Language {
  EN = 'EN',
  CN = 'CN'
}

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  avatar: string; // URL
  role: UserRole;
  creditScore: number;
  bio: string;
  isBanned: boolean;
  joinDate: string;
  wishlist: string[]; // List of Product IDs
  following: string[]; // List of User IDs
  walletBalance: number;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  status: 'ACTIVE' | 'SOLD' | 'RECEIVED' | 'BANNED';
  viewCount: number;
  createdAt: string;
  tags: string[];
  buyerId?: string;
}

export interface Review {
  id: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  productId: string;
  rating: number; // 1-5
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'CHAT' | 'SYSTEM';
}

export interface ChatSession {
  withUserId: string; // The other person in the chat
  lastMessage: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// i18n Dictionary Interface
export interface Translations {
  common: {
    cancel: string;
    confirm: string;
    loading: string;
    id: string;
    status: string;
    action: string;
    backToTop: string;
  };
  nav: {
    home: string;
    messages: string;
    profile: string;
    admin: string;
    login: string;
    logout: string;
    sell: string;
    logoutConfirmTitle: string; // +
    logoutConfirmMsg: string;   // +
    cancel: string;             // +
    confirm: string;
    return: string;
  };
  home: {
    searchPlaceholder: string;
    categories: string;
    hotSearch: string;
    noItems: string;
    price: string;
    sortBy: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortDate: string;
    sortPopular: string;
    results: string;
    hideSold: string;
    loadingMore: string;
    noMoreItems: string;
    sold: string;
    pagination: {
      prev: string;
      next: string;
      page: string;
      of: string;
    };

  };
  product: {
    seller: string;
    credit: string;
    chatNow: string;
    description: string;
    similar: string;
    buy: string;
    views: string;
    addToWishlist: string;
    removeFromWishlist: string;
    follow: string;
    unfollow: string;
    following: string;
  };
  reviews: {
    title: string;
    noReviews: string;
    leaveReview: string;
    rating: string;
    comment: string;
    submit: string;
    placeholder: string;
    reviewed: string;
    average: string;
  };
  profile: {
    myListings: string;
    myWishlist: string;
    noWishlist: string;
    history: string;
    bought: string;
    sold: string;
    noHistory: string;
    following: string;
    noFollowing: string;
    editBio: string;  // 新增
    saveBio: string;  // 新增
    bioPlaceholder: string; // 新增
  };
  checkout: {
    title: string;
    summary: string;
    address: string;
    payment: string;
    placeOrder: string;
    total: string;
    successTitle: string;
    successMsg: string;
    backHome: string;
    viewOrder: string;
  };
  admin: {
    dashboard: string;
    users: string;
    products: string;
    ban: string;
    unban: string;
    takedown: string;
    restore: string;
    active: string;
    banned: string;
    confirmAction: string; // "Are you sure?"
    id: string;                 // +
    user: string;               // +
    product: string;            // +
    status: string;             // +
    action: string;             // +
    activeStatus: string;       // +
    bannedStatus: string;       // +
    confirmMsg: string;         // +
    wallet: string;          // 新增：钱包文字
    withdraw: string;        // 新增：提现文字
    withdrawSuccess: string; // 新增：提现成功提示
    confirmReceived: string; // 新增：确认收货文字
    systemAdmin: string; // 新增：系统管理员名称
    takedownReason: string; // 新增：下架原因
    takedownReasonPlaceholder: string; // 新增：下架原因占位符
    takedownReasonRequired: string; // 新增：下架原因必填提示
    confirmBanUser: string; // 新增：确认封禁用户
    confirmUnbanUser: string; // 新增：确认解封用户
    confirmTakedownProduct: string; // 新增：确认下架商品
    confirmRestoreProduct: string; // 新增：确认恢复商品
    userWillLoseAccess: string; // 新增：用户将失去访问权限
    cancel: string; // 新增：取消
    // 分页和筛选相关
    searchUsers: string;
    searchProducts: string;
    filter: string;
    perPage: string;
    allStatus: string;
    allRoles: string;
    allCategories: string;
    roleStudent: string;
    roleAdmin: string;
    statusActive: string;
    statusSold: string;
    statusReceived: string;
    clearFilters: string;
    totalRecords: string;
    showing: string;
    to: string;
    of: string;
    records: string;
    prevPage: string;
    nextPage: string;
  };
  auth: {
    welcome: string;
    loginBtn: string;
    registerBtn: string;
    username: string;
    password: string;
    usernamePlaceholderLogin: string;
    usernamePlaceholderRegister: string;
    passwordPlaceholderLogin: string;
    passwordPlaceholderRegister: string;
    signingIn: string;
    creatingAccount: string;
    needAccount: string;
    haveAccount: string;
    errorOccurred: string;
  };
}