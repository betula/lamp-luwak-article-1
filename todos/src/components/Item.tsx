import React, { FC } from 'react';
import { useSubscribe } from 'lamp-luwak';
import { TodoItem } from '../services/Todo/TodoItem';

export const Item: FC<{ item: TodoItem }> = ({ item }) => {
  useSubscribe(item);
  const { label, completed } = item.store;
  return (
    <li>
      <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() => item.toggle()}
        />
      <span style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}>
        {label}
      </span>
    </li>
  )
};
