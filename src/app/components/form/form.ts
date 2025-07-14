import { Component, signal, inject, output, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TodoService } from '../../services/todoService';
import { TodoModelBase } from '../../models/todoModel';
import { FiltersService } from '../../services/filtersService';

@Component({
  selector: 'app-form',
  templateUrl: './form.html',
  styleUrl: './form.scss',
  imports: [FormsModule],
})
export class Form {
  private readonly todoService = inject(TodoService);
  private readonly filterService = inject(FiltersService);
  readonly EMPTY_CATEGORY = { name: '', color: '' };

  requestCloseFrom = output(); //event to close the from without submission

  form = signal<TodoModelBase>({
    title: '',
    deadline: '',
    isCompleted: false,
    category: this.EMPTY_CATEGORY,
  });

  categories = this.filterService.getAllCategoryFilters();

  submitForm(form: NgForm): void {
    console.log(this.form());

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
    }

    this.requestCloseFrom.emit();
  }

  logChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    console.log(target.value);
  }
}
