import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-holiday-notification',
  templateUrl: './holiday-notification.component.html',
  styleUrls: ['./holiday-notification.component.css']
})
export class HolidayNotificationComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  courses : Array<any>=[];
  Schedules : Array<any>=[];
  sheduleId: string;
  courceId: any;
  isEdit: boolean = null;

  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {

    this.load();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      courseName : ['', ],
      courseSchedule : ['',],
      HOLIDAY_DATE: ['', Validators.required],
      TITLE:['',],
      DESCRIPTION: ['', Validators.required],
    })
    this.loadCourse();
  }
load(){
  this.activiceSpinner();
  let payload = {
    "TNT_CODE":sessionStorage.getItem('TenantCode')
  }
  this.CommonService.postCall('HolidayNotification/GetList',payload).subscribe((res: any) => {
    this.table = [];
    setTimeout(() => {
      this.table = res;
      console.log(res)
    }, 10)
    this.deactivateSpinner();
  }, e => { this.deactivateSpinner(), console.log(e) })
}
activiceSpinner() {
  this.CommonService.activateSpinner();
}
deactivateSpinner() {
  this.CommonService.deactivateSpinner();
}

loadCourse() {
  this.activiceSpinner();
  this.CommonService.getAdminCourses().subscribe((res: any) => {
    this.courses = res;
    this.deactivateSpinner();
  }, e => {
    this.deactivateSpinner();
  })
}
courseChange(event){
  this.sheduleId = '';
  let data = {
    "CourseId": event.target.value
  }
  this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
    this.deactivateSpinner()
    this.Schedules = res;
  }, e => { this.deactivateSpinner() })
}

close(){
  this.myForm.reset();
}
onSubmit(form) {
  let value: any = form.value;

  let payload = {
    "TNT_CODE": sessionStorage.getItem('TenantCode'),
    "CREATED_BY": parseInt(sessionStorage.getItem('UserId')),
    "HOLIDAY_DATE":value.HOLIDAY_DATE,
    "DESCRIPTION":value.DESCRIPTION,
    "COURSE_ID":value.COURSE_ID,
    "TITLE":value.TITLE,
    "COURSESCHEDULE_ID":value.COURSESCHEDULE_ID

  }
  // this.activiceSpinner();
  this.CommonService.postCall('HolidayNotification/Create',payload).subscribe((res:any)=>{
    this.load();
      this.toastr.success("Sent Successfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : ' Not sent')

  })
}
}
