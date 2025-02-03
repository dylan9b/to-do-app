import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TodoRequestModel } from '../todos/_model/request/todo-request.model';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { TodoModel } from '../todos/_model/todo.model';
import { DeleteTodoResponseModel } from '../todos/_model/response/delete-todo-respnse.model';
import { UpdateTodoRequestModel } from '../todos/_model/request/update-todo-request.model';
import { UpdateTodoResponseModel } from '../todos/_model/response/update-todo-response.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly _http = inject(HttpClient);

  todos$(request?: TodoRequestModel | null): Observable<TodoModel[]> {
    return this._http
      .post<TodoModel[]>(`${environment.apiUrl}todos.php`, {
        ...request,
      })
      .pipe(
        map((response) => response),
        catchError((err) => {
          throw err;
        })
      );
  }

  updateTodo$(
    request: Partial<UpdateTodoRequestModel>
  ): Observable<UpdateTodoResponseModel> {
    return this._http
      .put<UpdateTodoResponseModel>(`${environment.apiUrl}update.php`, {
        ...request,
      })
      .pipe(
        map((response) => response),
        catchError((err) => {
          throw err;
        })
      );
  }

  deleteTodo$(id: string): Observable<DeleteTodoResponseModel> {
    return this._http
      .delete<DeleteTodoResponseModel>(`${environment.apiUrl}delete.php`, {
        body: { id },
      })
      .pipe(
        map((response) => response),
        catchError((err) => {
          throw err;
        })
      );
  }
}
