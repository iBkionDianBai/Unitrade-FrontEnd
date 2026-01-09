// ibkiondianbai/unitrade-frontend/.../constants.ts
import { Translations, Language } from './types';

export const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Others'];
export const HOT_SEARCHES = ['Calculus Textbook', 'IKEA Lamp', 'AirPods', 'Bicycle', 'Gym Weights'];

export const DICTIONARY: Record<Language, Translations> = {
  [Language.EN]: {
    common: {
      cancel: 'Cancel', confirm: 'Confirm', loading: 'Loading...', id: 'ID', status: 'Status', action: 'Action', backToTop: 'Back to Top'
    },
    nav: {
      home: 'Marketplace', messages: 'Messages', profile: 'My Profile', admin: 'Admin Console',
      login: 'Login', logout: 'Logout', sell: 'Sell Item', return: 'Back',
      logoutConfirmTitle: 'Confirm Logout', logoutConfirmMsg: 'Are you sure?', cancel: 'Cancel', confirm: 'Confirm'
    },
    home: {
      searchPlaceholder: 'Search...', categories: 'Categories', hotSearch: 'Trending:', noItems: 'No items found.',
      price: 'Price', sortBy: 'Sort by', sortPriceAsc: 'Price: Low to High', sortPriceDesc: 'Price: High to Low',
      sortDate: 'Newest', sortPopular: 'Popular', results: 'Items found', hideSold: 'Hide Sold',
      loadingMore: 'Loading...', noMoreItems: 'End of list', sold: 'SOLD',
      pagination: { prev: 'Prev', next: 'Next', page: 'Page', of: 'of' }
    },
    product: {
      seller: 'Seller', credit: 'Credit', chatNow: 'Contact Seller', description: 'Description',
      similar: 'Similar Items', buy: 'Buy Now', views: 'views', addToWishlist: 'Save',
      removeFromWishlist: 'Unsave', follow: 'Follow', unfollow: 'Unfollow', following: 'Following'
    },
    reviews: {
      title: 'Reviews', noReviews: 'No reviews.', leaveReview: 'Rate', rating: 'Rating',
      comment: 'Comment', submit: 'Submit', placeholder: 'Share experience...',
      reviewed: 'Already reviewed.', average: 'Avg Rating'
    },
    profile: {
      myListings: 'My Listings', myWishlist: 'My Wishlist', noWishlist: 'Empty.',
      history: 'History', bought: 'Bought', sold: 'Sold', noHistory: 'No history.',
      following: 'Following', noFollowing: 'No one followed.',editBio: 'Edit Bio',
      saveBio: 'Save Bio',
      bioPlaceholder: 'Write something about yourself...',
    },
    checkout: {
      title: 'Checkout', summary: 'Summary', address: 'Address', payment: 'Payment',
      placeOrder: 'Pay Now', total: 'Total', successTitle: 'Success!',
      successMsg: 'Order placed.', backHome: 'Home', viewOrder: 'My Orders'
    },
    admin: {
      dashboard: 'Admin', users: 'Users', products: 'Products', ban: 'Ban', unban: 'Unban',
      takedown: 'Remove', restore: 'Restore', active: 'Active', banned: 'Banned',
      confirmAction: 'Are you sure?', id: 'ID', user: 'User', product: 'Product',
      status: 'Status', action: 'Action', activeStatus: 'Active', bannedStatus: 'Banned',
      confirmMsg: 'Action completed successfully.',
      wallet: 'Wallet Balance',
      withdraw: 'Withdraw',
      withdrawSuccess: 'Withdrawal successful! Funds will arrive in 24h.',
      confirmReceived: 'Confirm Receipt',
      systemAdmin: 'Administrator',
      takedownReason: 'Reason for removal',
      takedownReasonPlaceholder: 'Please explain why this product is being removed...',
      takedownReasonRequired: 'Reason is required',
      confirmBanUser: 'Are you sure you want to ban user',
      confirmUnbanUser: 'Are you sure you want to unban user',
      confirmTakedownProduct: 'Are you sure you want to remove the product',
      confirmRestoreProduct: 'Are you sure you want to restore the product',
      userWillLoseAccess: 'They will lose access to the platform.',
      cancel: 'Cancel',
      // Pagination and filtering
      searchUsers: 'Search username...',
      searchProducts: 'Search product title...',
      filter: 'Filter',
      perPage: 'per page',
      allStatus: 'All Status',
      allRoles: 'All Roles',
      allCategories: 'All Categories',
      roleStudent: 'Student',
      roleAdmin: 'Admin',
      statusActive: 'Active',
      statusSold: 'Sold',
      statusReceived: 'Received',
      clearFilters: 'Clear Filters',
      totalRecords: 'Total Records',
      showing: 'Showing',
      to: 'to',
      of: 'of',
      records: 'records',
      prevPage: 'Previous',
      nextPage: 'Next'
    },
    auth: {
      welcome: 'Welcome', loginBtn: 'Sign In', registerBtn: 'Register', username: 'User', password: 'Pass',
      usernamePlaceholderLogin: 'Enter your username',
      usernamePlaceholderRegister: 'Choose a username',
      passwordPlaceholderLogin: 'Enter your password',
      passwordPlaceholderRegister: 'Choose a password',
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      needAccount: 'Need an account? Register',
      haveAccount: 'Have an account? Login',
      errorOccurred: 'An error occurred'
    }
  },
  [Language.CN]: {
    common: {
      cancel: '取消', confirm: '确定', loading: '加载中...', id: 'ID', status: '状态', action: '操作', backToTop: '回到顶部'
    },
    nav: {
      home: '校园市场', messages: '消息', profile: '个人主页', admin: '管理后台',
      login: '登录', logout: '退出', sell: '发布', return: '返回',
      logoutConfirmTitle: '确认退出', logoutConfirmMsg: '确定要退出吗？', cancel: '取消', confirm: '确定'
    },
    home: {
      searchPlaceholder: '搜索...', categories: '分类', hotSearch: '热搜:', noItems: '暂无商品',
      price: '价格', sortBy: '排序', sortPriceAsc: '价格从低到高', sortPriceDesc: '价格从高到低',
      sortDate: '最新', sortPopular: '最热', results: '个结果', hideSold: '隐藏已售',
      loadingMore: '加载中...', noMoreItems: '没有更多了', sold: '已售出',
      pagination: { prev: '上一页', next: '下一页', page: '第', of: '页，共' }
    },
    product: {
      seller: '卖家', credit: '信用', chatNow: '联系卖家', description: '详情',
      similar: '猜你喜欢', buy: '立即购买', views: '浏览', addToWishlist: '收藏',
      removeFromWishlist: '取消收藏', follow: '关注', unfollow: '取消关注', following: '已关注'
    },
    reviews: {
      title: '评价', noReviews: '暂无评价', leaveReview: '评价', rating: '评分',
      comment: '评论', submit: '提交', placeholder: '说点什么...',
      reviewed: '已评价', average: '平均分'
    },
    profile: {
      myListings: '我的发布', myWishlist: '我的收藏', noWishlist: '暂无收藏',
      history: '交易记录', bought: '已买到', sold: '已卖出', noHistory: '暂无记录',
      following: '我的关注', noFollowing: '暂无关注',editBio: '编辑简介',
      saveBio: '保存简介',
      bioPlaceholder: '介绍一下你自己吧...',
    },
    checkout: {
      title: '结账', summary: '摘要', address: '地址', payment: '支付',
      placeOrder: '确认支付', total: '总计', successTitle: '成功！',
      successMsg: '订单已生成', backHome: '首页', viewOrder: '查看订单'
    },
    admin: {
      dashboard: '管理', users: '用户', products: '商品', ban: '封禁', unban: '解封',
      takedown: '下架', restore: '上架', active: '正常', banned: '已封禁',
      confirmAction: '确定执行？', id: 'ID', user: '用户', product: '商品',
      status: '状态', action: '操作', activeStatus: '正常', bannedStatus: '已封禁',
      confirmMsg: '操作已成功执行。',
      wallet: '钱包余额',
      withdraw: '申请提现',
      withdrawSuccess: '提现申请已提交！资金将在24小时内到账。',
      confirmReceived: '确认收货',
      systemAdmin: '管理员',
      takedownReason: '下架原因',
      takedownReasonPlaceholder: '请说明下架该商品的原因...',
      takedownReasonRequired: '必须填写下架原因',
      confirmBanUser: '确定要封禁用户',
      confirmUnbanUser: '确定要解封用户',
      confirmTakedownProduct: '确定要下架商品',
      confirmRestoreProduct: '确定要恢复商品',
      userWillLoseAccess: '该用户将无法访问平台。',
      cancel: '取消',
      // 分页和筛选相关
      searchUsers: '搜索用户名...',
      searchProducts: '搜索商品标题...',
      filter: '筛选',
      perPage: '条/页',
      allStatus: '所有状态',
      allRoles: '所有角色',
      allCategories: '所有分类',
      roleStudent: '学生',
      roleAdmin: '管理员',
      statusActive: '活跃',
      statusSold: '已售出',
      statusReceived: '已收货',
      clearFilters: '清除筛选',
      totalRecords: '共',
      showing: '显示第',
      to: '到',
      of: '条，共',
      records: '条记录',
      prevPage: '上一页',
      nextPage: '下一页'
    },
    auth: {
      welcome: '欢迎', loginBtn: '登录', registerBtn: '注册', username: '用户名', password: '密码',
      usernamePlaceholderLogin: '输入用户名',
      usernamePlaceholderRegister: '选择用户名',
      passwordPlaceholderLogin: '输入密码',
      passwordPlaceholderRegister: '选择密码',
      signingIn: '登录中...',
      creatingAccount: '注册中...',
      needAccount: '没有账号？立即注册',
      haveAccount: '已有账号？立即登录',
      errorOccurred: '发生错误'
    }
  }
};