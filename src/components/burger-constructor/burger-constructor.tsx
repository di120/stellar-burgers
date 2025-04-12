import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { userSelector } from '../../services/user/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  bunsSelector,
  burgerIngredientsSelector,
  orderBurger,
  orderInfoSelector,
  orderRequestSelector,
  resetConstructor
} from '../../services/constructor/burgerSlice';

type TConstructorItems = {
  ingredients: Array<TConstructorIngredient>;
  bun: TConstructorIngredient | null;
};

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(userSelector);
  const bun = useSelector(bunsSelector);
  const ingredients = useSelector(burgerIngredientsSelector);
  const constructorItems: TConstructorItems = { bun, ingredients };
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderInfoSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) return navigate('/login');
    const orderData = ingredients.map((i) => i._id);
    bun && orderData.push(bun?._id);
    dispatch(orderBurger(orderData));
  };

  const closeOrderModal = () => {
    navigate('/');
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients.length > 0
        ? constructorItems.ingredients.reduce(
            (s: number, v: TConstructorIngredient) => s + v.price,
            0
          )
        : 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
