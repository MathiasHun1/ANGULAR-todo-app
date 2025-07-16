import {
  Component,
  signal,
  WritableSignal,
  inject,
  computed,
  output,
  input,
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
  private readonly markerColors = [
    'red',
    'blue',
    'yellow',
    'pink',
    'green',
    'purple',
  ];

  protected defaultFilters = this.filterSevice.getAllDefaultFilters();
  protected categoryFilters = this.filterSevice.getAllCategoryFilters();
  protected availableColors = computed(() => {
    const defaultColors = this.markerColors;
    const usedColors = this.categoryFilters().map((f) => f.color);
    const availableColors = defaultColors.filter(
      (color) => !usedColors.includes(color)
    );
    return availableColors;
  });
  formOpen = input();
  requestCloseForm = output<{ type: 'categoryForm' }>();
  requestOpenForm = output();

  setFilterActive(id: string) {
    this.filterSevice.setFilterActive(id);
  }

  setCategoryActive(name: string) {
    this.filterSevice.setCategoryActive(name);
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
}
