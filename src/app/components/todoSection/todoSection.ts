import { Component, inject, Signal, signal } from '@angular/core';
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
  formOpen = signal<boolean>(false);

  deleteItem(id: string): void {
    this.todoService.deleteTodo(id);
  }

  toggleItem(id: string) {
    this.todoService.toggleCompletion(id);
  }

  openEditState(todo: TodoModel, event: MouseEvent) {
    event.stopPropagation();
    this.editedTodo.set(todo);

    this.newTitle.set(todo.title); // set the new title state
  }

  closeEditState(event: Event) {
    const target = event.target as HTMLElement;
    const editedTodo = this.editedTodo();

    // listen for "clicking outside"
    if (
      target.classList.contains('title_input') ||
      target.classList.contains('date_input')
    ) {
      return;
    } else {
      if (editedTodo) {
        this.saveTodo({
          title: editedTodo.title,
          deadline: editedTodo.deadline,
          isCompleted: editedTodo.isCompleted,
          id: editedTodo.id,
          category: { ...editedTodo.category },
        });
      }
      this.editedTodo.set(null);
    }
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

  saveTodo(todo: TodoModel) {
    this.todoService.updateTodo(todo);
  }

  openForm() {
    this.formOpen.set(true);
  }

  closeForm(event: Event | null) {
    if (event) {
      const target = event.target as HTMLElement;
      // listen for "clicking outside"
      if (target && target.classList.contains('form_container')) {
        return this.formOpen.set(false);
      }
      return;
    }

    this.formOpen.set(false);
  }
}
