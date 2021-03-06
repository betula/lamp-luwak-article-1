import { subscribe, modify, action } from 'lamp-luwak';

type Store = {
  id: number,
  label: string,
  completed: boolean
}

export const TaskChanged = action();

export class Task {
  store: Store;
  constructor(store: Store) {
    this.store = store;
    subscribe(this, TaskChanged);
  }
  toggle() {
    modify(this).completed = !this.store.completed;
  }
}
