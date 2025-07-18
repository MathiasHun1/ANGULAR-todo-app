import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { TodoModel, TodoModelBase } from '../models/todoModel';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from './filtersService';
import { NotificationService } from './notificationService';
import { createExapmleTodos } from '../shared/utilities';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly baseUrl = 'http://localhost:3000/todos';
  private http = inject(HttpClient);
  private filtersService = inject(FiltersService);
  private notificationService = inject(NotificationService);

  private todos = signal<TodoModel[]>([]);

  // not used now
  private loadDefaultTodos() {
    this.todos.set(createExapmleTodos());
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

  // ************ Public *********** //

  getAllTodos(): Observable<TodoModel[]> {
    return this.http.get(this.baseUrl) as Observable<TodoModel[]>;
  }

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

  deleteByCategory(categoryName: string) {
    const updatedTodoList = this.todos().filter(
      (t) => t.category.name !== categoryName
    );

    this.todos.set(updatedTodoList);
  }
}
