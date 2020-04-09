import React from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo } from '../services/Todo';
import { Task } from './Task';

export const List = () => {
  const todo = useProvide(Todo);
  const items = todo.store;
  if (items.length === 0) return null;
  return (
    <ul>
      {items.map(item => (
        <Task task={item} key={item.store.id} />
      ))}
    </ul>
  )
};
