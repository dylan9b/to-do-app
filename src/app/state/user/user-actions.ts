import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const userActions = createActionGroup({
  source: 'User',
  events: {
    Logout: emptyProps(),
    'Logout Success': props<{ isLoggedOut: boolean }>(),
    'Logout Failure': props<{ error: string }>(),

    isGoogleLogin: props<{ isGoogleLogin: boolean }>(),
  },
});
