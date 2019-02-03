import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError as observableThrowError, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  public getData(Url: string): Observable<any> {
    return this.http
      .get(Url)
      .pipe(catchError(this.handleError));

  }
  private handleError(error: HttpErrorResponse) {
    console.log('HANDLE ERROR');
    return observableThrowError(error.message || 'Server Error');
  }
}
