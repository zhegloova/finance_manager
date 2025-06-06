import { FC, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import userIcon from '../../../assets/user-icon.svg';
import logo from '../../../assets/logo.svg';
import { AUTH_ROUTE, MAIN_ROUTE } from '../../../consts';
import { logoutUser } from '../../../app/slices/userSlice';
import { AppDispatch } from '../../../app/store';

import styles from './styles.module.css';

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

const Layout: FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate(AUTH_ROUTE);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to={MAIN_ROUTE} className={styles.clickable}>
                    <img src={logo} alt="logotype" className={styles.icon} />
                </Link>
                <img
                    src={userIcon}
                    alt="user"
                    className={classNames(styles.clickable, styles.icon)}
                    onClick={handleLogout}
                />
            </div>
            {children}
        </div>
    );
};

export { Layout };
