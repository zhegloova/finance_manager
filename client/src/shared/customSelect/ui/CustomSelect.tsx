import { FC, SetStateAction } from 'react';
import { Select } from 'antd';
import styles from './styles.module.css';
import { Category } from '../../../widgets/categoriesSidePanel/model/categoriesSlice';

interface CustomSelectProps {
    options: Category[] | string[];
    placeholder: string;
    onChange: (value: SetStateAction<string>) => void;
    value?: string;
}

type OptionType = string | Category;

const isCategory = (option: OptionType): option is Category => {
    return (
        typeof option === 'object' && option !== null && 'name' in option
    );
};

export const CustomSelect: FC<CustomSelectProps> = ({
    options,
    placeholder,
    onChange,
    value
}) => {
    return (
        <Select
            value={value}
            placeholder={placeholder}
            className={styles.customSelect}
            onChange={onChange}
        >
            {options.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : option.name;
                return (
                    <Select.Option key={index} value={optionValue}>
                        {isCategory(option) ? option.name : option}
                    </Select.Option>
                );
            })}
        </Select>
    );
};
