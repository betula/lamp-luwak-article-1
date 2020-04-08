import React from 'react';
import { useSubscribe } from 'lamp-luwak';
import { TodoItem as TodoItemType } from '../services/Todo';

type Props = {
  item: TodoItemType;
}

export const TodoItem = ({ item }: Props) => {
  useSubscribe(item);
  const handleDestroyClick = () => item.remove();
  const handleToggleClick = () => item.setCompleted(!item.store.completed);
  const { completed, label } = item.store;
  return (
    <li className={item.store.completed ? 'completed' : ''}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={handleToggleClick}
        />
        <label>{label}</label>
        <button className="destroy" onClick={handleDestroyClick} />
      </div>
    </li>
  )
};
