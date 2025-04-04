import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  let text = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      text = statusText.pending;
      break;
    case 'done':
      textStyle = '#00CCCC';
      text = statusText.done;
      break;
    default:
      textStyle = '#F2F2F3';
      text = statusText.created;
  }

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
