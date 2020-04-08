import React from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo, TodoFiltered } from '../services/Todo';

export const ToggleAllButton = () => {
  const [ todo, todoFiltered ] = useProvide([ Todo, TodoFiltered ]);
  return (
    <>
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={todoFiltered.store.active === 0}
        onChange={() => todo.toggle()}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
    </>
  )
};
