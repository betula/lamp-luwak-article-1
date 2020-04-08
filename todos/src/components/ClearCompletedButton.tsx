import React, { memo } from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo, TodoFiltered } from '../services/Todo';

export const ClearCompletedButton = memo(() => {
  const [ todo, todoFiltered ] = useProvide([ Todo, TodoFiltered ]);

  if(!todoFiltered.store.completed) {
    return null;
  }

  return (
    <button
      className="clear-completed"
      onClick={() => todo.clearCompleted()}
    >Clear completed</button>
  );
})
