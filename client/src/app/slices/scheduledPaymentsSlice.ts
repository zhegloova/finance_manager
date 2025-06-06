import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduledPayment, scheduledPaymentService } from '../../shared/api/scheduledPayment.service';
import { RootState } from '../store';

interface ScheduledPaymentState {
    scheduledPayments: ScheduledPayment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ScheduledPaymentState = {
    scheduledPayments: [],
    status: 'idle',
    error: null,
};

export const fetchScheduledPayments = createAsyncThunk(
    'scheduledPayments/fetchScheduledPayments',
    async () => {
        return await scheduledPaymentService.getScheduledPayments();
    }
);

export const createScheduledPayment = createAsyncThunk(
    'scheduledPayments/createScheduledPayment',
    async (payment: Omit<ScheduledPayment, 'id'>) => {
        return await scheduledPaymentService.createScheduledPayment(payment);
    }
);

export const deleteScheduledPayment = createAsyncThunk(
    'scheduledPayments/deleteScheduledPayment',
    async (id: string) => {
        await scheduledPaymentService.deleteScheduledPayment(id);
        return id;
    }
);

const scheduledPaymentsSlice = createSlice({
    name: 'scheduledPayments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScheduledPayments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchScheduledPayments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.scheduledPayments = action.payload;
                state.error = null;
            })
            .addCase(fetchScheduledPayments.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch scheduled payments';
            })
            .addCase(createScheduledPayment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createScheduledPayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.scheduledPayments.push(action.payload);
                state.error = null;
            })
            .addCase(createScheduledPayment.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to create scheduled payment';
            })
            .addCase(deleteScheduledPayment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteScheduledPayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.scheduledPayments = state.scheduledPayments.filter(
                    (payment) => payment.id !== action.payload
                );
                state.error = null;
            })
            .addCase(deleteScheduledPayment.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to delete scheduled payment';
            });
    },
});

export const selectScheduledPayments = (state: RootState) => state.scheduledPayments.scheduledPayments;
export const selectScheduledPaymentsStatus = (state: RootState) => state.scheduledPayments.status;
export const selectScheduledPaymentsError = (state: RootState) => state.scheduledPayments.error;

export default scheduledPaymentsSlice.reducer;
