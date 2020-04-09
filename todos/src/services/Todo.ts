import { create, subscribe } from 'lamp-luwak';
import { Task, RemoveTask } from './Todo/Task';

export class Todo {
  store = [
    create(Task, { id: 1, label: 'Cook the dinner', completed: false }),
    create(Task, { id: 2, label: 'Cook the breakfast', completed: true })
  ]
  constructor() {
    subscribe(RemoveTask, this.remove, this);
  }
  add(label: string) {
    this.store = this.store.concat(
      create(Task, { id: Date.now(), label, completed: false })
    );
  }
  remove(task: Task) {
    const index = this.store.indexOf(task);
    this.store = this.store.slice(0, index).concat(
      this.store.slice(index + 1)
    );
  }
}
