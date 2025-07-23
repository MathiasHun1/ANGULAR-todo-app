import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { TodoModel } from "../models/todoModel";

@Injectable({
  providedIn: "root",
})
export class Apiservice {
  private readonly baseUrl = `${environment.apiUrl}/todos`;
  private readonly http = inject(HttpClient);

  getAllTodos(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(this.baseUrl);
  }

  addTodo(newTodo: TodoModel) {
    return this.http.post<TodoModel>(this.baseUrl, newTodo);
  }

  updateTodo(updatedTodo: TodoModel) {
    return this.http.put<TodoModel>(`${this.baseUrl}/${updatedTodo.id}`, updatedTodo);
  }

  deleteTodo(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteTodosByIds(ids: string[]) {
    // issues multiple delete requests and returns an array of observables
    return ids.map((id) => this.deleteTodo(id));
  }
}
