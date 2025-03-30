import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosComponent } from './todos.component';
import { AuthService } from '@services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { TodoService } from '@services/todo.service';
import { AppState } from '@state/app.state';
import { provideMockStore } from '@ngrx/store/testing';
import { selectFilters } from '@state/todo/todo-selectors';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { environment } from '../environment/environment';
import { of } from 'rxjs';
import { computed } from '@angular/core';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let storeSpy: jasmine.SpyObj<Store<AppState>>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logOut']);
    cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'selectSignal']);
    storeSpy.selectSignal.and.returnValue(computed(() => ({ request: null })));
    todoServiceSpy = jasmine.createSpyObj('TodoService', ['todos$']);

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [
            {
              selector: selectFilters,
              value: {
                request: null,
              },
            },
          ],
        }),
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
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Store, useValue: storeSpy },
        { provide: TodoService, useValue: todoServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize todos on ngOnInit', () => {
    const mockResponse = {
      results: [
        {
          id: '1',
          title: 'Test Todo',
          isCompleted: false,
          isPinned: false,
          order: 0,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          priorityId: '1',
          userId: '1',
        },
      ],
      total: 1,
    };
    todoServiceSpy.todos$.and.returnValue(of(mockResponse));
    fixture.detectChanges();
    cookieServiceSpy.get.and.returnValue('');

    component.ngOnInit();

    expect(todoServiceSpy.todos$).toHaveBeenCalledWith({ limit: 5, offset: 0 });
    expect(component.todosSignal()).toEqual(mockResponse.results);
    expect(component.totalTodosSignal()).toEqual(mockResponse.total);
  });

  it('should log out the user', () => {
    component.logOut();

    expect(authServiceSpy.logOut).toHaveBeenCalled();
  });

  it('should update a todo item', () => {
    const mockTodo = {
      id: '1',
      isCompleted: false,
      title: 'Updated Todo',
      isPinned: false,
      order: 0,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      priorityId: '1',
      userId: '1',
    };
    component.todosSignal.set([
      {
        id: '1',
        isCompleted: true,
        title: '',
        isPinned: false,
        order: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
    ]);

    component.updateTodo(mockTodo);

    expect(component.todosSignal()).toContain(mockTodo);
  });

  it('should remove a todo item', () => {
    component.todosSignal.set([
      {
        id: '1',
        title: 'Sample Todo',
        isCompleted: false,
        isPinned: false,
        order: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '1',
        userId: '1',
      },
    ]);
    component.totalTodosSignal.set(1);

    component.removeTodo('1');

    expect(component.todosSignal()).toEqual([]);
    expect(component.totalTodosSignal()).toBe(0);
  });

  it('should load more todos', () => {
    const mockResponse = {
      results: [
        {
          id: '2',
          title: 'Another Todo',
          isCompleted: false,
          isPinned: false,
          order: 1,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          priorityId: '2',
          userId: '1',
        },
      ],
      total: 2,
    };
    todoServiceSpy.todos$.and.returnValue(of(mockResponse));
    component.offset = 5;

    component.loadMore();

    expect(todoServiceSpy.todos$).toHaveBeenCalledWith({
      limit: 5,
      offset: 5,
    });
  });
});
