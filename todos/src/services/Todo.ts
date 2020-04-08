import { action, modify, create, subscribe, dispatch } from "lamp-luwak";
import { useMemo } from "react";

export type TodoItemStore = {
  id: number,
  label: string,
  completed: boolean
}

export const TodoItemChanged = action();
export const TodoItemRemove = action();

export class TodoItem {
  store: TodoItemStore;
  constructor(store: TodoItemStore) {
    this.store = store;
    subscribe(this, TodoItemChanged);
  }
  toggle() {
    modify(this).completed = !this.store.completed;
  }
  remove() {
    dispatch(TodoItemRemove, this);
  }
}

export class Todo {
  store = {
    filter: 'all',
    list: [
      create(TodoItem, { id: 1, label: 'Cook the dinner', completed: false }),
      create(TodoItem, { id: 2, label: 'Cook the breakfast', completed: true })
    ]
  }
  add(label: string) {
    modify(this).list = this.store.list.concat(
      create(TodoItem, { id: Date.now(), label, completed: false })
    );
  }
}
