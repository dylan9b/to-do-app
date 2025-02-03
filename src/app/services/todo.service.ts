import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TodoRequestModel } from '../todos/_model/request/todo-request.model';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { TodoModel } from '../todos/_model/todo.model';

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
        map((response) => {
          return response;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }
}
