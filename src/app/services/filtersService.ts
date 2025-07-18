import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DefaultFilter, CategoryFilter } from '../models/filterModel';
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

  private categoryFilters = signal<CategoryFilter[]>([
    {
      name: 'Mind',
      isActive: true,
      color: '',
    },
    {
      name: 'Hobbi',
      isActive: false,
      color: 'green',
    },
    {
      name: 'Munka',
      isActive: false,
      color: 'red',
    },
  ]);

  private activeFilterName = computed<string>(() => {
    const activeFilter = this.defaultFilters().find((f) => f.isActive);
    if (activeFilter) {
      return activeFilter.name;
    }
    console.error('error in setting acive filter');
    return 'Mind';
  });

  private activeCategoryName = computed<string>(() => {
    const activeCategory = this.categoryFilters().find((f) => f.isActive);
    if (activeCategory) {
      return activeCategory.name;
    }
    console.error('error in setting acive category');
    return 'Mind';
  });

  // *********** Default Filters API ************ //
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

  // *********** Categories API ************ //
  getAllCategoryFilters(): WritableSignal<CategoryFilter[]> {
    return this.categoryFilters;
  }

  getActivecategoryFilter(): string {
    return this.activeCategoryName();
  }

  setCategoryActive(name: string) {
    const updatedCategories = this.categoryFilters().map((f) => {
      return f.name !== name
        ? { ...f, isActive: false }
        : { ...f, isActive: true };
    });
    this.categoryFilters.set(updatedCategories);
  }

  addCategory(category: CategoryFilter): void {
    if (
      this.categoryFilters().find(
        (c) => c.name.toLowerCase() === category.name.toLowerCase()
      )
    ) {
      console.error('category already exists!');
      return;
    }

    const updatedCategories = this.categoryFilters().concat(category);
    this.categoryFilters.set(updatedCategories);
  }

  deleteCategory(name: string) {
    if (name === 'Mind') {
      console.log('A "Mind" nevű szűrő nem törölhető');
      return;
    }

    const updatedCategories = this.categoryFilters().filter(
      (f) => f.name !== name
    );
    this.categoryFilters.set(updatedCategories);
  }
}
