import { action, modify, create, subscribe, dispatch, provide } from 'lamp-luwak';

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
  setCompleted(completed: boolean) {
    modify(this).completed = completed;
  }
  toggle() {
    this.setCompleted(!this.store.completed);
  }
  remove() {
    dispatch(TodoItemRemove, this);
  }

}

export class Todo {
  store = {
    list: [
      create(TodoItem, { id: 1, label: 'Cook the dinner', completed: false }),
      create(TodoItem, { id: 2, label: 'Cook the breakfast', completed: true })
    ],
    filter: 'all'
  }
  add(label: string) {
    modify(this).list = this.store.list.concat(
      create(TodoItem, { id: Date.now(), label, completed: false })
    );
  }
  filter(value?: string) {
    if (value) {
      modify(this).filter = value;
    }
    return this.store.filter;
  }
  toggle() {
    const completedTo = this.store.list.some(item => !item.store.completed);
    for (const item of this.store.list.slice()) {
      if (completedTo !== item.store.completed) {
        item.setCompleted(completedTo);
      }
    }
  }
  clearCompleted() {
    modify(this).list = this.store.list.filter(item => !item.store.completed);
  }
}

export class TodoFiltered {
  todo = provide(Todo);
  store = {
    active: 0,
    completed: 0,
    list: [] as TodoItem[]
  };
  constructor() {
    subscribe(this.todo, this.calculate, this);
    subscribe(TodoItemChanged, this.calculate, this);
    this.calculate();
  }
  calculate() {
    const { list, filter } = this.todo.store;
    const active = list.filter(item => !item.store.completed);
    const completed = list.filter(item => item.store.completed);
    modify(this, (store) => {
      store.active = active.length;
      store.completed = completed.length;
      if (filter === 'active') {
        store.list = active;
      }
      else if (filter === 'completed') {
        store.list = completed;
      }
      else {
        store.list = list;
      }
    });
  }
}
