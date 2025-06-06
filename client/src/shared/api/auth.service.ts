import apiClient from './apiClient';

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// Инициализация токена при загрузке
const token = localStorage.getItem('token');
if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const authService = {
    async register(email: string, password: string): Promise<AuthResponse> {
        try {
            console.log('Register request data:', { email, password });
            const response = await apiClient.post<AuthResponse>('/auth/register', {
                email,
                password,
            });
            console.log('Register response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Register error:', (error as ApiError).response?.data || error);
            const apiError = error as ApiError;
            if (apiError.response?.data?.message) {
                throw new Error(apiError.response.data.message);
            }
            throw new Error('Registration failed. Please try again.');
        }
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            console.log('Login request data:', { email, password });
            const response = await apiClient.post<AuthResponse>('/auth/login', {
                email,
                password,
            });
            console.log('Login response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Login error:', (error as ApiError).response?.data || error);
            const apiError = error as ApiError;
            if (apiError.response?.data?.message) {
                throw new Error(apiError.response.data.message);
            }
            throw new Error('Login failed. Please try again.');
        }
    },

    logout(): void {
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    setToken(token: string): void {
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
}; 