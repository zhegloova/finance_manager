import { FC } from 'react';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const CustomTabs: FC<TabsProps> = ({ items, onChange, className }) => {
    return (
        <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            className={className}
        />
    );
};

export { CustomTabs };
