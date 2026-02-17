import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CommonService } from '../services/common.service';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
@Component({
  selector: 'app-maincontent',
  templateUrl: './maincontent.component.html',
  styleUrls: ['./maincontent.component.css']
})
export class MaincontentComponent implements OnInit {
  cources: [] = [];
  newsList = [];
  news = {};
  isNews = false;
  roleId: number | string = sessionStorage.getItem('RoleId');
  userName = sessionStorage.getItem('Username');

  constructor(private DashboardService: DashboardService, private route: Router, private commonService: CommonService, private toast: ToastrService) {
    if (this.roleId == 3) {
      this.getCource();
      this.loadCourse();
    }
    this.getDashboard()
    this.calender();
    this.getNewsList();
  }

  course: any = {
    isSessions: false,
    isClasses: true
  }
  data: any = {}
  ngOnInit(): void {

  }

  loadCourse() {
    this.commonService.activateSpinner()
    this.commonService.getCall(`Courses/GetCourses/${sessionStorage.getItem('UserId')}/${sessionStorage.getItem('RoleId')}`).subscribe((res: any) => {
      this.cources = res;
      this.commonService.deactivateSpinner()
    }, e => {
      this.commonService.deactivateSpinner()
    })
  }


  getCource() {
    this.commonService.activateSpinner()
    this.DashboardService.getCource().subscribe((data: any) => {
      this.course = { ...this.course, ...data }

      this.stopSpinner()
    }, (e) => {

      this.stopSpinner()
    })
  }
  toggleCource(key, collapse) {
    this.course.isSessions = false;
    this.course.isClasses = false;
    this.course[key] = !collapse;
  }
  navigate(data, url) {
    delete data.Name;
    this.route.navigate([url], { queryParams: data })
  }
  getDashboard() {
    this.commonService.activateSpinner()
    this.DashboardService.loadDashboard().subscribe((res: any) => {
      this.stopSpinner()
      this.data = res ? res : {};

    }, (e) => {

      this.stopSpinner()
    })
  }

  stopSpinner() {
    this.commonService.deactivateSpinner()
  }
  joinSession(item) {
    this.commonService.activateSpinner();
    let payload = {
      "UserId": sessionStorage.getItem('UserId'), //RoleId,TenantCode,UserId,Username
      "TenantCode": sessionStorage.getItem('TenantCode'),
      "Username": sessionStorage.getItem('Username'),
      "APPOINTMENT_ID": item?.URL,
      "RoleId": sessionStorage.getItem('RoleId'),
      "CourseScheduleId": 1
    }

    this.commonService.postCall('AVService/Joinurl', payload).subscribe(res => {
      this.commonService.deactivateSpinner();
      if (res.JoinUrl) {
        window.open(res.JoinUrl, "_blank")
      } else {
        this.toast.warning("Host Not joined");
      }
    }, err => {
      this.commonService.deactivateSpinner();
    });

  }
  calender() {
    $(function () {
      $(".b-notes").notes(".b-notes");

      $("#calendar").datepicker({
        todayHighlight: true,
        weekStart: 1
      }).on({

        'changeDate': function (e) {

          if (typeof (e.date) == "undefined") return false;

          var milliseconds = Date.parse(e.date);

          setCelendarDay(milliseconds);
        }

      });

      var today = new Date();
      var milliseconds = Date.parse(today.toString());

      setCelendarDay(milliseconds);

      function setCelendarDay(milliseconds) {
        // var date = new Date(milliseconds).format("dd/mm/yyyy");
        // var formatTitle = new Date(milliseconds).format("dddd, <b>d mmmm</b>");
        var list = $(".b-notes__list");
        var title = $(".b-app__title");


      }
    });
  }

  close() {

  }

  getNewsList() {
    this.newsList = []
    let payload = {
      "TNT_CODE": sessionStorage.getItem('TenantCode')
    }
    this.commonService.postCall("News/GetNewsList", payload).subscribe((response: any) => {
      this.newsList = response;
    })
  }

  getNews(EVENT_ID) {
    this.news = {}
    let payload = {
      "EVENT_ID": EVENT_ID
    }
    this.commonService.postCall("News/Get", payload).subscribe((response: any) => {
      this.isNews = true;
      this.news = response;
    })
  }
  surveys() {
    this.route.navigate(['HOME/surveys'])
  }
  polls() {
    this.route.navigate(['HOME/poll'])
  }
}
