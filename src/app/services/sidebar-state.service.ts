import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private isExpanded = new BehaviorSubject<boolean>(true);
  isExpanded$ = this.isExpanded.asObservable();

  toggleSidebar() {
    this.isExpanded.next(!this.isExpanded.value);
  }
}
