import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { logoutUser } from '../../app/slices/userSlice';
import { authService } from '../../shared/api/auth.service';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { email, status } = useSelector((state: RootState) => state.user);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error instanceof Error ? error.message : 'Unknown error');
        }
    };

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Link to="/">Finance Manager</Link>
                </div>
                <div className={styles.userSection}>
                    {status === 'succeeded' && email ? (
                        <div className={styles.userInfo}>
                            <span className={styles.userEmail}>{email}</span>
                            <button 
                                className={styles.logoutButton}
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className={styles.loginButton}>
                            Войти
                        </Link>
                    )}
                </div>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}; 