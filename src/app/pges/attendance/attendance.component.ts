import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {


  table: Array<any> = [];
  courceId: string=''
  schedulId: string=''
  scheduls: Array<any> = [];
  cources: Array<any> = [];
  isParam: boolean = false;
  sessionId: string='';
  sessions: Array<any> = [];
  tenantCode: string = sessionStorage.getItem('TenantCode');
  constructor(private CommonService: CommonService, private toastr: ToastrService) {
    this.loadcourses();
    // this.getYear();
  }

  ngOnInit(): void {

  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  loadcourses() {
    // LoadCourseSchedule
    // Loadyear Loadcourses
    this.activeSpinner()
    let payaload = {
      "TENANT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.cources = res;
      this.deactivateSpinner();
    }, e => this.deactivateSpinner());
  }

  courceChange() {
    let payload = {
      CourseId: this.courceId
    }
    this.scheduls = [];
    this.sessions = [];
    this.activeSpinner()
    this.CommonService.getAdminCourseSchedule(payload).subscribe((res: any) => {
      this.deactivateSpinner();
      if(res.length){
      this.scheduls = res;
      }else{
        this.toastr.warning(res.message)
      }
    }, e => this.deactivateSpinner());

  }

  schedulChange() {
    this.sessions=[];
    this.table=[];
    this.activeSpinner()
    let payload = {
      "TENANT_CODE": this.tenantCode,
      "COURSESHD_ID": this.schedulId
    }
    this.CommonService.postCall('GetSessionByCourseScheduleId', payload).subscribe((res: any) => {
      this.deactivateSpinner();
      if(res.length){
      this.sessions = res;
      }else{
        this.toastr.warning(res.message||'No Data')
      }
     
    }, e => this.deactivateSpinner());
  }
  sessionChange() {
    this.activeSpinner();
    let payLoad = {
      "TENANT_CODE": this.tenantCode,
      "ATTENDANCE_COURSE_SCHEDULE_ID": this.schedulId,
      "ATTENDANCE_DATE": moment(moment(this.sessionId, 'MM/DD/yyyy')).format('yyyy-MM-DD')

    };
    this.CommonService.postCall('GetAttendanceByCourseScheduleId', payLoad).subscribe((res) => {
      this.deactivateSpinner();
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
    }, e => { this.deactivateSpinner() })

  }

  submit() {
    let array1 = this.table.filter((item) => { return item.ATTENDANCE_ID > 0 });
    let array2 = this.table.filter((item) => { return item.ATTENDANCE_ID == 0 && item.ATTENDANCE_STATUS });
    array1 = array1.concat(array2);
    if(!array1.length){
      this.toastr.warning('Please Select Any One')
      return 
    }
    let array = [];
    let userId = sessionStorage.getItem('UserId');
    array1.map((item) => {
      let obj = {
        ATTENDANCE_ID: item.ATTENDANCE_ID,
        ATTENDANCE_COURSE_SCHEDULE_ID: this.schedulId,
        ATTENDANCE_USER_ID: item.ATTENDANCE_USER_ID,
        ATTENDANCE_DATE: moment(item.ATTENDANCE_DATE).format('yyyy-MM-DD'),
        ATTENDANCE_STATUS: item.ATTENDANCE_STATUS,
        "LASTMDFBY": userId,
        "CREATEDBY": userId,
        TENANT_CODE:this.tenantCode
      }
      array.push(obj)
    })
    this.activeSpinner();
    this.CommonService.postCall('SaveAttendanceDetails', array).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.clear();
        this.toastr.success('Information saved successfully');
      }, e => { 
        this.toastr.error(e.error ? e.error : e);
       })
  }
  clear() {
    this.courceId = '';
    this.sessionId = '';
    this.sessions = [];
    this.schedulId = '';
    this.scheduls = [];
    this.table=[];
  }

}
