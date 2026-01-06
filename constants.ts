// ibkiondianbai/unitrade-frontend/.../constants.ts
import { Translations, Language } from './types';

export const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Others'];

export const HOT_SEARCHES = ['Calculus Textbook', 'IKEA Lamp', 'AirPods', 'Bicycle', 'Gym Weights'];

export const DICTIONARY: Record<Language, Translations> = {
  [Language.EN]: {
    nav: {
      home: 'Marketplace',
      messages: 'Messages',
      profile: 'My Profile',
      admin: 'Admin Console',
      login: 'Login',
      logout: 'Logout',
      sell: 'Sell Item',
      logoutConfirmTitle: 'Confirm Logout',
      logoutConfirmMsg: 'Are you sure you want to log out? You will need to sign in again.',
      cancel: 'Cancel',
      confirm: 'Confirm'
    },
    home: {
      searchPlaceholder: 'Search for campus treasures...',
      categories: 'Categories',
      hotSearch: 'Trending:',
      noItems: 'No items found.',
      price: 'Price',
      sortBy: 'Sort by',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortDate: 'Newest Arrivals',
      sortPopular: 'Most Popular',
      results: 'Items found',
      hideSold: 'Hide Sold Items',
      loadingMore: 'Loading more items...',
      noMoreItems: 'No more items to display',
      sold: 'SOLD',
      backToTop: 'Back to Top',
      pagination: {
        prev: 'Previous',
        next: 'Next',
        page: 'Page',
        of: 'of'
      }
    },
    product: {
      seller: 'Seller',
      credit: 'Credit Score',
      chatNow: 'Contact Seller',
      description: 'Description',
      similar: 'You might also like',
      buy: 'Buy Now',
      views: 'views',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      follow: 'Follow',
      unfollow: 'Unfollow',
      following: 'Following'
    },
    reviews: {
      title: 'Seller Reviews',
      noReviews: 'No reviews yet.',
      leaveReview: 'Rate this Transaction',
      rating: 'Rating',
      comment: 'Comment',
      submit: 'Submit Review',
      placeholder: 'How was your experience?',
      reviewed: 'You have reviewed this item.',
      average: 'Average Rating'
    },
    profile: {
      myListings: 'My Listings',
      myWishlist: 'My Wishlist',
      noWishlist: 'Your wishlist is empty.',
      history: 'Trading History',
      bought: 'Purchased',
      sold: 'Sold',
      noHistory: 'No transaction history.',
      following: 'Following',
      noFollowing: 'You are not following anyone.'
    },
    checkout: {
      title: 'Checkout',
      summary: 'Order Summary',
      address: 'Shipping Address',
      payment: 'Payment Method',
      placeOrder: 'Confirm Purchase',
      total: 'Total',
      successTitle: 'Purchase Successful!',
      successMsg: 'Thank you for your order. The seller has been notified.',
      backHome: 'Back to Home',
      viewOrder: 'View My Orders'
    },
    admin: {
      dashboard: 'Admin Dashboard',
      users: 'User Management',
      products: 'Product Management',
      ban: 'Ban User',
      unban: 'Unban',
      takedown: 'Take Down',
      restore: 'Restore',
      id: 'ID',
      user: 'User',
      product: 'Product',
      status: 'Status',
      action: 'Action',
      activeStatus: 'Active',
      bannedStatus: 'Banned',
      confirmMsg: 'Are you sure you want to proceed with this action?'
    },
    auth: {
      welcome: 'Welcome to UniTrade',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      username: 'Username',
      password: 'Password'
    }
  },
  [Language.CN]: {
    nav: {
      home: '校园市场',
      messages: '消息中心',
      profile: '个人主页',
      admin: '管理后台',
      login: '登录',
      logout: '退出',
      sell: '发布闲置',
      logoutConfirmTitle: '确认退出',
      logoutConfirmMsg: '您确定要退出登录吗？退出后需重新登录。',
      cancel: '取消',
      confirm: '确定'
    },
    home: {
      searchPlaceholder: '搜索校园好物...',
      categories: '分类',
      hotSearch: '热搜:',
      noItems: '暂无商品',
      price: '价格',
      sortBy: '排序',
      sortPriceAsc: '价格: 从低到高',
      sortPriceDesc: '价格: 从高到低',
      sortDate: '最新发布',
      sortPopular: '人气最高',
      results: '个商品',
      hideSold: '隐藏已售',
      loadingMore: '正在加载更多商品...',
      noMoreItems: '没有更多商品了',
      sold: '已售出',
      backToTop: '回到顶部',
      pagination: {
        prev: '上一页',
        next: '下一页',
        page: '第',
        of: '共'
      }
    },
    product: {
      seller: '卖家',
      credit: '信用分',
      chatNow: '联系卖家',
      description: '商品详情',
      similar: '猜你喜欢',
      buy: '立即购买',
      views: '浏览',
      addToWishlist: '加入收藏',
      removeFromWishlist: '取消收藏',
      follow: '关注',
      unfollow: '取消关注',
      following: '已关注'
    },
    reviews: {
      title: '卖家评价',
      noReviews: '暂无评价',
      leaveReview: '评价本次交易',
      rating: '评分',
      comment: '评论',
      submit: '提交评价',
      placeholder: '交易体验如何？',
      reviewed: '您已评价过此商品',
      average: '平均评分'
    },
    profile: {
      myListings: '我的发布',
      myWishlist: '我的收藏',
      noWishlist: '收藏夹为空',
      history: '交易记录',
      bought: '已购买',
      sold: '已售出',
      noHistory: '暂无交易记录',
      following: '我的关注',
      noFollowing: '暂无关注用户'
    },
    checkout: {
      title: '结账',
      summary: '订单摘要',
      address: '收货地址',
      payment: '支付方式',
      placeOrder: '确认支付',
      total: '总计',
      successTitle: '支付成功!',
      successMsg: '感谢您的购买，卖家已收到通知。',
      backHome: '返回首页',
      viewOrder: '查看订单'
    },
    admin: {
      dashboard: '管理员控制台',
      users: '用户管理',
      products: '商品管理',
      ban: '封禁用户',
      unban: '解封',
      takedown: '下架商品',
      restore: '上架',
      id: 'ID',
      user: '用户',
      product: '商品',
      status: '状态',
      action: '操作',
      activeStatus: '正常',
      bannedStatus: '已封禁',
      confirmMsg: '您确定要执行此操作吗？'
    },
    auth: {
      welcome: '欢迎来到 UniTrade',
      loginBtn: '登录',
      registerBtn: '注册',
      username: '用户名',
      password: '密码'
    }
  }
};