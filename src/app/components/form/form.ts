import { Component, signal, inject, output, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TodoService } from '../../services/todoService';
import { TodoModelBase } from '../../models/todoModel';

@Component({
  selector: 'app-form',
  templateUrl: './form.html',
  styleUrl: './form.scss',
  imports: [FormsModule],
})
export class Form {
  private readonly todoService = inject(TodoService);

  requestCloseFrom = output();

  form = signal<TodoModelBase>({
    title: '',
    deadline: '',
    isCompleted: false,
  });

  submitForm(form: NgForm): void {
    if (form.valid) {
      this.todoService.addTodo(this.form());

      this.form.set({
        title: '',
        deadline: '',
        isCompleted: false,
      });
    }

    this.requestCloseFrom.emit();
  }
}
