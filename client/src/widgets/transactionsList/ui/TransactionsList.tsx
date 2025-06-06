import { FC, useEffect, useMemo } from 'react';

import { TransactionsListItem } from '../../../shared/index';

import { selectBalance, fetchBalance } from '../../../app/slices/transactionSlice';

import styles from './styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';

interface Transaction {
    categoryType: string;
    category: string;
    date: string;
    amount: number;
    notes?: string;
}

interface TransactionsListProps {
    items: Transaction[];
}

const TransactionsList: FC<TransactionsListProps> = ({ items }) => {
    const dispatch = useDispatch<AppDispatch>();
    const balance = useSelector(selectBalance);

    useEffect(() => {
        dispatch(fetchBalance());
    }, [dispatch, items]);

    const formattedBalance = useMemo(() => 
        balance.toLocaleString('ru-RU'),
        [balance]
    );

    const transactions = useMemo(() => 
        items.map((item, index) => {
            const { categoryType, category, date, amount, notes } = item;
            return (
                <TransactionsListItem
                    key={index}
                    transactionType={categoryType}
                    category={category}
                    date={date}
                    amount={amount}
                    notes={notes}
                />
            );
        }),
        [items]
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>Список транзакций </div>
                <div>Все</div>
                <div>Итого: {formattedBalance} ₽</div>
            </div>
            <div className={styles.list}>
                {items.length > 0 ? (
                    transactions
                ) : (
                    <span className={styles.noTransactions}>
                        Вы ещё не добавили транзакций
                    </span>
                )}
            </div>
        </div>
    );
};

export { TransactionsList };
