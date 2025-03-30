import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CookieService } from 'ngx-cookie-service';
import { TodoItemComponent } from './todo-item.component';
import { TodoModel } from '../_model/todo.model';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { TodoService } from '@services/todo.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UpdateTodoResponseModel } from '../_model/response/update-todo-response.model';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let cookieService: CookieService;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  const initialState = { user: { isGoogleLogin: false } };

  beforeEach(async () => {
    todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'updateTodo$',
      'deleteTodo$',
    ]);

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideAnimations(),
        provideMockStore({ initialState }),
        CookieService,
        { provide: TodoService, useValue: todoServiceSpy },
      ],
    }).compileComponents();

    cookieService = TestBed.inject(CookieService);

    fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('todoSignal', { id: '1' });
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete todo', () => {
    const mockTodoId = '123';
    spyOn(component, 'todoSignal').and.returnValue({
      id: mockTodoId,
      isCompleted: false,
    } as TodoModel);
    spyOn(component.updatedTodoEvent, 'emit');

    const mockResponse: UpdateTodoResponseModel = {
      success: true,
      message: 'Todo updated successfully',
      id: mockTodoId,
      todo: {
        title: 'Sample Todo',
        isCompleted: true,
        dueDate: new Date(),
        isPinned: false,
        id: '',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
    };

    todoServiceSpy.updateTodo$.and.returnValue(of(mockResponse));

    component.completeTodo();

    expect(component.updatedTodoEvent.emit).toHaveBeenCalledWith(
      mockResponse.todo
    );
  });

  it('should remove todo', () => {
    const mockTodoId = '123';
    spyOn(component, 'todoSignal').and.returnValue({
      id: mockTodoId,
    } as TodoModel);
    spyOn(component.removeTodoEvent, 'emit');

    todoServiceSpy.deleteTodo$.and.returnValue(
      of({
        success: true,
        message: 'Success',
        id: '1',
      })
    );

    component.removeTodo();

    expect(component.removeTodoEvent.emit).toHaveBeenCalledWith('1');
  });

  it('should dispatch pinTodo action', () => {
    const mockTodoId = '123';
    spyOn(component, 'todoSignal').and.returnValue({
      id: mockTodoId,
      isPinned: false,
    } as TodoModel);
    spyOn(component.updatedTodoEvent, 'emit');

    const mockResponse: UpdateTodoResponseModel = {
      success: true,
      message: 'Todo updated successfully',
      id: mockTodoId,
      todo: {
        title: 'Sample Todo',
        isCompleted: false,
        dueDate: new Date(),
        isPinned: true,
        id: '',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
    };

    todoServiceSpy.updateTodo$.and.returnValue(of(mockResponse));

    component.completeTodo();

    expect(component.updatedTodoEvent.emit).toHaveBeenCalledWith(
      mockResponse.todo
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
