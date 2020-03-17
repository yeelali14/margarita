import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  url: string = environment.sensorUrl;
  jsonSub$ = new Subject();

  constructor(private http: HttpService) { }

  public getAllSensors() {
    return this.http.get(this.url).pipe((map(res => {
      return res;
    })));
  }

  public addSensor(data: any) {
    return this.http.post(this.url, data).pipe((map(res => {
      return res;
    })));
  }

  public updateSensor(data: any) {
    return this.http.put(this.url, data).pipe((map(res => {
      return res;
    })));
  }

  public deleteSensor(data: any) {
    return this.http.delete(this.url, data).pipe((map(res => {
      return res;
    })));
  }

  onJsonChange(data: any) {
    this.jsonSub$.next(data);
}

getJson(): Observable<any> {
  return this.jsonSub$.asObservable();
}

compareId( a, b ) {
  if ( a.ID < b.ID ){
    return -1;
  }
  if ( a.ID > b.ID ){
    return 1;
  }
  return 0;
}

compareName(a, b) {
  var nameA = a.Name.toUpperCase();
  var nameB = b.Name.toUpperCase();
  
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}


}
