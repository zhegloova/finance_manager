import apiClient from './apiClient';

export interface Transaction {
    id: string;
    categoryType: string;
    category: string;
    amount: number;
    date: string;
    notes?: string;
}

export interface BalanceResponse {
    balance: number;
}

export const transactionService = {
    async getTransactions(): Promise<Transaction[]> {
        const response = await apiClient.get<Transaction[]>('/transactions');
        return response.data;
    },

    async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const response = await apiClient.post<Transaction>('/transactions', transaction);
        return response.data;
    },

    async getBalance(): Promise<BalanceResponse> {
        const response = await apiClient.get<BalanceResponse>('/transactions/balance');
        return response.data;
    },
}; 