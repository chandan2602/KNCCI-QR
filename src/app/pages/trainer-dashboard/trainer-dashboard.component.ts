import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { CommonService } from '../../../app/services/common.service';
import { DashboardService } from '../../../app/services/dashboard.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-trainer-dashboard',
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.css']
})
export class TrainerDashboardComponent implements OnInit {
  FullName = sessionStorage.FullName;
  dashboard: IDashboard = {
    registered_active: 0,
    registered_Inactive: 0,
    traineer_enrolled_active: 0,
    traineer_enrolled_Inactive: 0,
    batches_active: 0,
    batches_Inactive: 0,
    session: 0,
    session_completed: 0,
    trainee_comments: 0
  };
  roleId = sessionStorage.RoleId;
  course: any = {
    isSessions: false,
    isClasses: true
  }
  data: any = {}
  constructor(private CommonService: CommonService, private toastr: ToastrService, private DashboardService: DashboardService, private route: Router) {
    if (this.roleId != 2) {
      // this.getCource();
      this.getDashboard()
    }
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    const { TenantCode } = sessionStorage;
    let registered = this.CommonService.getCall('DashboardCounts', `${TenantCode}/registered`);
    let traineer_enrolled = this.CommonService.getCall('DashboardCounts', `${TenantCode}/traineer_enrolled`);
    let batches = this.CommonService.getCall('DashboardCounts', `${TenantCode}/batches`);
    let session = this.CommonService.getCall('DashboardCounts', `${TenantCode}/session`);
    let session_completed = this.CommonService.getCall('DashboardCounts', `${TenantCode}/session_completed`);
    forkJoin([registered, traineer_enrolled, batches, session, session_completed]).subscribe((res) => {

      this.dashboard.registered_active = res[0][0].COUNT;
      this.dashboard.registered_Inactive = res[0][1].COUNT;

      this.dashboard.traineer_enrolled_active = res[1][0].COUNT;
      this.dashboard.traineer_enrolled_Inactive = res[1][1].COUNT;

      this.dashboard.batches_active = res[2][0].COUNT;
      this.dashboard.batches_Inactive = res[2][1].COUNT;

      this.dashboard.session = res[3][0].COUNT;
      this.dashboard.session_completed = res[4][1].COUNT;

      console.log(res, this.dashboard)
    })

  }

  //   getCource(){
  //     this.CommonService.activateSpinner()
  //   this.DashboardService.getCource().subscribe((data:any)=>{
  //     this.course={...this.course,...data}
  //     this.stopSpinner()
  //   },(e)=>{

  //     this.stopSpinner()
  //   })
  // }
  // toggleCource(key,collapse){
  //   this.course.isSessions=false;
  //   this.course.isClasses=false;
  //   this.course[key]=!collapse;
  // }
  // navigate(data,url){
  //   delete data.Name;
  //   this.route.navigate([url],{queryParams:data})
  // }
  getDashboard() {
    this.CommonService.activateSpinner()
    this.DashboardService.loadDashboard().subscribe((res: any) => {
      this.data = res;
      this.stopSpinner()
    }, (e) => {

      this.stopSpinner()
    })
  }

  stopSpinner() {
    this.CommonService.deactivateSpinner()
  }



}

interface IDashboard {
  registered_active: number;
  registered_Inactive: number;
  traineer_enrolled_active: number;
  traineer_enrolled_Inactive: number;
  batches_active: number;
  batches_Inactive: number;
  session: number;
  session_completed: number;
  trainee_comments: number;
};