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
            // 对应后端的 TokenObtainPairView
            const response = await apiClient.post('/auth/login/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            return response.data.user; // 假设后端在登录接口额外返回了用户数据
        },
        getCurrentUser: async (id: string): Promise<User> => {
            const response = await apiClient.get(`/users/${id}/`);
            return response.data;
        },
        updateWishlist: async (userId: string, productId: string): Promise<User> => {
            const response = await apiClient.post(`/users/${userId}/toggle_wishlist/`, { productId });
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
        purchase: async (productId: string, buyerId: string): Promise<void> => {
            await apiClient.post(`/products/${productId}/purchase/`, { buyerId });
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

    admin: {
        getAllUsers: async (): Promise<User[]> => {
            const response = await apiClient.get('/users/admin_list/');
            return response.data;
        },
        toggleBanUser: async (userId: string, isBanned: boolean) => {
            await apiClient.post(`/users/${userId}/toggle_ban/`, { isBanned });
        }
    }
};