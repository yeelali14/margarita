import { Component, OnInit } from '@angular/core';
import { SensorModel } from 'src/app/models/sensor.model';
import { BaseService } from 'src/app/base.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showActionMenu: boolean = false;

  constructor(private base: BaseService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  actionClick(type) {
    this.notificationService.showDialog(true, type);
  }

}
