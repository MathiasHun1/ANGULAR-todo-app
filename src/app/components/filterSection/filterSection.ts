import {
  Component,
  signal,
  WritableSignal,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../services/filtersService';
import { NotificationService } from '../../services/notificationService';
import { ColorPicker } from '../colorPicker/colorPicker';

@Component({
  selector: 'app-filter-section',
  imports: [CommonModule, ColorPicker],
  templateUrl: './filterSection.html',
  styleUrls: ['./filterSection.scss'],
})
export class FilterSection {
  private filterSevice = inject(FiltersService);
  private notificationService = inject(NotificationService);
  protected defaultFilters = this.filterSevice.getAllDefaultFilters();
  protected categoryFilters = this.filterSevice.getAllCategoryFilters();
  isAddingCategory = signal(false);
  private readonly markerColors = [
    'red',
    'blue',
    'yellow',
    'pink',
    'green',
    'purple',
  ];

  availableColors = computed(() => {
    const defaultColors = this.markerColors;
    const usedColors = this.categoryFilters().map((f) => f.color);

    const availableColors = defaultColors.filter(
      (color) => !usedColors.includes(color)
    );
    return availableColors;
  });

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

    this.isAddingCategory.set(false);
  }

  colorUsed(color: string) {
    console.log('runs');

    const element = this.categoryFilters().find((c) => c.color === color);

    console.log(element?.color);
  }
}
