import { Component, inject } from '@angular/core';
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

  message = this.notificationService.getMessage();
}
