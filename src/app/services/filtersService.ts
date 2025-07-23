import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { DefaultFilter, CategoryFilter } from '../models/filterModel';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from './notificationService';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private readonly baseUrl = `${environment.apiUrl}/categoryFilters`;

  // ---- DEPENDENCIES ---- //
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);

  // ---- SIGNALS ---- //
  defaultFilters = signal<DefaultFilter[]>([
    { name: 'Mind', isActive: true, id: uuidv4() },
    { name: 'Befejezett', isActive: false, id: uuidv4() },
    { name: 'Függőben', isActive: false, id: uuidv4() },
  ]);

  categoryFilters = signal<CategoryFilter[]>([
    {
      name: 'Mind',
      isActive: true,
      color: '',
      id: '0',
    },
  ]);

  activeFilterName = computed<string>(() => {
    const activeFilter = this.defaultFilters().find((f) => f.isActive);
    if (activeFilter) {
      return activeFilter.name;
    }
    console.error('error in setting acive filter');
    return 'Mind';
  });

  activeCategoryName = computed<string>(() => {
    const activeCategory = this.categoryFilters().find((f) => f.isActive);
    if (activeCategory) {
      return activeCategory.name;
    }
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

  // *********** Category filters API ************ //
  getAllCategoryFilters(): void {
    const result$ = this.http.get(this.baseUrl) as Observable<CategoryFilter[]>;

    result$.subscribe((categories) => {
      this.categoryFilters.update((prev) => categories);
    });
  }

  getActivecategoryName(): string {
    return this.activeCategoryName();
  }

  addCategory(newCategory: Omit<CategoryFilter, 'id'>): void {
    if (
      this.categoryFilters().find(
        (c) => c.name.toLowerCase() === newCategory.name.toLowerCase()
      )
    ) {
      this.notificationService.setWarningMessage('Ez a kategória már létezik');
      return;
    }

    const newCAtegoryWithId = { ...newCategory, id: uuidv4() };

    const result$ = this.http.post(this.baseUrl, newCAtegoryWithId);
    result$.subscribe(() => {
      this.categoryFilters.update((prev) => prev.concat(newCAtegoryWithId));
    });
  }

  updateCategoryByName(name: string, data: CategoryFilter) {
    const categoryToUpdate = this.categoryFilters().find(
      (c) => c.name === name
    );

    if (!categoryToUpdate) {
      return;
    }

    const response$ = this.http.put(
      `${this.baseUrl}/${categoryToUpdate.id}`,
      data
    );

    response$.subscribe(() => {
      this.categoryFilters.update((prev) =>
        prev.map((c) => (c.id !== categoryToUpdate.id ? c : data))
      );
    });
  }

  deleteCategoryByName(name: string) {
    if (name === 'Mind') {
      console.log('A "Mind" nevű kategória nem törölhető');
      return;
    }

    const deletedCategory = this.categoryFilters().find((c) => c.name === name);
    if (!deletedCategory) {
      return;
    }

    const result$ = this.http.delete(`${this.baseUrl}/${deletedCategory.id}`);
    result$.subscribe(() => {
      const updatedCategories = this.categoryFilters().filter(
        (f) => f.id !== deletedCategory.id
      );
      this.categoryFilters.set(updatedCategories);
    });
  }

  getTestResult() {
    return 'ok';
  }
}
