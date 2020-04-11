# Сервисно-ориентированный state management

На текущий момент в отрасли множество подходов к организации state management вашего приложения. Существующие решения хорошо задокументированы и имеют большое коммьюнити, но так же имеют и некоторые недостатки.

Благодаря тому, что React предоставляет удивительные возможности по работе с отображением, можно сосредоточиться только на организации логики приложения и семантике кода, описывающего работу с данными. Т.е. выбирая state management библиотеку, происходит выбор стилистики будущей кодовой базы. `lamp-luwak` предлагает бизнес логику разбитую на сервисы-сторы, с возможностью разбиения на независимые модули (с SSR), и использующие механизм `action` и `subscribe` для коммуникации.

В `lamp-luwak` множество сторов и мы можем не использовать селекторы, так как каждый стор должен быть организован с минимальным уровнем вложенности, а обновление таких иммутабельных структур будет проще. Так же при обновлении одного из сторов, другие сервисы и React компоненты не подписанные на него никак не будут задействованы и не будут оказывать на производительность негативного воздействия.

Вся логика внутри вашего приложения разбита на сервисы, каждый сервис содержит в себе единственный стор, изменение которого уведомляет подписчиков.
Так же внутри сервиса содержаться функции логики, где можно обращаться к другим сервисам и перезаписывать иммутабельный стор, эти функции могут быть асинхронными и содержать в себе сайд эффекты.

`lamp-luwak`, благодаря своей архитектуре, позволяет оптимизировать участки документа необходимого для перерисовки. Локализация областей вашего отображения и минимизация затрат на обновления, происходит засчет подписывания каждого React компонента вызывающего `useProvide` или `useSubscribe` на соответствующие сторы. Обновляться будут только те компоненты, что используют сторы, которые поменялись.

Любой сервис можно инстанцировать в любом месте вашего приложения, для библиотеки не трубется какая-либо инициализация. Например это особенно удобно для разработки изолированных компонентов или embedded решений. Или при внедрении в существующий проект.

Так же каждый сервис может быть подписан на изменение стора любого другого сервиса или набора сервисов через механизм `subscribe`. Таким образом можно делать зависимые вычисления.

Для демонстрации стилистики кода воспользуемся примером приложения, что использует часть функциональности todo-листа для сохранения наглядности:
- Добавление задачи
- Завершить/возобновить каждую задачу из списка
- Счетчик завершённых/активных

### Установка

Развернём приложение todos используя `create-react-app`

```bash
npx create-react-app todos --template typescript --use-npm
# or
yarn create react-app todos --template typescript
```

Так же устанавливаем пакет `lamp-luwak` в todos приложение

```bash
npm i --save lamp-luwak
# or
yarn add lamp-luwak
```

### Организация приложения

Код огранизован на доступные по всему приложению сервисы, что бы можно было в любом месте любого React компонента получить инстанцию какого-угодно сервиса и либо вывести его данные, либо инициировать какое-либо действие с этим сервисом.

Сервис - это инстанция класса или функции-фабрики, представленная в единственном экземпляре, создаваемая при первом обращении и остающаяся до конца работы приложения.
Описывается ли сервис с помощью класса или функции-фабрики, внутри себя он имеет свойство `store`.

```typescript
class Todos {
  store = [ /*...*/ ];
  // ...
```

При описании свойства `store` необходимо указать значние стора по умолчанию. Так же из этого значения будет автоматически выводиться тип стора для типизированных диалектов.
Далее сервис доступен либо из любого другого сервиса

```typescript
class TodoCounters {
  todo = provide(Todo);
  // ...
```

Здесь функция `provide` возвращает инстанцию сервиса, принимая в качестве аргумента класс сервиса, в данном примере `Todo`.
Либо из любого React компонента

```typescript
const List = () => {
  const todo = useProvide(Todo);
  // ...
};
```

Идентификатором сервиса является его класс или функция-фабрика. В React компонент инстанция необходимого сервиса поставляется через метод `useProvide`, единственный аргумент которого - класс или функция-фабрика сервиса, в данном примере `Todo`. При таком способе получения сервиса в компоненте, компонент будет автоматически подписан на изменение стора этого сервиса.

Стор - это иммутабельная структура данных, для модификации стора используется обычное присвоение, потому что свойство `store` после инстанциации через `provide` или `useProvide` становиться геттер/сеттером и если при присвоении приходит отличное от предыдущего значение, то все подписчики на изменение стора получат уведомление с новым и старым значением стора.

Таким образом в примере выше, компонент List будет перерисовываться каждый раз когда будет изменяться значение стора сервиса `Todo`.

### Структура

Положим сервисы в папку `services`, а React компоненты в папку `components` и получим следующую структуру нашего приложения.

```
srс/
  components/       // Директория с React компонентами
    Counters.tsx    // Счетчики активных и выполненных задач
    Input.tsx       // Форма для добавления новой задачи
    Task.tsx        // Задача
    List.tsx        // Список задач
  services/         // Директория с сервисами
    Todo/
      Task.ts       // Задача
    Todo.ts         // Сервис списка задач
    TodoCounters.ts // Сервис счетчиков активных и выполненных задач
  App.tsx           // Компонент приложения
```

### Сервисы

Для реализации нашей задачи нам потребуется комбинация из 2-х сервисов. Это будет
- `Todo` - в его сторе будет массив экземпляров задач, и у него будет метод `add` для добавления новой задачи;
- `TodoCounters` - в его сторе будет вычисленные счётчики активных задач и завершённых.

Далее необходимо подробнее рассмотреть структуру стора `Todo` сервиса, это массив из экземпляров класса `Task`, т.е. это массив из других сторов. Стоит упомянуть сразу, что никакой "подписки" на вложенные сторы не происходит, это просто допустимое значение. Экземпляр класса со стором может быть вложен в другой стор наравне с другими типами, такими как Date, Map, Set. (с SSR) Это сделано для оптимизации глубоких вложенных структур данных, что бы локализовывать области обновления UI. А так же для стилистики описания логики ближе к данным, к ней относящимся. Например, в нашем примере в `Task` содержиться метод `toggle`, который меняет статус завершённости задачи.

Для того, что бы создать экземпляр класса `Task` со стором и возможностью быть источником уведомлений об изменении стора, необходимо использовать функцию `create`, принимающую первым аргументом класс или функцию-фабрику, а последующие аргументы будут проброшены в конструктор класса или в аргументы функции-фабрики соответственно.

```typescript
// Todo.ts
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
```

Создаём сервис `Todo`. В `store` по умолчанию положим два экземпляра задачи `Task`, создав их через функцию `create`. И добавляем метод `add`, который пересоздаёт стор, добавляя в него новый экземпляр задачи `Task`. В качестве уникального `id`, использовано значение вызова `Date.now`.

```typescript
// Todo/Task.ts
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
```

Создаём класс `Task`, описывающий задачу. Описанная структура стора декларирует соответствующий формат данных, `id` задачи, её заголовок `label` и статус завершенности `completed`. Описываем метод `toggle`, что меняет значение статуса завершенности задачи на противоположное, используя функцию `modify`, что позволяет иммутабельно модифицировать стор, используя синтаксис с присвоением.

Кроме описания класса присутствует ещё и описание экшена `TaskChanged` созданного вызовом функции `action`.

Экшен - это функция, которая может быть источником уведомлений для подписчиков. Экшен можно вызывать как функцию, но рекоммендованный подход использовать функцию `dispatch` библиотеки `lamp-luwak`, для вызова.

В коде выше, мы подписываем экшен на обновление стора, таким образом `TaskChanged` становится источником уведомлений об изменении стора каждого экземпляра класса `Task`. Подписка происходит посредством вызова функции `subscribe`, первый аргумент это источник уведомлений об изменении стора, т.е. текущий объект, а второй функция обработчик, что будет вызвана каждый раз при каждом обновлении стора. В данном случае в качестве функции обработчика выступает акшэн `TaskChanged`, мы тоже экспортируем его из файла.

```typescript
// TodoCounters.ts
import { provide, subscribe } from 'lamp-luwak';
import { Todo } from './Todo';
import { TaskChanged } from './Todo/Task';

export class TodoCounters {
  todo = provide(Todo);
  store = {
    active: 0,
    completed: 0
  }
  constructor() {
    subscribe(this.todo, this.calculate, this);
    subscribe(TaskChanged, this.calculate, this);
    this.calculate();
  }
  calculate() {
    const items = this.todo.store;
    const completed = items.filter(item => item.store.completed).length;
    const active = items.length - completed;
    this.store = { completed, active };
  }
}
```

Здесь мы создаём сервис `TodoCounters`, что является агрегатором. Он подписан на уведомления от 2-х источников:
- Сервис `Todo`, в его сторе храниться список задач и потому при добавлении или удалении задачи, с сервиса будет приходить уведомление.
- Экшен `TaskChanged` является источником уведомлений, что происходят при каждом изменении стора какого-либо из экземпляров `Task`, а это возможно только при изменении значения поля `completed`, так как остальные поля в нашем интерфейсе остаются неизменными на протяжении всего времени работы приложения.

При каждом уведомлении происходит пересчёт счетчиков активных и завершённых задач в методе `calculate`.

### Отображение

```typescript
// Task.tsx
import React, { FC } from 'react';
import { useSubscribe } from 'lamp-luwak';
import { Task as TaskClass } from '../services/Todo/Task';

export const Task: FC<{ task: TaskClass }> = ({ task }) => {
  useSubscribe(task);
  const { label, completed } = task.store;
  return (
    <li>
      <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={() => task.toggle()}
        />
      <span style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}>
        {label}
      </span>
    </li>
  )
};
```

```typescript
// List.tsx
import React from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo } from '../services/Todo';
import { Task } from './Task';

export const List = () => {
  const todo = useProvide(Todo);
  const items = todo.store;
  if (items.length === 0) return null;
  return (
    <ul>
      {items.map(item => (
        <Task task={item} key={item.store.id} />
      ))}
    </ul>
  )
};
```

```typescript
// Input.tsx
import React, { useState } from 'react';
import { useProvide } from 'lamp-luwak';
import { Todo } from '../services/Todo';

export const Input = () => {
  const [text, setText] = useState('Cook the lunch');
  const todo = useProvide(Todo);
  const add = () => {
    todo.add(text);
    setText('');
  };

  return (
    <>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        autoFocus
        onKeyDown={(event: any) => {
          if (event.keyCode === 13) add();
        }}
      />
      <button onClick={add}>Add</button>
    </>
  );
};
```

```typescript
// Counters.tsx
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
```

```typescript
// App.tsx
import React from 'react';
import { Input } from './components/Input';
import { List } from './components/List';
import { Counters } from './components/Counters';

const App = () => (
  <>
    <Input />
    <List />
    <Counters />
  </>
);

export default App;
```

### Домашнее задание

И, кому понравилось, приглашаю самостоятельно сделать удаление задачи из списка.

- Этот пример на [Codesandbox](https://codesandbox.io/s/github/betula/lamp-luwak-article-1/tree/master/todos), [Github](https://github.com/betula/lamp-luwak-article-1/tree/master/todos);
- С удалением задачи на [Codesandbox](https://codesandbox.io/s/github/betula/lamp-luwak-article-1/tree/master/todos-with-remove), [Github](https://github.com/betula/lamp-luwak-article-1/tree/master/todos-with-remove).

### В заключение



