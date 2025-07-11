import { Component, signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form } from '../form/form';
import { TodoModelBase } from '../../models/todoModel';
import { FiltersService } from '../../services/filtersService';

@Component({
  selector: 'app-filter-section',
  imports: [Form, CommonModule],
  templateUrl: './filterSection.html',
  styleUrls: ['./filterSection.scss'],
})
export class FilterSection {
  filterSevice = inject(FiltersService);
  defaultFilters = this.filterSevice.getAllDefaultFilters();

  setFilterActive(id: string) {
    this.filterSevice.setFilterActive(id);
  }

  protected categories = signal([]);

  protected submissionDetector(event: TodoModelBase): void {
    console.log('form submission detected from the parent');
    console.log('submitted data: ', event);
  }
}
