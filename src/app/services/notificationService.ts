import { Injectable, Signal, signal } from '@angular/core';
import { PopupMessage } from '../models/nitificationModel';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private currentMessage = signal<PopupMessage | null>(null);

  setSuccessMessage(text: string): void {
    this.currentMessage.set({
      message: text,
      type: 'added',
    });

    setTimeout(() => {
      this.currentMessage.set(null);
    }, 5000);
  }

  setWarningMessage(text: string): void {
    this.currentMessage.set({
      message: text,
      type: 'deleted',
    });

    setTimeout(() => {
      this.currentMessage.set(null);
    }, 4000);
  }

  getMessage(): Signal<PopupMessage | null> {
    return this.currentMessage;
  }
}
