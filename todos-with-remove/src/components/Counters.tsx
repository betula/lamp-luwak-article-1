import React from 'react';
import { useProvide } from 'lamp-luwak';
import { TodoCounters } from '../services/TodoCounters';

export const Counters = () => {
  const { active, completed } = useProvide(TodoCounters).store;
  return (
    <>
      <div>Active: {active}</div>
      <div>Completed: {completed}</div>
    </>
  )
};
