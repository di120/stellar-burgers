import { getOrdersApi } from '@api';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getUserOrders, userOrdersSelector } from '../../services/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  const orders: TOrder[] = useSelector(userOrdersSelector);

  return <ProfileOrdersUI orders={orders} />;
};
