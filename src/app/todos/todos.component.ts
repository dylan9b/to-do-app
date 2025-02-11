import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllTodos } from '@state/todo/todo-selectors';
import { todosActions } from '@state/todo/todo-actions';
import { AppState } from '@state/app.state';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { priorityActions } from '@state/priority/priority.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { userActions } from '@state/user/user-actions';

@Component({
  selector: 'app-todos',
  imports: [FormsModule, MatButtonModule, MatIconModule, TodoItemComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialog = inject(MatDialog);
  private readonly _authService = inject(AuthService);
  private readonly _socialAuthService = inject(SocialAuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cookieService = inject(CookieService);

  readonly todosSignal = this._store.selectSignal(selectAllTodos);

  constructor() {
    this._store.dispatch(todosActions.load({ request: null }));
    this._store.dispatch(priorityActions.load());
  }

  ngOnInit(): void {
    if (this._cookieService.get(SessionStorageEnum.GOOGLE_ACCESS_TOKEN)) {
      this._store.dispatch(userActions.isGoogleLogin({ isGoogleLogin: true }));
    }
  }

  openCreateTodoModal(): void {
    import('./todo-modal/todo-modal.component').then((c) => {
      this._dialog.open(c.TodoModalComponent);
    });
  }

  logOut(): void {
    this._authService.logOut();
  }

  logOutFromGoogle(): void {
    from(this._socialAuthService.signOut())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._authService.logOut();
      });
  }
}
