import React, { FC } from 'react';
import { useSubscribe } from 'lamp-luwak';
import { Task as TaskClass } from '../services/Todo/Task';

export const Task: FC<{ task: TaskClass }> = ({ task }) => {
  useSubscribe(task);
  const { label, completed } = task.store;
  return (
    <li>
      <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() => task.toggle()}
        />
      <span style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}>
        {label}
      </span>
      <button onClick={() => task.remove()}>del</button>
    </li>
  )
};
