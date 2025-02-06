import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  setItemSessionStorage(key: string, value: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(key, value);
    }
  }

  removeItemSessionStorage(key: string): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(key);
    }
  }

  getItemSessionStorage(key: string): void {
    if (this.isBrowser) {
      sessionStorage.getItem(key);
    }
  }
}
