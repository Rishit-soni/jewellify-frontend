import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  show(): void {
    this.requestCount++;
    console.log('LoadingService.show() - requestCount:', this.requestCount);
    if (this.requestCount === 1) {
      console.log('LoadingService: Setting loading to TRUE');
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.requestCount--;
    console.log('LoadingService.hide() - requestCount:', this.requestCount);
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      console.log('LoadingService: Setting loading to FALSE');
      // Small delay to ensure smooth transition
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, 100);
    }
  }

  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }
}
