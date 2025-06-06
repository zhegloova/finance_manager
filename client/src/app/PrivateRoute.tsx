import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from './store';

import { AUTH_ROUTE } from '../consts';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user);

    return user.id ? children : <Navigate to={AUTH_ROUTE} />;
};

export default PrivateRoute;
