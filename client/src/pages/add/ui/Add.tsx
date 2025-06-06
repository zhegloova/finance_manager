import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { Layout } from '../../layout';
import { CustomSelect } from '../../../shared';
import { Button, Input, DatePicker, Radio } from 'antd';
import styles from './styles.module.css';
import { addTransaction } from '../../../app/slices/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { CATEGORIES_ROUTE } from '../../../consts';
import { fetchCategories } from '../../../widgets/categoriesSidePanel/model/categoriesSlice';
import { Category } from '../../../widgets/categoriesSidePanel/model/categoriesSlice';

interface Transaction {
    categoryType: string;
    category: string;
    amount: number;
    date: string;
    notes?: string;
    userId: string;
}

const AddPage = () => {
    const user = useSelector((state: RootState) => state.user);
    const userId = user.id as string;
    const dispatch: AppDispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.categoriesSidePanel.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const navigate = useNavigate();

    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');

    const filteredCategories = useMemo(() => {
        return categories.filter((cat: Category) => cat.type === transactionType);
    }, [categories, transactionType]);

    const handleTransactionTypeChange = (e: any) => {
        setTransactionType(e.target.value);
        setCategory('');
    };

    const handleCategoryChange = (value: SetStateAction<string>) => {
        setCategory(value as string);
    };

    const handleDateChange = (date: SetStateAction<string>) => {
        setDate(date as string);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value);
    };

    const handleAddTransaction = () => {
        if (!category || !date || !amount) {
            notification.error({
                message: 'Ошибка',
                description: 'Пожалуйста, заполните все обязательные поля',
            });
            return;
        }

        const transaction: Omit<Transaction, 'id'> = {
            categoryType: transactionType,
            category,
            amount: Number(amount),
            date,
            notes,
            userId
        };

        dispatch(addTransaction(transaction));
        navigate('/');
    };

    return (
        <Layout>
            <div className={styles.addPage}>
                <h1>Добавить транзакцию</h1>
                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Тип транзакции</label>
                        <Radio.Group 
                            value={transactionType} 
                            onChange={handleTransactionTypeChange}
                            buttonStyle="solid"
                            className={styles.transactionTypeGroup}
                        >
                            <Radio.Button value="expense">Расход</Radio.Button>
                            <Radio.Button value="income">Доход</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Категория</label>
                        <CustomSelect
                            value={category}
                            options={filteredCategories}
                            placeholder={`Выберите категорию ${transactionType === 'income' ? 'дохода' : 'расхода'}`}
                            onChange={handleCategoryChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Дата</label>
                        <DatePicker
                            onChange={(date) => handleDateChange(date?.toISOString() || '')}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Сумма</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Введите сумму"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Заметки</label>
                        <Input.TextArea
                            value={notes}
                            onChange={handleNotesChange}
                            placeholder="Введите заметки"
                            rows={4}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <Button type="primary" onClick={handleAddTransaction} block>
                            Добавить транзакцию
                        </Button>
                    </div>
                </div>
                <Link
                    to={CATEGORIES_ROUTE}
                    className={styles.addCategory}
                >
                    Добавить категорию
                </Link>
            </div>
        </Layout>
    );
};

export { AddPage };
