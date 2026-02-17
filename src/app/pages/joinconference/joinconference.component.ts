import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { CommonService } from './../../services/common.service'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-joinconference',
  templateUrl: './joinconference.component.html',
  styleUrls: ['./joinconference.component.css']
})
export class JoinconferenceComponent extends BaseComponent implements OnInit {
  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = [];
  table: any = [];
  private readonly onDestroy = new Subscription();
  constructor(CommonService: CommonService, toast: ToastrService) {
    super(CommonService, toast)
    this.loadCourse()
  }

  ngOnInit(): void {
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  loadCourse() {
    if (this.roleId == '2') {
      this.sgetCourses()
    } else {
      this.getCourses()
    }
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }
  sgetCourses() {
    // this.activeSpinner();
    // this.CommonService.getCourses().subscribe((res: any) => {
    //   this.deactivateSpinner();
    //   this.cources = res
    //   this.courses = res;
    // }, e => { this.deactivateSpinner(); })

    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {
      this.cources = res;
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


  courceChange() {
    this.courseId = this.courceId;
    if (this.roleId == '3') {
      let data = {
        "CourseId": this.courceId
      }
      this.activeSpinner();
      this.CommonService.getCourseSchedule(data).subscribe((res: any) => {
        this.deactivateSpinner();
        this.shedules = res;
      }, e => { this.deactivateSpinner(); })
    } else {
      this.courseChange()
    }
  }
  schedulChange() {
    this.activeSpinner();
    let data = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId,
      RoleId: this.roleId,
      UserName: sessionStorage.getItem('Username')
    }
    this.CommonService.joinConference(data).subscribe((res: any) => {
      this.table = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(); })
  }


  joinSession(item) {

    // this.activeSpinner();
    //var isLarger = new Date("2-11-2012 13:40:00") > new Date("01-11-2012 10:40:00");
    let currentdate = new Date();
    //currentdate.setHours(currentdate.getHours() - 1
    let datetime = currentdate.getFullYear() + "-"

      + (currentdate.getMonth() + 1) + "-"
      + currentdate.getDate() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();

    let currentDate = new Date(datetime)
    let startDate = new Date(item.StartTime)
    let endDate = new Date(item.EndTime)
    // endDate.setHours(endDate.getHours() + 1); 
    // let s = item.StartTime();
    let sDate = startDate
    sDate.setHours(sDate.getHours() - 1);
    let eDate = endDate
    eDate.setHours(eDate.getHours() + 1);

    if (currentDate > sDate && currentDate < eDate) {
      // window.open(res.JoinUrl, "_blank")
    } else if (currentDate < sDate) {
      this.toastr.warning('Meeting Has To Be Started.');
      return
    } else if (currentDate > eDate) {
      this.toastr.warning('Meeting Ended.');
      return
    }
    this.activeSpinner();
    let payload = {
      "UserId": this.userId,// sessionStorage.getItem('UserId'), //RoleId,TenantCode,UserId,Username
      "TenantCode": this.TenantCode,// sessionStorage.getItem('TenantCode'),
      "Username": sessionStorage.getItem('Username'),
      "APPOINTMENT_ID": item.URL,
      "RoleId": sessionStorage.getItem('RoleId'),
      "CourseScheduleId": this.schedulId
    }
    this.CommonService.postCall('AVService/Joinurl', payload).subscribe(res => {
      this.deactivateSpinner();
      window.open(res.JoinUrl, "_blank")
    }, err => {
      this.deactivateSpinner();
    });

  }

}
