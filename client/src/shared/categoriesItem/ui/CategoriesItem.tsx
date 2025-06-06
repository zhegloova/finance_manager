import { FC } from 'react';

import styles from './styles.module.css';

interface CategoriesItemProps {
    categoryName: string;
}

const CategoriesItem: FC<CategoriesItemProps> = ({ categoryName }) => {
    return (
        <div className={styles.container}>
            <div className={styles.categoryName}>{categoryName}</div>
        </div>
    );
};

export { CategoriesItem };
