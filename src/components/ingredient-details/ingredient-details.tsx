import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import {
  getIngredients,
  ingridientsSelector
} from '../../services/ingredients/ingridientsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
  }, []);
  const ingredients = useSelector(ingridientsSelector);
  const ingredientData = ingredients.find((i) => i._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
