import {
  Component,
  inject,
  Signal,
  signal,
  input,
  output,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todoService';
import { TodoModel } from '../../models/todoModel';
import { Form } from '../form/form';
import { format } from 'date-fns';

@Component({
  selector: 'app-todos-section',
  templateUrl: './todoSection.html',
  styleUrl: './todoSection.scss',
  imports: [FormsModule, Form, CommonModule],
})
export class TodoSection {
  todoService = inject(TodoService); // inject dependency

  renderedTodos: Signal<TodoModel[]> = this.todoService.getFilteredTodos();
  editedTodo = signal<TodoModel | null>(null);
  newTitle = signal<string>('');
  todoFormOpen = input<boolean>(false);
  itemFormOpen = input<string>('');

  constructor() {
    effect(() => {});
  }

  requestOpenTodoForm = output();
  requestCloseTodoForm = output();

  requestOpenItemForm = output<string>();
  requestCloseItemForm = output();

  deleteItem(id: string): void {
    this.todoService.deleteTodo(id);
  }

  toggleItem(id: string) {
    this.todoService.toggleCompletion(id);
  }

  openEditState(todo: TodoModel) {
    this.editedTodo.set(todo);
    console.log(`passed id: "${this.itemFormOpen()}"`);
    console.log(`in component id: "${this.editedTodo()?.id}"`);
  }

  updateTodo() {
    const editedTodo = this.editedTodo();

    if (editedTodo) {
      this.todoService.updateTodo({
        title: editedTodo.title,
        deadline: editedTodo.deadline,
        isCompleted: editedTodo.isCompleted,
        id: editedTodo.id,
        category: { ...editedTodo.category },
      });
    }
    this.editedTodo.set(null);
    this.requestCloseItemForm.emit();
  }

  editTitle(event: Event) {
    const target = event.target as HTMLInputElement;
    const editedTodo = this.editedTodo();
    if (editedTodo) {
      this.editedTodo.set({ ...editedTodo, title: target.value });
    }
  }

  editDeadline(event: Event) {
    const target = event.target as HTMLInputElement;
    const editedTodo = this.editedTodo();
    const newDeadline = target.value;

    if (editedTodo) {
      this.editedTodo.set({ ...editedTodo, deadline: newDeadline });
    }
  }
}
