import { Component, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-postassessment',
  templateUrl: './postassessment.component.html',
  styleUrls: ['./postassessment.component.css']
})
export class PostassessmentComponent implements OnInit {

  cources: [] = [];
  courceId: string = ''
  schedulId: string | number = '';
  scheduls: [] = [];
  table: Array<any> = [];
  isParam: boolean = false;

  constructor(private CommonService: CommonService, private route: Router, active: ActivatedRoute, private toastr: ToastrService) {
    active.queryParams.subscribe((res) => {
      if (res) {
        this.courceId = res.Id ? res.Id : '';
        this.schedulId = res.CourseScheduleId ? res.CourseScheduleId : '';
        this.isParam = (this.courceId && this.schedulId) ? true : false;
        if (this.courceId) {
          this.courceChange();
        }
        if (this.courceId && this.schedulId) {
          this.schedulChange();
        }
      }
    })
    this.getCourses()
  }

  ngOnInit(): void {
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getCourses() {
    this.activeSpinner();
    this.CommonService.getCourses().subscribe((res: any) => {
      this.deactivateSpinner();
      this.cources = res
    }, e => { this.deactivateSpinner(); })
  }

  courceChange() {
    this.activeSpinner();
    let data = {
      "CourseId": this.courceId
    }
    this.CommonService.getCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner();
      this.scheduls = res;
    }, e => { this.deactivateSpinner(); })
  }
  schedulChange() {
    this.activeSpinner();
    let data = {
      CourseScheduleId: this.schedulId,
      CourseId: this.courceId
    }
    this.CommonService.getAssessments(data).subscribe((res: any) => {
      this.table = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(); })
  }
  // startExam(data) {
  //   this.CommonService.assessment = data;
  //   this.route.navigate(['home/takeExam'])
  // }

  startExam(data) {
    var date = new Date();
    let starttime: string[] = data.SA_START_TIME.split(':');
    let endTime: string[] = data.SA_END_TIME.split(':');
    let [t1, t2, time] = [this.getDefaultDateFromTime(+starttime[0], +starttime[1]), this.getDefaultDateFromTime(+endTime[0], +endTime[1]), this.getDefaultDateFromTime(+date.getHours(), +date.getMinutes())];
    if (t1 <= time && t2 >= time) {
      if (data.allow_proctoring) {
        let url = "https://proctoring.samvaad.pro/#/login?userId=" + sessionStorage.getItem('UserId') + "&TenantCode=" + sessionStorage.getItem('TenantCode') + "&CourseScheduleId=" + data.SA_ID + "&id=" + this.courceId;
        window.open(url, '_blank')
      } else {
        this.CommonService.assessment = data;
        this.route.navigate(['HOME/takeExam'])
      }
    }
    else {
      this.toastr.info("You can Start exam between start and end time");

    }
  }
  getDefaultDateFromTime(HH: number, MM: number): Date {

    const newDate = new Date(2010, 10, 20, HH, MM, 0);
    return newDate;
  }

}
