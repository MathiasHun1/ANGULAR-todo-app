import { Component, inject, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todoService';
import { TodoModel } from '../../models/todoModel';

@Component({
  selector: 'app-todos-section',
  templateUrl: './todoSection.html',
  styleUrl: './todoSection.scss',
  imports: [FormsModule],
})
export class TodoSection {
  todoService = inject(TodoService); // inject dependency
  todos: Signal<TodoModel[]> = this.todoService.getFilteredTodos();
  editedTodoId = signal<string>('');

  deleteItem(id: string): void {
    this.todoService.deleteTodo(id);
  }

  toggleItem(id: string) {
    this.todoService.toggleCompletion(id);
  }

  protected toggleEditState(id: string) {
    console.log(id);

    this.editedTodoId.set(id);
  }
}
