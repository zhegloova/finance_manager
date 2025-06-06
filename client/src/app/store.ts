import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import transactionReducer from './slices/transactionSlice';
import categoryReducer from './slices/categorySlice';
import scheduledPaymentsReducer from './slices/scheduledPaymentsSlice';
import categoriesSidePanelReducer from '../widgets/categoriesSidePanel/model/categoriesSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        transactions: transactionReducer,
        category: categoryReducer,
        scheduledPayments: scheduledPaymentsReducer,
        categoriesSidePanel: categoriesSidePanelReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
