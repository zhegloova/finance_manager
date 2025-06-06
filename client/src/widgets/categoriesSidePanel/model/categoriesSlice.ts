import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../../shared/api/category.service';

export interface Category {
    id: string;
    name: string;
    type: 'expense' | 'income';
}

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const categories = await categoryService.getCategories();
            return categories.map(cat => ({
                id: cat._id,
                name: cat.category,
                type: cat.categoryType.toLowerCase() as 'expense' | 'income'
            }));
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке категорий');
        }
    }
);

export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async ({ name, type }: Omit<Category, 'id'>, { rejectWithValue }) => {
        try {
            const category = await categoryService.createCategory(type, name);
            return {
                id: category._id,
                name: category.category,
                type: category.categoryType.toLowerCase() as 'expense' | 'income'
            };
        } catch (error) {
            return rejectWithValue('Ошибка при создании категории');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id: string, { rejectWithValue }) => {
        try {
            await categoryService.deleteCategory(id);
            return id;
        } catch (error) {
            return rejectWithValue('Ошибка при удалении категории');
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(cat => cat.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export default categoriesSlice.reducer; 