import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { SensorModel } from 'src/app/models/sensor.model';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { BaseService } from 'src/app/base.service';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
  animations: [
    trigger('fasterFade', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(200)),
    ])
  ]
})
export class InputDialogComponent implements OnInit {
  @Output() isInputDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  isDialog: boolean = false;

  dialogSub: Subscription;
  formTypeSub: Subscription;
  sensorsSub: Subscription;

  submitted: boolean = false;
  sensorModel: SensorModel = new SensorModel;
  actionForm: FormGroup;
  isFormValid: Boolean = false;
  formType: string = '';
  isAddForm: boolean = false;
  isDeleteForm: boolean = false;
  isUpdateForm: boolean = false;
  sensors: Array<SensorModel>;

  constructor(private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private base: BaseService
    ) { }

  ngOnInit() {
    this.createAddForm();
    this.getData();

    this.dialogSub = this.notificationService.getDialogStatus().subscribe(isDialog => {
      this.isDialog = isDialog;
      this.isInputDialog.emit(true);
    });

    this.formTypeSub = this.notificationService.getDialogType().subscribe(d => {
      this.formType = d;
      switch (this.formType)
      {
        case "add":
          this.isAddForm = true;
          this.isUpdateForm = false;
          this.isDeleteForm = false;
          break;
        case "update":
          this.isUpdateForm = true;
          this.isAddForm = false;
          this.isDeleteForm = false;
          break;
        case "delete":
          this.isDeleteForm = true;
          this.isAddForm = false;
          this.isUpdateForm = false;
          break;
        case "":
          break;
      }
    })
  }

  ngOnDestroy() {
    this.dialogSub.unsubscribe();
    this.formTypeSub.unsubscribe();
    this.sensorsSub.unsubscribe();
  }

  createAddForm() {
        //create form
        this.actionForm = this.formBuilder.group({
          id: new FormControl('', [Validators.required,
            Validators.pattern(/^[0-9]+$/), 
            //Validators.pattern(/^-?(0|[1-9]\d*)?$/),
            Validators.maxLength(24),
            Validators.max(300),
            Validators.min(0)
          ]),
          name: new FormControl('', Validators.required)
        });
        //subscribe changes in the form
        this.actionForm.valueChanges.subscribe(f => {
          if(f) {
            if (this.actionForm.valid && f.ID && f.ID > 0 && f.Name && f.Name !== '' ) {
              this.isFormValid = true;
            }
            else {
              this.isFormValid = false;
            }
          }
        });
  }

  get f() {
    return this.actionForm.controls;
  }

  getData() {
  this.sensorsSub = this.base.getJson().subscribe(j => {
    this.sensors = j;
  });
  }

  changeOption(e) {
    var test = this.sensors.filter(i => i.ID == e.target.value);
    if(test) {
      this.sensorModel.Name = test["0"].Name;
      this.actionForm.controls.name.setValue(this.sensorModel.Name);
    }
    
    console.log(this.sensorModel);
  }

  //close window on escape as well
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.isDialog = false;
      this.isInputDialog.emit(false);
      //Clear model if we want to forget what we wrote before
      this.sensorModel = new SensorModel();
      this.actionForm.setValidators(null);
      this.actionForm.clearValidators();
      //formDirective.resetForm();
    }
  }

  closeDialog(formDirective: FormGroupDirective) {
    this.isDialog = false;
    this.isInputDialog.emit(false);
    //Clear model if we want to forget what we wrote before
    this.sensorModel = new SensorModel();
    this.actionForm.setValidators(null);
    formDirective.resetForm();
  }

  onSubmit(formDirective: FormGroupDirective) { 
    if (this.actionForm.invalid) {
      return;
    }
    switch (this.formType)
    {
      case "add":
        this.base.addSensor(this.sensorModel).subscribe(res => {
          this.base.getAllSensors().subscribe(j => {
            this.base.jsonSub$.next(j);
          })
        });
        break;
      case "update":
          this.base.updateSensor(this.sensorModel).subscribe(res => {
            this.base.getAllSensors().subscribe(j => {
              this.base.jsonSub$.next(j);
            })
          });
        break;
      case "delete":
          this.base.deleteSensor(this.sensorModel.ID).subscribe(res => {
            this.base.getAllSensors().subscribe(j => {
              this.base.jsonSub$.next(j);
            })
          });
        break;
      case "":
        break;
    }
    this.actionForm.setValidators(null);
    formDirective.resetForm();
    this.isDialog = false;
  }

}
