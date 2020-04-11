import React, { useState } from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo } from '../services/Todo';

export const Input = () => {
  const [text, setText] = useState('Cook the lunch');
  const todo = useProvide(Todo);
  const add = () => {
    todo.add(text);
    setText('');
  };

  return (
    <>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        autoFocus
        onKeyDown={(event: any) => {
          if (event.keyCode === 13) add();
        }}
      />
      <button onClick={add}>Add</button>
    </>
  );
};
