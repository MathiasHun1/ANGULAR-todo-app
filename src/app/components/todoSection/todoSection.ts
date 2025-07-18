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
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todos-section',
  templateUrl: './todoSection.html',
  styleUrl: './todoSection.scss',
  imports: [FormsModule, Form, CommonModule],
})
export class TodoSection {
  todoService = inject(TodoService); // inject dependency

  fetchedTodos$ = this.todoService.getAllTodos();
  renderedTodos: Signal<TodoModel[] | undefined> = toSignal(
    inject(TodoService).getAllTodos()
  );
  editedTodo = signal<TodoModel | null>(null);
  newTitle = signal<string>('');

  constructor() {
    effect(() => console.log(this.renderedTodos()));
  }

  todoFormOpen = input<boolean>(false);
  itemFormOpen = input<string>('');

  requestOpenTodoForm = output();
  requestCloseTodoForm = output();
  requestOpenItemForm = output<string>();
  requestCloseItemForm = output();

  // --- Public methods --- //
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
