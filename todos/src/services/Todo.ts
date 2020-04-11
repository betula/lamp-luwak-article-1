import { create } from 'lamp-luwak';
import { Task } from './Todo/Task';

export class Todo {
  store = [
    create(Task, { id: 1, label: 'Cook the dinner', completed: false }),
    create(Task, { id: 2, label: 'Cook the breakfast', completed: true })
  ]
  add(label: string) {
    this.store = this.store.concat(
      create(Task, { id: Date.now(), label, completed: false })
    );
  }
}
