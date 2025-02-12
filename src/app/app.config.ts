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
import { DatePipe } from '@angular/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from './environment/environment';
import { userReducer } from '@state/user/user-reducer';
import { UserEffects } from '@state/user/user-effects';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'yyyy-dd-MM',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideStore(
      { todos: todoReducer, priorities: priorityReducer, user: userReducer },
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
    provideEffects([TodoEffects, PriorityEffects, UserEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId, {
              oneTapEnabled: false,
              scopes: ['https://www.googleapis.com/auth/calendar'],
            }),
          },
        ],
        onError: (error) => {
          console.error('GOOGLE ERROR ***', error);
        },
      } as SocialAuthServiceConfig,
    },
    provideMomentDateAdapter(MY_FORMATS),
    DatePipe,
  ],
};
