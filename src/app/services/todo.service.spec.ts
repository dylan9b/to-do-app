import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../environment/environment';
import { TodoRequestModel } from '../todos/_model/request/todo-request.model';
import { UpdateTodoRequestModel } from '../todos/_model/request/update-todo-request.model';
import { CreateTodoRequestModel } from '../todos/_model/request/create-todo-request.model';
import { CreateTodoResponseModel } from '../todos/_model/response/create-todo-response.model';
import { UpdateTodoResponseModel } from '../todos/_model/response/update-todo-response.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch todos$', () => {
    const requestPayload: Partial<TodoRequestModel> = { searchTerm: 'Test' };

    const mockResponse = {
      results: [
        {
          id: '1',
          title: 'tEst',
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

    service.todos$(requestPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/get`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestPayload);
    req.flush(mockResponse);
  });

  it('should update a todo$', () => {
    const requestPayload: Partial<UpdateTodoRequestModel> = {
      id: '1',
      title: 'Updated',
    };

    const mockResponse: UpdateTodoResponseModel = {
      message: 'Todo updated successfully!',
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
        priorityId: '1',
        userId: '1',
      },
      id: '1',
    };

    service.updateTodo$(requestPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(requestPayload);
    req.flush(mockResponse);
  });

  it('should delete a todo$', () => {
    const todoId = '1';

    const mockResponse: CreateTodoResponseModel = {
      message: 'Todo deleted successfully!',
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
        priorityId: '1',
        userId: '1',
      },
      id: '1',
    };

    service.deleteTodo$(todoId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/delete`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: todoId });
    req.flush(mockResponse);
  });

  it('should create a todo$', () => {
    const mockResponse: CreateTodoResponseModel = {
      message: 'Todo successfully created!',
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
        priorityId: '1',
        userId: '1',
      },
      id: '1',
    };
    const requestPayload: CreateTodoRequestModel = { title: 'New Todo' };

    service.createTodo$(requestPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}todos/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(requestPayload);
    req.flush(mockResponse);
  });
});
