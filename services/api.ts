import axios from 'axios';
import { User, Product, Message, Review } from '../types';

// 后端 API 的基础地址
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：自动注入 JWT Token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    auth: {
        login: async (username: string, password: string): Promise<User> => {
            // Ensure you are sending both fields in the data object
            const response = await apiClient.post('/auth/login/', {
                username: username,
                password: password
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);


            // Note: Standard TokenObtainPairView does NOT return the user object.
            // You may need to fetch the user separately or customize the view.
            if (response.data.user) {
                return response.data.user;
            } else {
                // 这是一个折中方案：我们需要知道当前登录的是谁
                // 如果后端无法返回，您可能需要后端自定义 TokenView
                throw new Error("Login successful but user data missing. Please check backend response.");
            }
        },
        register: async (username: string, password: string): Promise<User> => {
            // Registration typically goes to your UserViewSet (POST /api/users/)
            const response = await apiClient.post('/users/', { username, password });
            return response.data;
        },
        getCurrentUser: async (id: string): Promise<User> => {
            const response = await apiClient.get(`/users/${id}/`);
            return response.data;
        },
        updateWishlist: async (userId: string, productId: string): Promise<User> => {
            const response = await apiClient.post(`/users/${userId}/toggle_wishlist/`, { productId });
            return response.data;
        },
        toggleFollow: async (followerId: string, targetId: string): Promise<User> => {
            const response = await apiClient.post(`/users/${followerId}/toggle_follow/`, {targetId});
            return response.data;
        }
    },

    products: {
        list: async (params?: { search?: string; sort?: string; hideSold?: boolean }): Promise<Product[]> => {
            const response = await apiClient.get('/products/', { params });
            return response.data;
        },
        get: async (id: string): Promise<Product> => {
            const response = await apiClient.get(`/products/${id}/`);
            return response.data;
        },
        create: async (productData: any): Promise<Product> => {
            const response = await apiClient.post('/products/', productData);
            return response.data;
        },
        purchase: async (productId: string, buyerId: string, address: string): Promise<void> => {
            // 将 address 放入 POST 请求体中
            await apiClient.post(`/products/${productId}/purchase/`, { buyerId, address });
        },
        getRelated: async (category: string, excludeId: string): Promise<Product[]> => {
            const response = await apiClient.get('/products/', {
                params: { category, excludeId, limit: 3 }
            });
            return response.data;
        },
        confirmReceived: async (productId: string, buyerId: string) => {
            await apiClient.post(`/products/${productId}/confirm_received/`, { buyerId });
        },
    },

    users: {
        get: async (id: string): Promise<User> => {
            const response = await apiClient.get(`/users/${id}/`);
            return response.data;
        },
        getProfileData: async (id: string) => {
            const response = await apiClient.get(`/users/${id}/profile_data/`);
            return response.data;
        },
        withdraw: async (userId: string, amount: number, cardNumber: string) => {
            const response = await apiClient.post(`/users/${userId}/withdraw/`, { amount, cardNumber });
            return response.data;
        }
    },


    messages: {
        list: async (userId: string): Promise<Message[]> => {
            const response = await apiClient.get('/messages/', { params: { userId } });
            return response.data;
        },
        send: async (senderId: string, receiverId: string, content: string): Promise<Message> => {
            const response = await apiClient.post('/messages/', { senderId, receiverId, content });
            return response.data;
        }
    },

    reviews: {
        list: async (sellerId: string): Promise<Review[]> => {
            const response = await apiClient.get('/reviews/', { params: { sellerId } });
            return response.data;
        },
        create: async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
            const response = await apiClient.post('/reviews/', reviewData);
            return response.data;
        }
    },

    admin: {
        getAllUsers: async (): Promise<User[]> => {
            const response = await apiClient.get('/users/admin_list/');
            return response.data;
        },
        // Add this method
        getAllProducts: async (): Promise<Product[]> => {
            // Admin sees all products, including banned ones
            const response = await apiClient.get('/products/');
            return response.data;
        },
        toggleBanUser: async (userId: string, isBanned: boolean) => {
            await apiClient.post(`/users/${userId}/toggle_ban/`, { isBanned });
        },
        // Add this method
        toggleProductStatus: async (productId: string, status: string) => {
            await apiClient.post(`/products/${productId}/toggle_status/`, { status });
        }
    }
};