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

  setFilterActive(id: string) {
    this.filterSevice.setFilterActive(id);
  }

  protected categories = signal([]);
}
