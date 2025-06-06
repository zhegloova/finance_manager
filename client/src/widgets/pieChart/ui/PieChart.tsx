import { FC, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { fetchTransactions } from '../../../app/slices/transactionSlice';
import styles from './styles.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    className?: string;
    categoryType: 'Доходы' | 'Расходы';
}

const PieChart: FC<PieChartProps> = ({ className, categoryType }) => {
    console.log(`PieChart render - categoryType: ${categoryType}`);

    const dispatch = useDispatch<AppDispatch>();
    const transactions = useSelector(
        (state: RootState) => state.transactions.transactions
    );
    const status = useSelector((state: RootState) => state.transactions.status);

    useEffect(() => {
        console.log('PieChart useEffect - status changed:', status);
        if (status === 'idle') {
            dispatch(fetchTransactions());
        }
    }, [status, dispatch]);

    const filteredTransactions = useMemo(() => {
        console.log('PieChart - filtering transactions');
        return transactions.filter(
            (transaction) =>
                (categoryType === 'Доходы' &&
                    transaction.categoryType === 'income') ||
                (categoryType === 'Расходы' &&
                    transaction.categoryType === 'expense')
        );
    }, [transactions, categoryType]);

    const categorySums = useMemo(() => {
        console.log('PieChart - calculating category sums');
        return filteredTransactions.reduce((acc, transaction) => {
            acc[transaction.category] =
                (acc[transaction.category] || 0) + transaction.amount;
            return acc;
        }, {} as Record<string, number>);
    }, [filteredTransactions]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const colors = useMemo(() => {
        console.log('PieChart - generating colors');
        return Object.keys(categorySums).map(() => getRandomColor());
    }, [categorySums]);

    const data = useMemo(() => {
        console.log('PieChart - creating chart data');
        return {
            labels: Object.keys(categorySums),
            datasets: [
                {
                    label: 'Сумма',
                    data: Object.values(categorySums),
                    backgroundColor: colors,
                },
            ],
        };
    }, [categorySums, colors]);

    const options = useMemo(() => {
        console.log('PieChart - creating chart options');
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: false
                }
            }
        };
    }, []);

    if (status === 'loading') {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (Object.keys(categorySums).length === 0) {
        return <div className={styles.empty}>Нет данных для отображения</div>;
    }

    console.log('PieChart - rendering chart');
    return (
        <div className={classNames(styles.chart, className)}>
            <Pie data={data} options={options} />
        </div>
    );
};

export { PieChart };
