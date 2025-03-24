import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodosComponent } from './todos.component';
import { StoreModule } from '@ngrx/store';
import { AuthService } from '@services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { todosActions } from '@state/todo/todo-actions';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let store: MockStore;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logOut']);
    const cookieServiceMock = jasmine.createSpyObj('CookieService', ['get']);

    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        provideMockStore(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: CookieService, useValue: cookieServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // to ignore errors related to missing components/templates
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch load action on init', () => {
    component.filters = null;

    spyOn(store, 'dispatch');
    component.filter(null);

    expect(store.dispatch).toHaveBeenCalledWith(
      todosActions.load({ request: null })
    );
  });

  it('should log out when logOut is called', () => {
    component.logOut();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
  });

  it('should set filters and dispatch load with updated filters when filter is called', () => {
    component.filters = { isCompleted: null, isPinned: false };

    // Mock the filters dispatch
    spyOn(store, 'dispatch');
    component.filter('pin');

    expect(component.filters?.isPinned).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(
      todosActions.load({ request: { isPinned: true } })
    );
  });
});
