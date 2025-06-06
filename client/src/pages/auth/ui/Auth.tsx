import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import { AppDispatch, RootState } from '../../../app/store';
import { registerUser, loginUser, logoutUser } from '../../../app/slices/userSlice';
import { MAIN_ROUTE } from '../../../consts';
import styles from './styles.module.css';

interface ErrorWithMessage {
    message?: string;
}

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user.id) {
            navigate(MAIN_ROUTE);
        }
    }, [user.id, navigate]);

    const handleRegister = async () => {
        try {
            await dispatch(registerUser({ email, password })).unwrap();
            message.success('Регистрация успешна');
            navigate(MAIN_ROUTE);
        } catch (error: unknown) {
            const err = error as ErrorWithMessage;
            message.error(err.message || 'Ошибка при регистрации');
            console.error('Ошибка при регистрации:', error);
        }
    };

    const handleLogin = async () => {
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            message.success('Вход выполнен успешно');
            navigate(MAIN_ROUTE);
        } catch (error: unknown) {
            const err = error as ErrorWithMessage;
            message.error(err.message || 'Ошибка при входе');
            console.error('Ошибка при входе:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            message.success('Выход выполнен успешно');
        } catch (error: unknown) {
            const err = error as ErrorWithMessage;
            message.error(err.message || 'Ошибка при выходе');
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <div className={styles.authContainer}>
            {user.id ? (
                <div className={styles.logoutContainer}>
                    <p>Вы вошли как: {user.email}</p>
                    <div className={styles.buttonGroup}>
                        <Button type="primary" onClick={() => navigate(MAIN_ROUTE)}>
                            На главную
                        </Button>
                        <Button onClick={handleLogout}>
                            Выйти
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={styles.authForm}>
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                    <Input.Password
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                    />
                    <div className={styles.buttonGroup}>
                        <Button className={styles.authButton} onClick={handleLogin}>
                            Войти
                        </Button>
                        <Button className={styles.authButton} onClick={handleRegister}>
                            Зарегистрироваться
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AuthPage };
