import { subscribe, modify, action } from 'lamp-luwak';

type Store = {
  id: number,
  label: string,
  completed: boolean
}

export const TodoItemChanged = action();

export class TodoItem {
  store: Store;
  constructor(store: Store) {
    this.store = store;
    subscribe(this, TodoItemChanged);
  }
  toggle() {
    modify(this).completed = !this.store.completed;
  }
}
