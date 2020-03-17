import { Component } from '@angular/core';
import { BaseService } from './base.service';
import { SensorModel } from './models/sensor.model';
import { Subscription } from 'rxjs';
import { NotificationModel } from './models/notification.model';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private base: BaseService, private notificationService: NotificationService) { }
  title = 'SensorManagment';
  sensor: Array<SensorModel> = new Array<SensorModel>();
  sensorsSub: Subscription;
  notificationSub: Subscription;
  isDialog: boolean = false;
  idUp: boolean = false;
  nameUp: boolean = false;

  ngOnInit() {
    this.sensorsSub = this.base.getAllSensors().subscribe(s => {
      this.sensor = s;
      this.base.jsonSub$.next(s);
    });

    this.base.getJson().subscribe(j => {
      this.sensor = j;
    });

    this.notificationSub = this.notificationService.getNotification().subscribe((notification: NotificationModel) => {
      if(notification) {
        if (!notification.type && notification.type === 1) {
          console.log(notification.type);
        }
        else {
          
        }
      }
  });
  }

  //unsubscribe subscriptions to avoid memory leaks
  ngOnDestroy() {
    this.sensorsSub.unsubscribe();
    this.notificationSub.unsubscribe();
  }

  cssClass(isDialog: boolean) {
    if (!isDialog) {
        return;
    }
    return 'g-dialog';
  }

  showInputDialog($event) {
    this.isDialog = $event;
    console.log("input dialog: " + this.isDialog);
  }

  sortById() {
    this.idUp = !this.idUp;
    if(this.idUp) {
      this.sensor.sort(this.base.compareId);
    }
    else {
      this.sensor.sort(this.base.compareId).reverse();
    }
    
  }

  sortByName() {
    this.nameUp = !this.nameUp;
    if(this.nameUp) {
      this.sensor.sort(this.base.compareName);
    }
    else {
      this.sensor.sort(this.base.compareName).reverse();
    }
    
  }

}
