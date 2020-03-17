import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};



@Injectable({
  providedIn: 'root'
})

export class HttpService {

  constructor(public http: HttpClient, private notificationService: NotificationService) { }

  get(url): Observable<any> {
    //let headers =  {headers: new  HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'})};
    return this.http.get(url, httpOptions)
      .pipe(map((response: Response) => {
        return response;
      }), catchError(err => {
        //this.notificationService.error('Oops! Something went wrong. Please try again.');
        return this.handleError(err);
      })
      );
  }


  post(url: string, body: any): Observable<any> {
    return this.http.post(url, body, httpOptions)
      .pipe(map((response: Response) => {
        this.notificationService.success('Sensor created successfully.');
        return response;
      }), catchError(err => {
        //this.notificationService.error('Oops! Something went wrong. Please try again.');
        return this.handleError(err);
      })
      );
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put(url, body, httpOptions)
      .pipe(map((response: Response) => {
        this.notificationService.success('Sensor updated successfully.');
        return response;
      }), catchError(err => {
        return this.handleError(err);
      })
      );
  }

  delete(url: string, body: any): Observable<any> {
    const httpOptions2 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    };
    return this.http.delete(url, httpOptions2)
      .pipe(map((response: Response) => {
        this.notificationService.success('Sensor deleted successfully.');
        return response;
      }), catchError(err => {
        return this.handleError(err);
      })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status != 200) {
      this.notificationService.error('Something bad happened; please try again later.');
    }
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

}
