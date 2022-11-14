import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationType } from './models/notification-type.model';
import { NotificationModel } from './models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationModel>();
  private keepAfterRouteChange = false;
  private dialogData = new Subject<object>();
  private dialogVisable = new Subject<boolean>();
  private dialogType = new Subject<string>();
  
  constructor() { }

  getNotification(): Observable<any> {
    return this.notificationSubject.asObservable();
}

success(message: string, keepAfterRouteChange = false) {
    this.notification(NotificationType.Success, message, keepAfterRouteChange);
}

error(message: string, keepAfterRouteChange = false) {
    this.notification(NotificationType.Error, message, keepAfterRouteChange);
}

info(message: string, keepAfterRouteChange = false) {
    this.notification(NotificationType.Info, message, keepAfterRouteChange);
}

warn(message: string, keepAfterRouteChange = false) {
    this.notification(NotificationType.Warning, message, keepAfterRouteChange);
}

notification(type: NotificationType, message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.notificationSubject.next(<NotificationModel>{ type: type, message: message });
}

clear() {
    // clear nitifications
    this.notificationSubject.next();
}

getMessage(): Observable<object> {
    return this.dialogData.asObservable();
 }

 getDialogStatus(): Observable<any> {
   return this.dialogVisable.asObservable();
 } 
 getDialogType(): Observable<any> {
    return this.dialogType.asObservable();
  }

 updateMessage(data: object) {
  this.dialogData.next(data);
}

showDialog(b: boolean, type: string) {
  this.dialogVisable.next(b);
  this.dialogType.next(type);
}

}
//comment
