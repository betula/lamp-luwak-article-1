import React from 'react';
import { useProvide } from 'lamp-luwak';
import { TodoItem } from './TodoItem';
import { Todo, TodoFiltered } from '../services/Todo';
import { ToggleAllButton } from './ToggleAllButton';

export const TodoList = () => {
  const [ todo, todoFiltered ] = useProvide([ Todo, TodoFiltered ]);
  if (todo.store.list.length === 0) {
    return null;
  }

  return (
    <section className="main">
      <ToggleAllButton />
      <ul className="todo-list">
        {todoFiltered.store.list.map((item) => <TodoItem item={item} key={item.store.id} />)}
      </ul>
    </section>
  )
};
