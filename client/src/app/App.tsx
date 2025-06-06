import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { MainPage, CategoriesPage, AddPage, AuthPage, Page404 } from '../pages';
import {
    MAIN_ROUTE,
    ADD_ROUTE,
    AUTH_ROUTE,
    CATEGORIES_ROUTE,
    ERROR_ROUTE,
} from '../consts';
import PrivateRoute from './PrivateRoute';
import { checkAuth } from './slices/userSlice';
import { AppDispatch } from './store';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route path={AUTH_ROUTE} element={<AuthPage />} />
                <Route
                    path={CATEGORIES_ROUTE}
                    element={
                        <PrivateRoute>
                            <CategoriesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={ADD_ROUTE}
                    element={
                        <PrivateRoute>
                            <AddPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path={MAIN_ROUTE}
                    element={
                        <PrivateRoute>
                            <MainPage />
                        </PrivateRoute>
                    }
                />
                <Route path={ERROR_ROUTE} element={<Page404 />} />
            </Routes>
        </Router>
    );
};

export default App;
