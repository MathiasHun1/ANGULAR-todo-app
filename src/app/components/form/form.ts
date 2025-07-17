import { Component, signal, inject, output, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TodoService } from '../../services/todoService';
import { TodoModelBase } from '../../models/todoModel';
import { FiltersService } from '../../services/filtersService';
import { NotificationService } from '../../services/notificationService';

@Component({
  selector: 'app-form',
  templateUrl: './form.html',
  styleUrl: './form.scss',
  imports: [FormsModule],
})
export class Form {
  private readonly todoService = inject(TodoService);
  private readonly filterService = inject(FiltersService);
  private readonly notificationService = inject(NotificationService);
  readonly EMPTY_CATEGORY = { name: '', color: '' };

  protected form = signal<TodoModelBase>({
    title: '',
    deadline: '',
    isCompleted: false,
    category: this.EMPTY_CATEGORY,
  });
  formOpen = input<boolean>(false);
  requestOpenForm = output();
  requestCloseForm = output();
  categories = this.filterService.getAllCategoryFilters();

  submitForm(form: NgForm): void {
    if (!this.form().title) {
      this.notificationService.setWarningMessage('Add meg a feladat nevét');
      return;
    }

    if (!this.form().deadline) {
      this.notificationService.setWarningMessage('Add meg a határidőt');
      return;
    }

    if (form.valid) {
      this.todoService.addTodo(this.form());

      this.form.set({
        title: '',
        deadline: '',
        isCompleted: false,
        category: {
          name: '',
          color: '',
        },
      });

      this.requestCloseForm.emit();
    }
  }
}
