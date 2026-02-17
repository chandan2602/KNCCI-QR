import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-courcesessions',
  templateUrl: './courcesessions.component.html',
  styleUrls: ['./courcesessions.component.css']
})
export class CourcesessionsComponent extends BaseComponent implements OnInit {
  courses: [] = [];
  courseId: string = ''
  scheduleId: any = '';
  schedules: [] = []
  table: any = [];

  isActive: boolean = false;
  params: any = {};
  chapters: Array<any> = [];
  trainers: Array<any> = [];
  planData: any = {};
  eventMyForm: UntypedFormGroup;
  startTime: string = null;
  Date: any;
  eventData: any;
  myFormSession!: UntypedFormGroup
  constructor(CommonService: CommonService, toastr: ToastrService, private active: ActivatedRoute, private fb: UntypedFormBuilder) {
    super(CommonService, toastr);
    this.getCourses();
    active.queryParams.subscribe(
      (res) => {
        if (Object.keys(res).length) {
          this.courseId = res.cId;
          this.scheduleId = res.csId;
          this.params = res;
          this.courseChange();
          this.loadSessions();
          this.isActive = true;
          this.loadTrainersAndChapters();
        }
      })
  }

  ngOnInit(): void {
    this.createForm();
    this.createEventForm();
    this.dtOptions = {
      order: []
    }
    this.myFormSession = this.fb.group({

      CS_DATE: ['', Validators.required,],
      CS_CHAPTER_ID: [''],
      // CS_TRAINER_ID: ['', Validators.required,],
      CS_ONLINE_OFFLINE: ['', Validators.required,],
      // CS_SCHEDULE_DELAY: [''],
      COURSESHD_SESSION_NAME: ['', Validators.required]
    })
  }
  createForm() {
    this.myForm = this.fb.group(
      {
        courseSh: [''],
        CSS_TITLE: ['', Validators.required],
        CSS_DESCRIPTION: ['', Validators.required],
        CSS_ACTIVITIES: [''],
        CSS_REFERENCE: ['']
      }
    )
  }
  createEventForm() {
    this.eventMyForm = this.formBuilder.group({
      COURSE_ID: ['', Validators.required],
      COURSESCHEDULE_ID: ['', Validators.required],
      APPOINTMENT_NAME: ['', Validators.required],
      APPOINTMENT_DATE: ['', Validators.required],
      APPOINTMENT_STARTTIME: ['', Validators.required],
      APPOINTMENT_ENDTIME: [{ value: '', }, [Validators.required]],
      APPOINTMENT_DESCRIPTION: ['', Validators.required]
    })
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.courses = res
    }, e => { this.deactivateSpinner(); })
  }

  courseChange() {
    this.activeSpinner();
    let data = {
      "CourseId": this.courseId
    }
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      if (res.length) {
        this.schedules = res;
      } else {
        this.toastr.warning(res.message)
      }
    }, e => { this.deactivateSpinner(); })
  }
  schedulChange() {
    this.activeSpinner();
    this.CommonService.getCourseScheduleSession(this.scheduleId).subscribe((res: any) => {
      this.deactivateSpinner();
      this.table = [];
      setTimeout(() => {
        this.table = res;
        this.table.map((item) => {
          item.CS_SCHEDULE_DELAY = item.CS_SCHEDULE_DELAY || 2;
        })
      }, 10)

    }, err => {
      this.deactivateSpinner();
    })
  }
  submit() {
    let array: Array<any> = [];
    this.table.map((item: any) => {
      let data = {
        CsId: item.CS_ID,
        SessionUpdate: item.CS_SCHEDULE_DELAY,
        ChapterId: item.CS_CHAPTER_ID,
        OffLineOnline: item.CS_ONLINE_OFFLINE,
        TrainerId: item.CS_TRAINER_ID,
        TenantCode: sessionStorage.getItem('TenantCode')
      }
      array.push(data);
    })
    this.CommonService.setCourseScheduleSessions({ data: array }).subscribe((res: any) => {
      this.toastr.success("Successfully Updated");
      setTimeout(() => { location.reload() }, 200)
      window.history.back()
    }, (e: any) => {

    })
  }

  loadSessions() {
    let payLoad = {
      COURSESHD_ID: this.scheduleId,
      STARTDATE: this.params.sDate,
      ENDDATE: this.params.eDate,
      USERID: sessionStorage.getItem('UserId'),
      TENANT_CODE: sessionStorage.getItem('TenantCode'),
    }
    this.activeSpinner();
    this.CommonService.postCall('LoadCourseScheduleSession', payLoad).subscribe(
      (res) => {
        this.table = res;
        this.deactivateSpinner();
      },
      err => {
        console.log(err);
        this.deactivateSpinner();
      }
    )

  }

  loadTrainersAndChapters() {
    let cPayload = {
      CHAPTER_CS_ID: this.scheduleId
    };
    let tPayload = {
      COURSE_TRAINER_COURSESHD_ID: this.scheduleId
    }
    let chapters = this.CommonService.postCall('LoadChaptersByCourseSchedule', cPayload);
    let trainers = this.CommonService.postCall('LoadAssignTrainers', tPayload);
    forkJoin([chapters, trainers]).subscribe(res => {
      this.chapters = res[0];
      this.trainers = res[1];
    }, err => {
      console.log(err)
    })
  }
  viewPlan(data) {
    this.planData = data;
  }
  close() {
    this.planData = {};
    this.myForm.reset();
  }
  onSubmit(form: UntypedFormGroup) {
    let payLoad = form.getRawValue();
    payLoad['CSS_COURSE_SCHEDULE_ID'] = this.planData['CS_COURSESHD_ID'] || this.scheduleId;
    payLoad['CSS_CS_SESSION_ID'] = this.planData['CS_ID'];
    payLoad['CSS_TENANTCODE'] = this.TenantCode;
    payLoad['CSS_CREATED_BY'] = this.userId;
    payLoad['CSS_STATUS'] = true;
    this.activeSpinner();
    this.CommonService.postCall('SaveLessionPlan', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.toastr.success('Information Saved Successfully');
        document.getElementById('md_close').click();
      }, err => {
        this.deactivateSpinner();
      }
    )

  }
  riseEvent(data) {
    this.eventData = data;
  }
  eventclose() {
    this.eventMyForm.reset();
  }
  timeChange(endTime) {
    let controls = this.eventMyForm.controls;
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
  eventOnSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload.TENANT_CODE = this.TenantCode;
    this.activeSpinner();
    if (this.isEdit) {
      payload.LASTMDFBY = this.userId;
      payload.APPOINTMENT_ID = this.editData.APPOINTMENT_ID
      this.CommonService.postCall('UpdateEvent', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success(" Event Updated Successfully");
        document.getElementById('md_close1').click()
        // this.loadGrid();
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Event not updated ") })
    } else {
      payload.CREATEDBY = this.userId;
      // ContentType=100
      this.CommonService.postCall('CreateEvent', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success("Event Created Successfully");
        document.getElementById('md_close1').click()
        // this.loadGrid()
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Event not created ") })
    }
  }

  add() { }
  onSubmitSession(form: UntypedFormGroup) {
    let value: any = form.value;
    let payload = {
      "CS_COURSESHD_ID": this.scheduleId,
      "CS_DATE": value.CS_DATE,
      "CS_CHAPTER_ID": value.CS_CHAPTER_ID,
      // "CS_TRAINER_ID": value.CS_TRAINER_ID,
      "CS_TRAINER_ID": sessionStorage.UserId,
      "CS_ONLINE_OFFLINE": value.CS_ONLINE_OFFLINE,
      // "CS_SCHEDULE_DELAY":value.CS_SCHEDULE_DELAY,
      "CS_CREATED_BY": sessionStorage.getItem('UserId'),
      "CS_MODIFIED_BY": sessionStorage.getItem('UserId'),
      "TNT_CODE": sessionStorage.getItem('TenantCode'),
      "COURSESHD_SESSION_NAME": value.COURSESHD_SESSION_NAME
    }
    this.CommonService.postCall('CourseSchedule/CreateSessions', payload).subscribe((res: any) => {
      this.toastr.success(" Created Successfully");

      document.getElementById('md_close1').click();
      location.reload();
    })
  }
}
