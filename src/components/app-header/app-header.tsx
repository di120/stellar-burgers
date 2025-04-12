import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { userSelector } from '../../services/user/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const name = useSelector(userSelector)?.name;
  return <AppHeaderUI userName={name} />;
};
