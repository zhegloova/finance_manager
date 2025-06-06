import { FC } from 'react';
import classNames from 'classnames';

import expense from '../../../assets/expense.svg';
import income from '../../../assets/income.svg';

import { notification } from 'antd';

import styles from './styles.module.css';

interface TransactionsListItemProps {
    transactionType: string;
    category: string;
    date: string;
    amount: number;
    notes?: string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
};

const formatAmount = (amount: number, type: string) => {
    const formattedAmount = amount.toLocaleString('ru-RU');
    return type === 'income' ? formattedAmount : `-${formattedAmount}`;
};

const getTransactionTypeLabel = (type: string) => {
    return type === 'income' ? 'Доход' : 'Расход';
};

const TransactionsListItem: FC<TransactionsListItemProps> = ({
    transactionType,
    category,
    date,
    amount,
    notes,
}) => {
    const openNotification = (type: 'success' | 'error', message: string) => {
        notification[type]({
            message: message,
            placement: 'topRight',
        });
    };

    const openNotes = () => {
        if (notes) {
            openNotification('success', notes);
        } else {
            openNotification(
                'error',
                'У данной транзакции нет заметок'
            );
        }
    };

    return (
        <div
            className={classNames(
                styles.container,
                transactionType === 'income'
                    ? styles.income
                    : styles.expense
            )}
        >
            <img
                src={
                    transactionType === 'income'
                        ? income
                        : expense
                }
                alt="transactionType"
            />
            <div>{getTransactionTypeLabel(transactionType)}</div>
            <div>{category}</div>
            <div>{formatDate(date)}</div>
            <div>
                {formatAmount(amount, transactionType)} ₽
            </div>
            <div className={styles.openNotes} onClick={openNotes}>
                ...
            </div>
        </div>
    );
};

export { TransactionsListItem };
