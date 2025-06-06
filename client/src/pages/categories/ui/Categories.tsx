import { Layout } from '../../layout';
import { CategoriesSidePanel } from '../../../widgets';
import { Splitter } from 'antd';
import styles from './styles.module.css';

const CategoriesPage = () => {
    return (
        <Layout>
            <div className={styles.container}>
                <h1 className={styles.header}>Категории</h1>
                <Splitter>
                    <Splitter.Panel min="20%" max="80%">
                        <div className={styles.categorySection}>
                            <h2 className={`${styles.sectionHeader} ${styles.expense}`}>Расходы</h2>
                            <CategoriesSidePanel categoryType="expense" />
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel min="20%" max="80%">
                        <div className={styles.categorySection}>
                            <h2 className={`${styles.sectionHeader} ${styles.income}`}>Доходы</h2>
                            <CategoriesSidePanel categoryType="income" />
                        </div>
                    </Splitter.Panel>
                </Splitter>
            </div>
        </Layout>
    );
};

export { CategoriesPage };
