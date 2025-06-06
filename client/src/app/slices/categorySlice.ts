// categoriesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category, categoryService } from '../../shared/api/category.service';
import { RootState } from '../store';

interface CategoryState {
    categories: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    status: 'idle',
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        return await categoryService.getCategories();
    }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async ({ categoryType, category }: { categoryType: string; category: string }) => {
        return await categoryService.createCategory(categoryType, category);
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id: string) => {
        await categoryService.deleteCategory(id);
        return id;
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch categories';
            })
            .addCase(createCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories.push(action.payload);
                state.error = null;
            })
            .addCase(createCategory.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to create category';
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = state.categories.filter(
                    (category) => category._id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteCategory.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to delete category';
            });
    },
});

export const selectCategories = (state: RootState) => state.category.categories;
export const selectCategoriesStatus = (state: RootState) => state.category.status;
export const selectCategoriesError = (state: RootState) => state.category.error;

export default categorySlice.reducer;
