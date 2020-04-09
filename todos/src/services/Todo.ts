import { create } from 'lamp-luwak';
import { TodoItem } from './Todo/TodoItem';

export class Todo {
  store = [
    create(TodoItem, { id: 1, label: 'Cook the dinner', completed: false }),
    create(TodoItem, { id: 2, label: 'Cook the breakfast', completed: true })
  ]
  add(label: string) {
    this.store = this.store.concat(
      create(TodoItem, { id: Date.now(), label, completed: false })
    );
  }
}
