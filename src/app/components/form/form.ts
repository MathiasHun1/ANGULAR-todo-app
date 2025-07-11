import { Component, signal, inject, output } from '@angular/core';
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

  form = signal<TodoModelBase>({
    title: '',
    deadline: '',
    isCompleted: false,
  });

  formSubmitted = output<TodoModelBase>();

  submitForm(form: NgForm): void {
    if (form.valid) {
      this.todoService.addTodo(this.form());
      this.formSubmitted.emit(this.form());

      this.form.set({
        title: '',
        deadline: '',
        isCompleted: false,
      });
    }
  }
}
