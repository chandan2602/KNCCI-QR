import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-event-request',
  templateUrl: './event-request.component.html',
  styleUrls: ['./event-request.component.css']
})
export class EventRequestComponent extends BaseComponent implements OnInit {
  startTime: string = null;
  Date: any;
  samvaad_user: string = sessionStorage.getItem('SU');
  loginData: any = {};
  courses: Array<any> = [];
  private readonly onDestroy = new Subscription();
  constructor(CommonService: CommonService, toastr: ToastrService, private route: Router) {
    super(CommonService, toastr);
    this.getCourses();
    this.loadGrid();
    if (!this.samvaad_user) {
      toastr.warning("You Don't have Samaad ");
      sessionStorage.clear();
      this.route.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (!this.samvaad_user) return;
    this.samvaadLogin();
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      COURSE_ID: ['', Validators.required],
      COURSESCHEDULE_ID: ['', Validators.required],
      APPOINTMENT_NAME: ['', Validators.required],
      APPOINTMENT_DATE: ['', Validators.required],
      APPOINTMENT_STARTTIME: ['', Validators.required],
      APPOINTMENT_ENDTIME: [{ value: '', }, [Validators.required]],
      APPOINTMENT_DESCRIPTION: ['', Validators.required]
    })
  }

  loadGrid() {
    let fn = () => { }
    let payLoad = { TENANT_CODE: this.TenantCode, CREATEDBY: this.userId }
    this.getGridData('LoadEvent', payLoad, fn);
  }
  add() {
    this.schedules = [];
  }
  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.editData = {};
    this.schedules = [];
    this.Date = null;
  }
  onSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload.TENANT_CODE = this.TenantCode;

    this.activeSpinner();
    if (this.isEdit) {
      payload.LASTMDFBY = this.userId;
      payload.APPOINTMENT_ID = this.editData.APPOINTMENT_ID
      this.CommonService.postCall('UpdateEvent', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success(" Event Updated Successfully");
        document.getElementById('md_close').click()
        this.loadGrid();
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Event not updated ") })
    } else {
      payload.CREATEDBY = this.userId;

      // ContentType=100let
      let c = (data) => {
        payload.host_url = data.hostLink;
        payload.student_url = data.participantLink;
        payload.webinar_url = data.listenOnlyLink;
        payload.samvaad_id = data.session;

        this.CommonService.postCall('CreateEvent', payload).subscribe((res) => {
          this.deactivateSpinner();
          this.toastr.success("Event Created Successfully");
          document.getElementById('md_close').click()
          this.loadGrid()
        }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Event not created ") })
      }
      this.createSamvaad(payload, c);
    }


  }
  edit(data) {
    this.editData.APPOINTMENT_ID = data.APPOINTMENT_ID;
    this.isEdit = true;
    this.CommonService.postCall('EditEvent', this.editData).subscribe((res) => {
      this.editData = res[0];
      this.setData()
    })
  }
  setData() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value = this.editData[key];
      if (value != undefined) control.setValue(value);
    });
    //format("HH:mm")
    this.Date = this.editData['APPOINTMENT_DATE'];
    let stime = this.editData['APPOINTMENT_STARTTIME'];
    let endTime = this.editData['APPOINTMENT_ENDTIME'];
    var start = moment(stime).format('HH:mm')
    var end = moment(endTime).format('HH:mm');
    ctrls['APPOINTMENT_STARTTIME'].setValue(start);
    ctrls['APPOINTMENT_ENDTIME'].setValue(end);
    if (this.courseId) {
      this.courseChange()
    }
  }
  timeChange(endTime) {
    let controls = this.myForm.controls;
    let stime: any = controls['APPOINTMENT_STARTTIME'].value;
    let econtrol = controls['APPOINTMENT_ENDTIME'];

    if (!stime) {
      this.toastr.warning('Please selece start time')
      econtrol.setValue(null)
      return
    }
    var start = moment.utc(stime, "HH:mm");
    var end = moment.utc(endTime, "HH:mm");

    var d = moment.duration(end.diff(start));
    if (d['_milliseconds'] > 0) {

    } else {
      this.toastr.warning("End Time should be more than start time")
      econtrol.setValue(null)
    }

  }

  samvaadLogin() {
    let payLoad = {
      email: this.samvaad_user,
      password: sessionStorage.getItem('SP') || '123456'
    }
    this.CommonService.samvaadPost('nojwt/lms/login/login', payLoad).subscribe((res: any) => {
      if (res.status == 'OK') {
        sessionStorage.setItem('stoken', res.data.JwtToken);
        this.loginData = {
          token: res.data.JwtToken,
          userid: res.data.creatorId
        }
      }
    }, err => {
      this.toastr.warning("You don't have Samvaad login");
      window.history.back();
    })
  }

  createSamvaad(data, callback) {
    let s = moment.utc(data.APPOINTMENT_STARTTIME, 'HH:mm');
    let e = moment.utc(data.APPOINTMENT_ENDTIME, 'HH:mm');
    let datetimeA = moment(data.APPOINTMENT_DATE + "T" + data.APPOINTMENT_STARTTIME + ':00')['_i'];


    let payLoad = {
      name: data.APPOINTMENT_NAME,
      description: data.APPOINTMENT_DESCRIPTION,
      date: data.APPOINTMENT_DATE,
      duration: e.diff(s) / (1000 * 60),
      lmsMeeting: true,
      startDateTime: datetimeA,
      courseSchuduleId: data.COURSESCHEDULE_ID,
      startTime: data.APPOINTMENT_STARTTIME + ':00',
      "record": true,
      "intervalId": 1,
      "requiredWebinarLink": true,
      "creator": {
        "id": this.loginData.userid
      },
      "repeat": false,
      "session": "",
      "participantEmails": ""

    }
    this.CommonService.samvaadPost('jwt/lms/meeting/saveorupdate', payLoad).subscribe(
      (res: any) => {
        if (res.status == 'OK') {
          callback(res.data);
        }

      }, e => {
        this.toastr.warning('Please login Again');
        this.deactivateSpinner();
        // this.route.navigate(['/login'])
      }
    )
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {

      this.courses = res;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
}
