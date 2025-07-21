import { inject, Injectable, Signal, signal } from '@angular/core';
import { TodoModel, TodoModelBase } from '../models/todoModel';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from './notificationService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  // private readonly baseUrl = 'http://localhost:3000/todos';
  private readonly baseUrl = `${environment.apiUrl}/todos`;

  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  //initialize the data on first load
  constructor() {
    this.getAllTodos();
  }

  // ************ Public *********** //
  loading = signal(true);
  todos = signal<TodoModel[] | undefined>([]);

  getAllTodos(): void {
    const fethedTodos$ = this.http.get(this.baseUrl) as Observable<TodoModel[]>;
    fethedTodos$.subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
    });
  }

  addTodo(todo: TodoModelBase): void {
    const newTodo: TodoModel = { ...todo, id: uuidv4() };

    const result$ = this.http.post<TodoModel>(this.baseUrl, newTodo);
    result$.subscribe({
      next: (response) => {
        this.todos.update((original) => original?.concat(response));
        this.notificationService.setSuccessMessage('Feladat hozzáadva');
      }, // use pessimistic UI update
      error: () => {
        this.notificationService.setWarningMessage(
          'Hiba történt a feladat hozzáadás során'
        );
      },
    });
  }

  updateTodo(updatedTodo: TodoModel): void {
    const id = updatedTodo.id;

    const result$ = this.http.put(`${this.baseUrl}/${id}`, updatedTodo);
    result$.subscribe(() => {
      this.todos.set(
        this.todos()?.map((t) => (t.id !== updatedTodo.id ? t : updatedTodo))
      );
    });
  }

  deleteTodo(id: string): void {
    const deletedTodo = this.todos()?.find((t) => t.id === id);

    if (deletedTodo) {
      const result$ = this.http.delete(`${this.baseUrl}/${id}`);
      result$.subscribe(() => {
        this.todos.update((original) => original?.filter((t) => t.id !== id));
        this.notificationService.setWarningMessage(
          `"${deletedTodo.title}" feladat törölve`
        );
      });
    }
  }

  deleteByCategory(categoryName: string) {
    const todosToDelete = this.todos()?.filter(
      (t) => t.category.name === categoryName
    );

    if (!todosToDelete) {
      return;
    }

    // get the id's of todos we want to delete
    const deletedTodoIds = todosToDelete.map((t) => t.id);

    // delete the todos
    deletedTodoIds.forEach((id) => {
      const result$ = this.http.delete(`${this.baseUrl}/${id}`);
      result$.subscribe(() => {
        this.todos.update((original) => original?.filter((t) => t.id !== id));
      });
    });
  }
}
