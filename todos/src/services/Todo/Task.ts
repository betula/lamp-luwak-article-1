import { subscribe, modify, action, dispatch } from 'lamp-luwak';

type Store = {
  id: number,
  label: string,
  completed: boolean
}

export const TaskChanged = action();
export const RemoveTask = action();

export class Task {
  store: Store;
  constructor(store: Store) {
    this.store = store;
    subscribe(this, TaskChanged);
  }
  toggle() {
    modify(this).completed = !this.store.completed;
  }
  remove() {
    dispatch(RemoveTask, this);
  }
}
