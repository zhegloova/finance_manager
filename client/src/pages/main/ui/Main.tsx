import { Link } from 'react-router-dom';

import { Layout } from '../../layout';

import { TransactionsList, PieChart, CustomTabs } from '../../../widgets';
import { ADD_ROUTE } from '../../../consts';

import { Button, Modal, Form, Input, Spin } from 'antd';
import type { TabsProps } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTransactions,
    selectBalance,
} from '../../../app/slices/transactionSlice';

import styles from './styles.module.css';
import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { RootState, AppDispatch } from '../../../app/store';
import {
    createScheduledPayment,
    fetchScheduledPayments,
    selectScheduledPayments,
    selectScheduledPaymentsStatus,
} from '../../../app/slices/scheduledPaymentsSlice';
import { debounce } from '../../../utils/debounce';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
};

// Мемоизированный компонент для отображения запланированных платежей
const ScheduledPaymentsList = memo(({ payments, status }: { payments: any[], status: string }) => {
    if (status === 'loading') {
        return <Spin size="large" />;
    }

    if (payments.length === 0) {
        return null;
    }

    return (
        <>
            {payments.map((payment, key) => (
                <div key={key} className={styles.scheduledPayment}>
                    <div className={styles.scheduledPaymentField}>
                        Напоминание о регулярном платеже
                    </div>
                    <div className={styles.scheduledPaymentField}>
                        Вам необходимо совершить транзакцию в категории{' '}
                        {payment.category} на сумму {payment.amount} ₽
                    </div>
                    <div className={styles.scheduledPaymentField}>
                        Дата: {formatDate(payment.date)}
                    </div>
                </div>
            ))}
        </>
    );
});

// Мемоизированный компонент формы
const PaymentForm = memo(({ 
    newPayment, 
    handlePaymentChange, 
    handleAddPayment, 
    isLoading 
}: { 
    newPayment: any, 
    handlePaymentChange: (field: string, value: string | number) => void,
    handleAddPayment: () => void,
    isLoading: boolean
}) => (
    <Spin spinning={isLoading}>
        <Form layout="vertical" onFinish={handleAddPayment}>
            <Form.Item label="Дата" required>
                <Input
                    value={newPayment.date}
                    onChange={(e) => handlePaymentChange('date', e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Категория" required>
                <Input
                    value={newPayment.category}
                    onChange={(e) => handlePaymentChange('category', e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Сумма" required>
                <Input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => handlePaymentChange('amount', Number(e.target.value))}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Добавить
                </Button>
            </Form.Item>
        </Form>
    </Spin>
));

const MainPage = () => {
    const user = useSelector((state: RootState) => state.user);
    const userId = user.id;

    const dispatch: AppDispatch = useDispatch();

    const scheduledPayments = useSelector(selectScheduledPayments);
    const scheduledPaymentsStatus = useSelector(selectScheduledPaymentsStatus);
    const [isLoading, setIsLoading] = useState(false);

    const [newPayment, setNewPayment] = useState({
        date: '',
        category: '',
        amount: 0,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

    const transactions = useSelector(
        (state: RootState) => state.transactions.transactions
    );
    const transactionStatus = useSelector(
        (state: RootState) => state.transactions.status
    );

    const balance = useSelector(selectBalance);

    const debouncedFetchScheduledPayments = useCallback(
        debounce(() => {
            if (userId) {
                dispatch(fetchScheduledPayments());
            }
        }, 1000),
        [dispatch, userId]
    );

    const debouncedFetchTransactions = useCallback(
        debounce(() => {
            if (userId) {
                dispatch(fetchTransactions());
            }
        }, 1000),
        [dispatch, userId]
    );

    useEffect(() => {
        debouncedFetchScheduledPayments();
        return () => {
            debouncedFetchScheduledPayments.cancel();
        };
    }, [debouncedFetchScheduledPayments]);

    useEffect(() => {
        if (transactionStatus === 'idle' && userId) {
            debouncedFetchTransactions();
        }
        return () => {
            debouncedFetchTransactions.cancel();
        };
    }, [transactionStatus, dispatch, userId, debouncedFetchTransactions]);

    const handleAddPayment = useCallback(async () => {
        if (newPayment.date && newPayment.category && newPayment.amount > 0) {
            setIsLoading(true);
            try {
                await dispatch(createScheduledPayment(newPayment)).unwrap();
                setNewPayment({ date: '', category: '', amount: 0 });
                setIsModalVisible(false);
                // После создания нового платежа обновляем список
                debouncedFetchScheduledPayments();
            } catch (error) {
                console.error('Failed to create scheduled payment:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [dispatch, newPayment, debouncedFetchScheduledPayments]);

    const handleOpenModal = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handlePaymentChange = useCallback((field: string, value: string | number) => {
        setNewPayment(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const mockItems = useMemo<TabsProps['items']>(() => [
        {
            key: '1',
            label: 'Доходы',
            children: <PieChart className={styles.chart} categoryType="Доходы" />,
        },
        {
            key: '2',
            label: 'Расходы',
            children: <PieChart className={styles.chart} categoryType="Расходы" />,
        },
    ], []);

    return (
        <Layout>
            <div className={styles.scheduledPaymentContainer}>
                <ScheduledPaymentsList 
                    payments={scheduledPayments} 
                    status={scheduledPaymentsStatus} 
                />
            </div>
            <div className={styles.balanceInfo}>
                <div
                    className={styles.toScheduledPayment}
                    onClick={handleOpenModal}
                >
                    Запланировать платёж
                </div>
                <div className={styles.walletBalance}>
                    Баланс кошелька: <span>{balance} ₽</span>
                </div>
            </div>

            {transactions.length > 0 ? (
                <CustomTabs
                    items={mockItems}
                    className={styles.chartContainer}
                />
            ) : null}

            <div className={styles.addButtonLinkContainer}>
                <Link to={ADD_ROUTE}>
                    <Button className={styles.addButton}>Добавить</Button>
                </Link>
            </div>

            <TransactionsList items={transactions} />

            <Modal
                title="Добавить запланированный платёж"
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                <PaymentForm
                    newPayment={newPayment}
                    handlePaymentChange={handlePaymentChange}
                    handleAddPayment={handleAddPayment}
                    isLoading={isLoading}
                />
            </Modal>
        </Layout>
    );
};

export default MainPage;
