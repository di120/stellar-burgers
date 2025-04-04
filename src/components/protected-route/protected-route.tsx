import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  checkUserAuth,
  isAuthCheckedSelector,
  isAuthenticatedSelector,
  userSelector
} from '../../services/userSlice';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userSelector);
  const location = useLocation();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && !user) {
    return children;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
