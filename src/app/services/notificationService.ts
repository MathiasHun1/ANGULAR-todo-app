import { Injectable, Signal, signal } from '@angular/core';
import { PopupMessage } from '../models/nitificationModel';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private currentMessage = signal<PopupMessage | null>(null);

  setSuccessMessage(todoTitle: string): void {
    this.currentMessage.set({
      message: `"${todoTitle}" című feladat hozzáadva`,
      type: 'added',
    });

    setTimeout(() => {
      this.currentMessage.set(null);
    }, 2000);
  }

  setDeleteMessage(todoTitle: string): void {
    this.currentMessage.set({
      message: `"${todoTitle}" című feladat törölve`,
      type: 'deleted',
    });

    setTimeout(() => {
      this.currentMessage.set(null);
    }, 2000);
  }

  getMessage(): Signal<PopupMessage | null> {
    return this.currentMessage;
  }
}
