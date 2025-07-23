import { inject, Injectable, Signal, signal } from "@angular/core";
import { TodoModel, TodoModelBase } from "../models/todoModel";
import { v4 as uuidv4 } from "uuid";
import { NotificationService } from "./notificationService";
import { HttpErrorResponse } from "@angular/common/http";
import { Apiservice } from "./apiService";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private notificationService = inject(NotificationService);
  private apiService = inject(Apiservice);

  // ************ Public *********** //
  loading = signal(true);
  todos = signal<TodoModel[]>([]);

  getAllTodos(): void {
    this.loading.set(true);
    this.apiService.getAllTodos().subscribe({
      next: (todos: TodoModel[]) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.setWarningMessage("Hiba történt a feladatok betöltése során");
        this.loading.set(false);
        console.error("Error fetching todos data: ", error);
      },
    });
  }

  addTodo(todo: TodoModelBase): void {
    const newTodo: TodoModel = {
      ...todo,
      id: uuidv4(),
    };
    this.apiService.addTodo(newTodo).subscribe({
      next: (response: TodoModel) => {
        this.todos.update((original) => [...original, response]);
        this.notificationService.setSuccessMessage("Feladat hozzáadva");
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.setWarningMessage("Hiba történt a feladat hozzáadása során");
        console.error("Error adding todo: ", error);
      },
    });
  }

  updateTodo(updatedTodo: TodoModel): void {
    this.apiService.updateTodo(updatedTodo).subscribe({
      next: () => {
        this.todos.update((original) =>
          original.map((t) => (t.id !== updatedTodo.id ? t : updatedTodo))
        );
        this.notificationService.setSuccessMessage("Feladat frissítve");
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.setWarningMessage("Hiba történt a feladat frissítése során");
        console.error("Error updating todo: ", error);
      },
    });
  }

  deleteTodo(id: string): void {
    const deletedTodo = this.todos().find((t) => t.id === id);
    if (!deletedTodo) return;

    this.apiService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update((original) => original.filter((t) => t.id !== id));
        this.notificationService.setWarningMessage(`"${deletedTodo.title}" feladat törölve`);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.setWarningMessage("Hiba történt a feladat törlése során");
        console.error("Error deleting todo: ", error);
      },
    });
  }

  deleteByCategory(categoryName: string): void {
    const todosToDelete = this.todos().filter((t) => t.category.name === categoryName);
    if (!todosToDelete.length) {
      return;
    }

    const deletedTodoIds = todosToDelete.map((t) => t.id);
    const deleteRequests = this.apiService.deleteTodosByIds(deletedTodoIds);

    // Use forkJoin to wait for all deletes, then update state once
    forkJoin(deleteRequests).subscribe({
      next: () => {
        this.todos.update((original) => original.filter((t) => t.category.name !== categoryName));
        this.notificationService.setWarningMessage(
          `"${categoryName}" kategóriájú feladatok törölve`
        );
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.setWarningMessage("Hiba történt a feladatok törlése során");
        console.error("Error deleting todos by category: ", error);
      },
    });
  }
}
