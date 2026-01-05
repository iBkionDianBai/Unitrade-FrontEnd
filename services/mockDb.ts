import { User, Product, Message, UserRole, Notification, Review } from '../types';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin1', avatar: 'https://picsum.photos/seed/a1/100/100', role: UserRole.ADMIN, creditScore: 999, bio: 'Super Admin 1', isBanned: false, joinDate: '2023-01-01', wishlist: [], following: [] },
  { id: 'u2', username: 'admin2', avatar: 'https://picsum.photos/seed/a2/100/100', role: UserRole.ADMIN, creditScore: 999, bio: 'Super Admin 2', isBanned: false, joinDate: '2023-01-02', wishlist: [], following: [] },
  { id: 'u3', username: 'admin3', avatar: 'https://picsum.photos/seed/a3/100/100', role: UserRole.ADMIN, creditScore: 999, bio: 'Super Admin 3', isBanned: false, joinDate: '2023-01-03', wishlist: [], following: [] },
  { id: 'u4', username: 'student_alice', avatar: 'https://picsum.photos/seed/alice/100/100', role: UserRole.STUDENT, creditScore: 750, bio: 'CS Major, love reading.', isBanned: false, joinDate: '2023-09-01', wishlist: [], following: [] },
  { id: 'u5', username: 'student_bob', avatar: 'https://picsum.photos/seed/bob/100/100', role: UserRole.STUDENT, creditScore: 680, bio: 'Selling my old guitar.', isBanned: false, joinDate: '2023-09-05', wishlist: [], following: [] },
  { id: 'u6', username: 'charlie_design', avatar: 'https://picsum.photos/seed/charlie/100/100', role: UserRole.STUDENT, creditScore: 820, bio: 'Graphic Design student.', isBanned: false, joinDate: '2023-09-10', wishlist: [], following: [] },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', sellerId: 'u4', title: 'Calculus Early Transcendentals', price: 45, description: 'Used for one semester. Good condition.', category: 'Books', image: 'https://picsum.photos/seed/book/400/300', status: 'SOLD', viewCount: 120, createdAt: '2023-10-10T10:00:00Z', tags: ['textbook', 'math'], buyerId: 'u5' },
  { id: 'p2', sellerId: 'u5', title: 'Acoustic Guitar Yamaha', price: 150, description: 'Great for beginners. Includes case.', category: 'Others', image: 'https://picsum.photos/seed/guitar/400/300', status: 'ACTIVE', viewCount: 340, createdAt: '2023-10-12T14:30:00Z', tags: ['music', 'instrument'] },
  { id: 'p3', sellerId: 'u4', title: 'IKEA Desk Lamp', price: 15, description: 'White desk lamp, bulb included.', category: 'Furniture', image: 'https://picsum.photos/seed/lamp/400/300', status: 'ACTIVE', viewCount: 45, createdAt: '2023-10-15T09:15:00Z', tags: ['home', 'light'] },
  { id: 'p4', sellerId: 'u5', title: 'Sony WH-1000XM4', price: 200, description: 'Noise cancelling headphones. Barely used.', category: 'Electronics', image: 'https://picsum.photos/seed/sony/400/300', status: 'SOLD', viewCount: 800, createdAt: '2023-10-01T11:20:00Z', tags: ['tech', 'audio'], buyerId: 'u4' },
  { id: 'p5', sellerId: 'u6', title: 'Logitech MX Master 3', price: 80, description: 'Best mouse for productivity.', category: 'Electronics', image: 'https://picsum.photos/seed/mouse/400/300', status: 'ACTIVE', viewCount: 210, createdAt: '2023-10-20T16:00:00Z', tags: ['tech', 'computer'] },
  { id: 'p6', sellerId: 'u6', title: 'Wacom Intuos Tablet', price: 60, description: 'Small size, perfect for digital art beginners.', category: 'Electronics', image: 'https://picsum.photos/seed/tablet/400/300', status: 'ACTIVE', viewCount: 150, createdAt: '2023-10-21T10:00:00Z', tags: ['art', 'design'] },
  { id: 'p7', sellerId: 'u4', title: 'Introduction to Algorithms', price: 55, description: 'The CLRS book. Heavy but essential.', category: 'Books', image: 'https://picsum.photos/seed/algo/400/300', status: 'ACTIVE', viewCount: 95, createdAt: '2023-10-22T08:30:00Z', tags: ['textbook', 'cs'] },
  { id: 'p8', sellerId: 'u5', title: 'Nike Running Shoes (Size 10)', price: 40, description: 'Worn twice, wrong size for me.', category: 'Clothing', image: 'https://picsum.photos/seed/shoes/400/300', status: 'ACTIVE', viewCount: 300, createdAt: '2023-10-23T12:00:00Z', tags: ['fashion', 'sports'] },
  { id: 'p9', sellerId: 'u6', title: 'Mechanical Keyboard Keychron', price: 70, description: 'Red switches, smooth typing.', category: 'Electronics', image: 'https://picsum.photos/seed/keyboard/400/300', status: 'ACTIVE', viewCount: 410, createdAt: '2023-10-24T15:45:00Z', tags: ['tech', 'gaming'] },
  { id: 'p10', sellerId: 'u4', title: 'Vintage Denim Jacket', price: 35, description: 'Cool oversized look.', category: 'Clothing', image: 'https://picsum.photos/seed/jacket/400/300', status: 'ACTIVE', viewCount: 180, createdAt: '2023-10-25T11:00:00Z', tags: ['fashion', 'vintage'] },
  { id: 'p11', sellerId: 'u5', title: 'Basketball Spalding', price: 20, description: 'Indoor/Outdoor ball.', category: 'Sports', image: 'https://picsum.photos/seed/basketball/400/300', status: 'ACTIVE', viewCount: 60, createdAt: '2023-10-26T09:30:00Z', tags: ['sports', 'fun'] },
  { id: 'p12', sellerId: 'u6', title: 'Ergonomic Office Chair', price: 120, description: 'Mesh back, very comfortable.', category: 'Furniture', image: 'https://picsum.photos/seed/chair/400/300', status: 'ACTIVE', viewCount: 250, createdAt: '2023-10-27T13:20:00Z', tags: ['home', 'desk'] },
  { id: 'p13', sellerId: 'u4', title: 'Coffee Maker', price: 25, description: 'Basic drip coffee maker.', category: 'Furniture', image: 'https://picsum.photos/seed/coffee/400/300', status: 'ACTIVE', viewCount: 90, createdAt: '2023-10-28T08:00:00Z', tags: ['home', 'kitchen'] },
  { id: 'p14', sellerId: 'u5', title: 'Tennis Racket Wilson', price: 45, description: 'Good grip, recently strung.', category: 'Sports', image: 'https://picsum.photos/seed/tennis/400/300', status: 'ACTIVE', viewCount: 110, createdAt: '2023-10-29T17:00:00Z', tags: ['sports', 'outdoor'] },
  { id: 'p15', sellerId: 'u6', title: 'iPad Air 4th Gen', price: 400, description: 'Blue, 64GB. Like new.', category: 'Electronics', image: 'https://picsum.photos/seed/ipad/400/300', status: 'ACTIVE', viewCount: 600, createdAt: '2023-10-30T10:10:00Z', tags: ['tech', 'apple'] },
  { id: 'p16', sellerId: 'u4', title: 'Physics Textbook', price: 50, description: 'Fundamentals of Physics.', category: 'Books', image: 'https://picsum.photos/seed/physics/400/300', status: 'ACTIVE', viewCount: 85, createdAt: '2023-10-31T14:00:00Z', tags: ['textbook', 'science'] },
  { id: 'p17', sellerId: 'u5', title: 'Electric Kettle', price: 10, description: 'Boils water fast.', category: 'Furniture', image: 'https://picsum.photos/seed/kettle/400/300', status: 'ACTIVE', viewCount: 55, createdAt: '2023-11-01T08:45:00Z', tags: ['home', 'kitchen'] },
  { id: 'p18', sellerId: 'u6', title: 'Yoga Mat', price: 15, description: 'Thick mat, purple.', category: 'Sports', image: 'https://picsum.photos/seed/yoga/400/300', status: 'ACTIVE', viewCount: 70, createdAt: '2023-11-02T19:00:00Z', tags: ['health', 'fitness'] },
  { id: 'p19', sellerId: 'u4', title: 'Scientific Calculator', price: 12, description: 'Casio fx-991EX.', category: 'Electronics', image: 'https://picsum.photos/seed/calc/400/300', status: 'ACTIVE', viewCount: 130, createdAt: '2023-11-03T11:30:00Z', tags: ['school', 'math'] },
  { id: 'p20', sellerId: 'u5', title: 'Portable Charger', price: 20, description: '20000mAh Anker.', category: 'Electronics', image: 'https://picsum.photos/seed/powerbank/400/300', status: 'ACTIVE', viewCount: 190, createdAt: '2023-11-04T15:15:00Z', tags: ['tech', 'mobile'] },
  { id: 'p21', sellerId: 'u6', title: 'Winter Coat', price: 60, description: 'Very warm, black.', category: 'Clothing', image: 'https://picsum.photos/seed/coat/400/300', status: 'ACTIVE', viewCount: 220, createdAt: '2023-11-05T09:00:00Z', tags: ['fashion', 'winter'] },
  { id: 'p22', sellerId: 'u4', title: 'Desk Fan', price: 12, description: 'Small USB fan.', category: 'Furniture', image: 'https://picsum.photos/seed/fan/400/300', status: 'ACTIVE', viewCount: 40, createdAt: '2023-11-06T13:40:00Z', tags: ['home', 'summer'] }
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u5', receiverId: 'u4', content: 'Is the math book still available?', timestamp: new Date(Date.now() - 10000000).toISOString(), isRead: true, type: 'CHAT' },
  { id: 'm2', senderId: 'u4', receiverId: 'u5', content: 'Yes it is!', timestamp: new Date(Date.now() - 9000000).toISOString(), isRead: true, type: 'CHAT' },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', sellerId: 'u4', buyerId: 'u5', productId: 'p1', rating: 5, content: 'Great seller! Item as described.', createdAt: '2023-10-15T10:00:00Z' }
];

class MockDatabase {
  private users: User[];
  private products: Product[];
  private messages: Message[];
  private reviews: Review[];

  constructor() {
    const loadedUsers = localStorage.getItem('db_users');
    const loadedProducts = localStorage.getItem('db_products');
    const loadedMessages = localStorage.getItem('db_messages');
    const loadedReviews = localStorage.getItem('db_reviews');

    this.users = loadedUsers ? JSON.parse(loadedUsers) : INITIAL_USERS;
    this.products = loadedProducts ? JSON.parse(loadedProducts) : INITIAL_PRODUCTS;
    this.messages = loadedMessages ? JSON.parse(loadedMessages) : INITIAL_MESSAGES;
    this.reviews = loadedReviews ? JSON.parse(loadedReviews) : INITIAL_REVIEWS;

    // Migration fix for existing data without wishlist or following
    this.users.forEach(u => {
      if (!u.wishlist) u.wishlist = [];
      if (!u.following) u.following = [];
    });

    this.save();
  }

  private save() {
    localStorage.setItem('db_users', JSON.stringify(this.users));
    localStorage.setItem('db_products', JSON.stringify(this.products));
    localStorage.setItem('db_messages', JSON.stringify(this.messages));
    localStorage.setItem('db_reviews', JSON.stringify(this.reviews));
  }

  // Auth
  login(username: string): User | null {
    // In a real Django app, we would hash verify password. Here we simulate "admin123" logic or open access for demo.
    const user = this.users.find(u => u.username === username);
    if (user && user.isBanned) throw new Error("Account Banned");
    return user || null;
  }

  register(username: string): User {
    if (this.users.find(u => u.username === username)) throw new Error("Username taken");
    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      avatar: `https://picsum.photos/seed/${username}/100/100`,
      role: UserRole.STUDENT,
      creditScore: 600,
      bio: 'New user',
      isBanned: false,
      joinDate: new Date().toISOString().split('T')[0],
      wishlist: [],
      following: []
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  // Users
  getUser(id: string) { return this.users.find(u => u.id === id); }
  getAllUsers() { return [...this.users]; }
  updateUser(id: string, updates: Partial<User>) {
    this.users = this.users.map(u => u.id === id ? { ...u, ...updates } : u);
    this.save();
  }

  toggleWishlist(userId: string, productId: string): User | null {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;
    
    // Ensure wishlist exists
    if (!user.wishlist) user.wishlist = [];

    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
    } else {
      user.wishlist.push(productId);
    }
    
    this.updateUser(userId, { wishlist: user.wishlist });
    return user;
  }

  toggleFollow(followerId: string, targetId: string): User | null {
      const user = this.users.find(u => u.id === followerId);
      if (!user) return null;

      if (!user.following) user.following = [];

      if (user.following.includes(targetId)) {
          user.following = user.following.filter(id => id !== targetId);
      } else {
          user.following.push(targetId);
      }

      this.updateUser(followerId, { following: user.following });
      return user;
  }

  // Products
  getProducts() { return this.products.filter(p => p.status !== 'BANNED'); }
  getAllProductsAdmin() { return [...this.products]; } // Admin sees all
  getProduct(id: string) { return this.products.find(p => p.id === id); }
  
  createProduct(product: Omit<Product, 'id' | 'viewCount' | 'createdAt' | 'status'>): Product {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    this.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProductStatus(id: string, status: Product['status']) {
    this.products = this.products.map(p => p.id === id ? { ...p, status } : p);
    this.save();
  }

  purchaseProduct(productId: string, buyerId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");
    if (product.status !== 'ACTIVE') throw new Error("Product not available");
    
    product.status = 'SOLD';
    product.buyerId = buyerId;
    this.save();
  }

  incrementView(id: string) {
    this.products = this.products.map(p => p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p);
    this.save();
  }

  // Messages
  getMessages(userId: string) {
    return this.messages.filter(m => m.senderId === userId || m.receiverId === userId);
  }

  sendMessage(senderId: string, receiverId: string, content: string, type: 'CHAT' | 'SYSTEM' = 'CHAT') {
    const msg: Message = {
      id: `m${Date.now()}`,
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      type
    };
    this.messages.push(msg);
    this.save();
    return msg;
  }

  markAsRead(userId: string, otherId: string) {
    this.messages = this.messages.map(m => 
      (m.receiverId === userId && m.senderId === otherId) ? { ...m, isRead: true } : m
    );
    this.save();
  }

  // Reviews
  getReviews(sellerId: string) {
      return this.reviews.filter(r => r.sellerId === sellerId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>) {
      const newReview = { 
          ...review, 
          id: `r${Date.now()}`, 
          createdAt: new Date().toISOString() 
      };
      this.reviews.unshift(newReview);
      this.save();
      // Optionally update user credit score here
      const seller = this.getUser(review.sellerId);
      if(seller) {
          const scoreChange = review.rating >= 4 ? 10 : (review.rating <= 2 ? -10 : 0);
          this.updateUser(seller.id, { creditScore: seller.creditScore + scoreChange });
      }
      return newReview;
  }
}

export const mockDb = new MockDatabase();