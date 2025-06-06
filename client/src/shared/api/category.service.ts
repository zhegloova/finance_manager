import apiClient from './apiClient';

export interface Category {
    _id: string;
    categoryType: string;
    category: string;
}

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<Category[]>('/categories');
        return response.data;
    },

    async createCategory(categoryType: string, category: string): Promise<Category> {
        const response = await apiClient.post<Category>('/categories', {
            categoryType,
            category,
        });
        return response.data;
    },

    async deleteCategory(id: string): Promise<void> {
        await apiClient.delete(`/categories/${id}`);
    },
}; 