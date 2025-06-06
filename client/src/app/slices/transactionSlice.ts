import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction, transactionService } from '../../shared/api/transaction.service';
import { RootState } from '../store';

interface TransactionState {
    transactions: Transaction[];
    balance: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    balance: 0,
    status: 'idle',
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async () => {
        return await transactionService.getTransactions();
    }
);

export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async (transaction: Omit<Transaction, 'id'>) => {
        return await transactionService.createTransaction(transaction);
    }
);

export const fetchBalance = createAsyncThunk(
    'transactions/fetchBalance',
    async () => {
        const response = await transactionService.getBalance();
        return response.balance;
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions = action.payload;
                state.error = null;
            })
            .addCase(fetchTransactions.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch transactions';
            })
            .addCase(addTransaction.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions.push(action.payload);
                state.error = null;
            })
            .addCase(addTransaction.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to create transaction';
            })
            .addCase(fetchBalance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.balance = action.payload;
                state.error = null;
            })
            .addCase(fetchBalance.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch balance';
            });
    },
});

export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectBalance = (state: RootState) => state.transactions.balance;
export const selectTransactionsStatus = (state: RootState) => state.transactions.status;
export const selectTransactionsError = (state: RootState) => state.transactions.error;

export default transactionSlice.reducer;
