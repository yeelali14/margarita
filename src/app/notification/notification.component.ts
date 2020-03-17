import { Component, OnInit, HostListener } from '@angular/core';
import { NotificationService } from '../notification.service';
import { NotificationModel } from '../models/notification.model';
import { NotificationType } from '../models/notification-type.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationModel[];

  constructor(
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.notificationService.getNotification().subscribe((notification: NotificationModel) => {
      if (!notification) {
        this.notifications = [];
        return;
      }
      this.notifications = [];
      this.notifications.push(notification);
    });
  }

  cssClass(notification: NotificationModel) {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case NotificationType.Success:
        return 'alert alert-success';
      case NotificationType.Error:
        return 'error-rect error-text';
      case NotificationType.Info:
        return 'alert alert-info';
      case NotificationType.Warning:
        return 'alert alert-warning';
    }
  }

  removeNotification(notification: NotificationModel) {
    this.notifications = this.notifications.filter(x => x !== notification);
    this.notificationService.clear();
}



}
