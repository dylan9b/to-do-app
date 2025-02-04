import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { todoReducer } from './state/todo/todo-reducers';
import { TodoEffects } from './state/todo/todo-effects';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { priorityReducer } from './state/priority/priority.reducer';
import { PriorityEffects } from './state/priority/priority.effects';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideStore(
      { todos: todoReducer, priorities: priorityReducer },
      {
        runtimeChecks: {
          strictActionImmutability: true,
          strictActionSerializability: true,
          // strictActionTypeUniqueness: true,
          strictStateSerializability: true,
          strictStateImmutability: true,
        },
      }
    ),
    provideEffects([TodoEffects, PriorityEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideNativeDateAdapter(),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    DatePipe,
  ],
};
