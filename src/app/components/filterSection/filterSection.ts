import { Component, signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../services/filtersService';

@Component({
  selector: 'app-filter-section',
  imports: [CommonModule],
  templateUrl: './filterSection.html',
  styleUrls: ['./filterSection.scss'],
})
export class FilterSection {
  filterSevice = inject(FiltersService);
  defaultFilters = this.filterSevice.getAllDefaultFilters();
  categoryFilters = this.filterSevice.getAllCategoryFilters();
  isAddingCategory = signal(false);

  setFilterActive(id: string) {
    this.filterSevice.setFilterActive(id);
  }

  setCategoryActive(name: string) {
    this.filterSevice.setCategoryActive(name);
  }

  closeForm(event: Event) {
    const target = event.target as HTMLElement;

    if (!this.isAddingCategory && target.id !== 'add_category') {
      return;
    }

    if (target.parentElement) {
      if (!target.parentElement.classList.contains('add_category_container')) {
        this.isAddingCategory.set(false);
      }
    }
  }

  submitCategory(nameInput: string, colorInput: string) {
    console.log(colorInput);
    this.filterSevice.addCategory({
      name: nameInput.charAt(0).toUpperCase() + nameInput.slice(1),
      isActive: false,
      color: colorInput,
    });
  }
}
