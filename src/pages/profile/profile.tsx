import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  updateErrorSelector,
  updateUser,
  userSelector
} from '../../services/userSlice';
import { TRegisterData } from '@api';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const updateError = useSelector(updateErrorSelector);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updatedData: Partial<TRegisterData> = {};
    if (!!formValue.password) updatedData.password = formValue.password;
    if (formValue.email !== user?.email) updatedData.email = formValue.email;
    if (formValue.name !== user?.name) updatedData.name = formValue.name;
    dispatch(updateUser(updatedData));
    setFormValue((prevState) => ({
      ...prevState,
      password: ''
    }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    user &&
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateError}
    />
  );

  return null;
};
