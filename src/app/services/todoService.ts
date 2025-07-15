import { computed, inject, Injectable, Signal, signal } from '@angular/core';
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
        title: 'Test title 1',
        deadline: format(addDays(now, 5), 'yyyy-MM-dd'),
        isCompleted: false,
        category: {
          name: 'Munka',
          color: 'red',
        },
        id: uuidv4(),
      },
      {
        title: 'test title 2',
        deadline: format(addDays(now, 12), 'yyyy-MM-dd'),
        isCompleted: false,
        category: {
          name: 'Hobbi',
          color: 'green',
        },
        id: uuidv4(),
      },
      {
        title: 'test title 3',
        deadline: format(addDays(now, 2), 'yyyy-MM-dd'),
        isCompleted: true,
        id: uuidv4(),
        category: {
          name: '',
          color: '',
        },
      },
    ]);
  }

  private filteredTodos: Signal<TodoModel[]> = computed(() => {
    const todos = this.todos();
    this.sortTodos(todos);

    const filter = this.filtersService.getActiveDefaultFilter();
    const categoryFilter = this.filtersService.getActivecategoryFilter();

    let filterdByDefaultTodos: TodoModel[];

    switch (filter) {
      case 'Mind':
        filterdByDefaultTodos = todos;
        break;
      case 'Befejezett':
        filterdByDefaultTodos = todos.filter((f) => f.isCompleted);
        break;
      case 'Függőben':
        filterdByDefaultTodos = this.todos().filter((f) => !f.isCompleted);
        break;
      default:
        filterdByDefaultTodos = todos;
        break;
    }

    // filter the todos and return the result
    if (categoryFilter === 'Mind') {
      return filterdByDefaultTodos;
    }

    return filterdByDefaultTodos.filter(
      (t) => t.category.name === categoryFilter
    );
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

  // load some todos here, because lifecycle hooks not available in services
  constructor() {
    if (this.todos().length === 0) {
      this.loadDefaultTodos();
    }
  }

  // ************ Public *********** //

  getFilteredTodos(): Signal<TodoModel[]> {
    return this.filteredTodos;
  }

  addTodo(todo: TodoModelBase): void {
    const newTodo: TodoModel = { ...todo, id: uuidv4() };
    this.todos.set(this.todos().concat(newTodo));
    this.notificationService.setSuccessMessage(
      `"${newTodo.title}" feladat hozzáadva`
    );
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
      this.notificationService.setWarningMessage(
        `"${deletedTodo.title}" feladat törölve`
      );
      this.todos.set(this.todos().filter((t) => t.id !== id));
    }
  }
}
