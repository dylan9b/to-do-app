import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CookieService } from 'ngx-cookie-service';
import { TodoItemComponent } from './todo-item.component';
import { todosActions } from '../../state/todo/todo-actions';
import { TodoModel } from '../_model/todo.model';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let store: MockStore;
  let cookieService: CookieService;

  const initialState = { user: { isGoogleLogin: false } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideMockStore({ initialState }),
        CookieService,
      ],
    });

    store = TestBed.inject(MockStore);
    cookieService = TestBed.inject(CookieService);
    component = TestBed.createComponent(TodoItemComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch completeTodo action', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'todoSignal').and.returnValue({
      id: '1',
      isCompleted: false,
    } as TodoModel);

    component.completeTodo();

    expect(store.dispatch).toHaveBeenCalledWith(
      todosActions.update({ request: { id: '1', isCompleted: true } })
    );
  });

  it('should dispatch removeTodo action', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'todoSignal').and.returnValue({ id: '1' } as TodoModel);

    component.removeTodo();

    expect(store.dispatch).toHaveBeenCalledWith(
      todosActions.delete({ id: '1' })
    );
  });

  it('should dispatch pinTodo action', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'todoSignal').and.returnValue({
      id: '1',
      isPinned: false,
    } as TodoModel);

    component.pinTodo();

    expect(store.dispatch).toHaveBeenCalledWith(
      todosActions.update({ request: { id: '1', isPinned: true } })
    );
  });

  it('should create Google event', () => {
    spyOn(cookieService, 'get').and.returnValue('fake-token');
    spyOn(component['_httpClient'], 'post').and.returnValue(of({}));

    spyOn(component, 'todoSignal').and.returnValue({
      id: '1',
      title: 'Test Todo',
      dueDate: '2023-10-10',
    } as unknown as TodoModel);

    component.createGoogleEvent();

    expect(component['_httpClient'].post).toHaveBeenCalled();
  });
});
