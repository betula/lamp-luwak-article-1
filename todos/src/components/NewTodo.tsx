import React, { useState } from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo } from '../services/Todo';

export const NewTodo = () => {
  const todo = useProvide(Todo);
  const [ label, setLabel ] = useState('');

  const handleInputChange = (event: any) => setLabel(event.target.value);
  const handleInputKeyDown = (event: any) => {
    if (event.keyCode !== 13) {
      return;
    }
    const val = label.trim();
    if (val) {
      todo.append(val);
      setLabel('');
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      value={label}
    />
  );
};
