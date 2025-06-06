import apiClient from './apiClient';

export interface ScheduledPayment {
    id: string;
    date: string;
    category: string;
    amount: number;
}

export const scheduledPaymentService = {
    async getScheduledPayments(): Promise<ScheduledPayment[]> {
        const response = await apiClient.get<ScheduledPayment[]>('/scheduled-payments');
        return response.data;
    },

    async createScheduledPayment(payment: Omit<ScheduledPayment, 'id'>): Promise<ScheduledPayment> {
        const response = await apiClient.post<ScheduledPayment>('/scheduled-payments', payment);
        return response.data;
    },

    async deleteScheduledPayment(id: string): Promise<void> {
        await apiClient.delete(`/scheduled-payments/${id}`);
    },
}; 