import { Component, inject, output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../services/filtersService';
import { NotificationService } from '../../services/notificationService';
import { TodoService } from '../../services/todoService';
import { ColorPicker } from '../colorPicker/colorPicker';

@Component({
  selector: 'app-filter-section',
  imports: [CommonModule, ColorPicker],
  templateUrl: './filterSection.html',
  styleUrls: ['./filterSection.scss'],
})
export class FilterSection implements OnInit {
  private todoService = inject(TodoService);
  private filterSevice = inject(FiltersService);
  private notificationService = inject(NotificationService);

  protected defaultFilters = this.filterSevice.getAllDefaultFilters();
  protected categoryFilters = this.filterSevice.categoryFilters;

  formOpen = input();
  requestCloseForm = output<{ type: 'categoryForm' }>();
  requestOpenForm = output();

  ngOnInit(): void {
    this.filterSevice.getAllCategoryFilters();
  }

  setFilterActive(id: string) {
    this.filterSevice.setFilterActive(id);
  }

  setCategoryActive(name: string, event?: MouseEvent) {
    // return if delete button is clicked
    const target = event?.target as HTMLElement | undefined;
    if (target?.closest('[data-delete-button]')) {
      return;
    }

    const selectedFilter = this.categoryFilters().find((c) => c.name === name);
    if (!selectedFilter) {
      return;
    }

    this.categoryFilters().forEach((c) => {
      if (c.name !== name) {
        this.filterSevice.updateCategoryByName(c.name, {
          ...c,
          isActive: false,
        }); // unselect
      } else {
        this.filterSevice.updateCategoryByName(c.name, {
          ...c,
          isActive: true,
        }); // select
      }
    });
  }

  submitCategory(nameInput: string, colorInput: string) {
    if (!nameInput) {
      this.notificationService.setWarningMessage('Adj meg egy kategória-nevet');
      return;
    }

    if (!colorInput) {
      this.notificationService.setWarningMessage('Adj hozzá színt!');
      return;
    }

    this.filterSevice.addCategory({
      name: nameInput.charAt(0).toUpperCase() + nameInput.slice(1),
      isActive: false,
      color: colorInput,
    });

    this.requestCloseForm.emit({ type: 'categoryForm' });
  }

  deleteCategory(name: string) {
    const answer = confirm(
      'Bitosan törlöd a kategóriát, és a hozzá tartozó feladatokat?'
    );
    if (!answer) {
      return;
    }

    this.todoService.deleteByCategory(name);
    this.setCategoryActive('Mind');
    this.filterSevice.deleteCategoryByName(name);
  }
}
