import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PriorityModel } from '../state/priority/priority.model';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PriorityService {
  private readonly _http = inject(HttpClient);

  priorities$(): Observable<PriorityModel[]> {
    return this._http
      .get<PriorityModel[]>(`${environment.apiUrl}priorities.php`)
      .pipe(
        map((response) => response),
        catchError((err) => {
          throw err;
        })
      );
  }
}
