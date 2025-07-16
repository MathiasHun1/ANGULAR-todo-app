import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FilterSection } from './components/filterSection/filterSection';
import { TodoSection } from './components/todoSection/todoSection';
import { NotificationService } from './services/notificationService';

@Component({
  selector: 'app-root',
  imports: [FilterSection, TodoSection, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'todo';
  notificationService = inject(NotificationService);
  // store form states at app-level
  categoryFormOpen = signal(false);
  todoFormOpen = signal(false);
  itemFormOpen = signal('');

  message = this.notificationService.getMessage();

  openItemForm(value: string) {
    this.itemFormOpen.set(value);
    console.log(`id from root: ${this.itemFormOpen()}`);
  }

  //form-close handlers for "click outside" situation
  handleClickOutsideForm(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.categoryFormOpen()) {
      if (!target.closest('[data-form-container]')) {
        this.categoryFormOpen.set(false);
      }
    }

    if (this.todoFormOpen()) {
      if (
        !target.closest('[data-form-container]') &&
        !target.classList.contains('open_form')
      ) {
        this.todoFormOpen.set(false);
      }
    }

    if (this.itemFormOpen()) {
      const ancestorElement = target.closest('[data-item-container]');

      if (
        ancestorElement &&
        ancestorElement.classList.contains(this.itemFormOpen())
      ) {
        return;
      }
      this.itemFormOpen.set('');
    }
  }

  logger() {
    'runs';
  }
}
