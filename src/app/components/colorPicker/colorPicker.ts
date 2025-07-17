import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../services/filtersService';

@Component({
  selector: 'app-color-picker',
  templateUrl: './colorPicker.html',
  styleUrl: './colorPicker.scss',
  imports: [CommonModule],
})
export class ColorPicker {
  private filterService = inject(FiltersService);
  private categoryFilters = this.filterService.getAllCategoryFilters();
  private readonly defaultColors = [
    'red',
    'blue',
    'yellow',
    'pink',
    'green',
    'purple',
  ];

  protected listOpened = signal(false);
  pickedColor = signal('');
  // return colors that are available (not used by any category)
  protected readonly availableColors = computed(() => {
    const usedColors = this.categoryFilters().map((f) => f.color);
    const availableColors = this.defaultColors.filter(
      (color) => !usedColors.includes(color)
    );
    return availableColors;
  });

  toggleListOpened = () => this.listOpened.update((value) => !value);

  pickColor = (value: string) => {
    this.pickedColor.set(value);
    this.toggleListOpened();
  };
}
