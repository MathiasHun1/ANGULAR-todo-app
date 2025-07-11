import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DefaultFilter } from '../models/filterModel';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private defaultFilters = signal<DefaultFilter[]>([
    { name: 'Mind', isActive: true, id: uuidv4() },
    { name: 'Befejezett', isActive: false, id: uuidv4() },
    { name: 'Függőben', isActive: false, id: uuidv4() },
  ]);

  private activeFilterName: Signal<string> = computed(() => {
    const activeFilter = this.defaultFilters().find((f) => f.isActive);
    if (activeFilter) {
      return activeFilter.name;
    }
    console.error('error in setting acive filter');
    return 'Mind';
  });

  // *********** Public ************ //

  getAllDefaultFilters(): WritableSignal<DefaultFilter[]> {
    return this.defaultFilters; // returns a signal to keep the service reactive
  }

  getActiveDefaultFilter(): string {
    return this.activeFilterName();
  }

  setFilterActive(id: string): void {
    const updatedFilters = this.defaultFilters().map((f) => {
      return f.id !== id ? { ...f, isActive: false } : { ...f, isActive: true };
    });
    this.defaultFilters.set(updatedFilters);
  }
}
