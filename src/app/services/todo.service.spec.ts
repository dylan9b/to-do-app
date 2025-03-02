import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../environment/environment';
import { TodoRequestModel } from '../todos/_model/request/todo-request.model';
import { TodoModel } from '../todos/_model/todo.model';
import { UpdateTodoRequestModel } from '../todos/_model/request/update-todo-request.model';
import { UpdateTodoResponseModel } from '../todos/_model/response/update-todo-response.model';
import { DeleteTodoResponseModel } from '../todos/_model/response/delete-todo-respnse.model';
import { CreateTodoRequestModel } from '../todos/_model/request/create-todo-request.model';
import { CreateTodoResponseModel } from '../todos/_model/response/create-todo-response.model';
import { provideHttpClient } from '@angular/common/http';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch todos', () => {
    const mockTodos: TodoModel[] = [
      {
        id: '1',
        title: 'Test Todo',
        isCompleted: false,
        isPinned: false,
        order: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
    ];
    const request: Partial<TodoRequestModel> = { userId: '123' };

    service.todos$(request).subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/get`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTodos);
  });

  it('should update a todo', () => {
    const mockResponse: UpdateTodoResponseModel = {
      success: true,
      todo: {
        id: '1',
        title: 'Updated Todo',
        isCompleted: false,
        isPinned: false,
        order: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
      message: '',
      id: '',
    };
    const request: Partial<UpdateTodoRequestModel> = {
      id: '1',
      title: 'Updated Todo',
    };

    service.updateTodo$(request).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a todo', () => {
    const mockResponse: DeleteTodoResponseModel = {
      success: true,
      message: '',
      id: '',
    };
    const id = '1';

    service.deleteTodo$(id).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/delete`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should create a todo', () => {
    const mockResponse: CreateTodoResponseModel = {
      id: '1',
      success: true,
      todo: {
        id: '1',
        title: 'New Todo',
        isCompleted: false,
        isPinned: false,
        order: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
      message: '',
    };
    const request: CreateTodoRequestModel = {
      title: 'New Todo',
    };

    service.createTodo$(request).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
