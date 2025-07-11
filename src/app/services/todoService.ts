import {
  computed,
  inject,
  Injectable,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TodoModel, TodoModelBase } from '../models/todoModel';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from './filtersService';
import { NotificationService } from './notificationService';
import { format, addDays } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private filtersService = inject(FiltersService);
  private notificationService = inject(NotificationService);

  private todos = signal<TodoModel[]>([]);

  private loadDefaultTodos() {
    const now = new Date();

    this.todos.set([
      {
        title: 'test title 1',
        deadline: format(addDays(now, 5), 'yyyy-MM-dd'),
        isCompleted: false,
        id: uuidv4(),
      },
      {
        title: 'test title 2',
        deadline: format(addDays(now, 12), 'yyyy-MM-dd'),
        isCompleted: false,
        id: uuidv4(),
      },
      {
        title: 'test title 3',
        deadline: format(addDays(now, 2), 'yyyy-MM-dd'),
        isCompleted: true,
        id: uuidv4(),
      },
    ]);
  }

  constructor() {
    if (this.todos().length === 0) {
      this.loadDefaultTodos();
    }
  } // load some todos on init

  // ********* PUBLIC ********** //

  private filteredTodos: Signal<TodoModel[]> = computed(() => {
    const todos = this.todos();
    console.log(todos);

    this.sortTodos(todos);
    console.log('sorted: ', todos);

    const filter = this.filtersService.getActiveDefaultFilter();

    switch (filter) {
      case 'Mind':
        return todos;
      case 'Befejezett':
        return todos.filter((f) => f.isCompleted);
      case 'Függőben':
        return this.todos().filter((f) => !f.isCompleted);
      default:
        return todos;
    }
  });

  private sortTodos(todos: TodoModel[]): void {
    todos.sort((a, b) => {
      // make comparable number values from the date properties
      const deadlineA = new Date(a.deadline);
      const deadlineB = new Date(b.deadline);

      const timeStampA = deadlineA.getTime();
      const timeStampB = deadlineB.getTime();

      return timeStampA - timeStampB;
    });
  }

  // ************ Public *********** //

  getFilteredTodos(): Signal<TodoModel[]> {
    return this.filteredTodos;
  }

  addTodo(todo: TodoModelBase): void {
    const newTodo: TodoModel = { ...todo, id: uuidv4() };
    this.todos.set(this.todos().concat(newTodo));
    this.notificationService.setSuccessMessage(newTodo.title);
  }

  updateTodo(updatedTodo: TodoModel): void {
    this.todos.set(
      this.todos().map((t) => (t.id !== updatedTodo.id ? t : updatedTodo))
    );
  }

  toggleCompletion(id: string): void {
    if (this.todos().find((t) => t.id === id)) {
      this.todos.set(
        this.todos().map((t) =>
          t.id !== id ? t : { ...t, isCompleted: !t.isCompleted }
        )
      );
    }
  }

  deleteTodo(id: string): void {
    const deletedTodo = this.todos().find((t) => t.id === id);

    if (deletedTodo) {
      this.notificationService.setDeleteMessage(deletedTodo.title);
      this.todos.set(this.todos().filter((t) => t.id !== id));
    }
  }
}
