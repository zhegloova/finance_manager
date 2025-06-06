import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, List, message } from 'antd';
import { addCategory, fetchCategories, deleteCategory } from '../model/categoriesSlice';
import { RootState, AppDispatch } from '../../../app/store';
import { Category } from '../model/categoriesSlice';
import styles from './styles.module.css';

interface CategoriesSidePanelProps {
    categoryType: 'expense' | 'income';
}

export const CategoriesSidePanel = ({ categoryType }: CategoriesSidePanelProps) => {
    const [newCategory, setNewCategory] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { categories, loading, error } = useSelector((state: RootState) => state.categoriesSidePanel);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error]);

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                await dispatch(addCategory({
                    name: newCategory.trim(),
                    type: categoryType
                })).unwrap();
                message.success('Категория успешно добавлена');
                setNewCategory('');
            } catch (error) {
                message.error('Ошибка при добавлении категории');
            }
        } else {
            message.warning('Введите название категории');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!id) {
            message.error('Не удалось удалить категорию: отсутствует ID');
            return;
        }
        try {
            await dispatch(deleteCategory(id)).unwrap();
            message.success('Категория успешно удалена');
        } catch (error) {
            message.error('Ошибка при удалении категории');
        }
    };

    const filteredCategories = categories.filter(cat => cat.type === categoryType);

    return (
        <div className={styles.categoriesPanel}>
            <div className={styles.addCategoryForm}>
                <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder={`Добавить ${categoryType === 'income' ? 'доход' : 'расход'}`}
                    onPressEnter={handleAddCategory}
                    style={{ marginBottom: 8 }}
                />
                <Button 
                    type="primary" 
                    onClick={handleAddCategory} 
                    block
                    loading={loading}
                >
                    Добавить
                </Button>
            </div>
            <List
                className={styles.categoriesList}
                loading={loading}
                dataSource={filteredCategories}
                locale={{ emptyText: 'Нет категорий' }}
                renderItem={(category: Category) => (
                    <List.Item
                        actions={[
                            <Button 
                                type="link" 
                                danger 
                                onClick={() => handleDeleteCategory(category.id)}
                            >
                                Удалить
                            </Button>
                        ]}
                    >
                        {category.name}
                    </List.Item>
                )}
            />
        </div>
    );
};
