import React, { memo } from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo, TodoFiltered } from '../services/Todo';
import { ClearCompletedButton } from './ClearCompletedButton';

export const Footer = memo(() => {
  const [ todo, todoFiltered ] = useProvide([ Todo, TodoFiltered ]);

  if (todo.store.list.length === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count"><strong>{todoFiltered.store.active}</strong> item left</span>
      <ul className="filters">
        <li>
          <button className={todo.store.filter === 'all' ? 'selected' : ''}>All</button>
        </li>
        <li>
          <button className={todo.store.filter === 'active' ? 'selected' : ''}>Active</button>
        </li>
        <li>
          <button className={todo.store.filter === 'completed' ? 'selected' : ''}>Completed</button>
        </li>
      </ul>
      <ClearCompletedButton />
    </footer>
  );
})
