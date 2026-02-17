import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  listGrid: any = '';
 private readonly onDestroy = new Subscription();
  dashboardList: Array<any> = [];
  FullName = sessionStorage.FullName;
  // course:any={};
  dashboard: IDashboard = {
    COURSE_ACTIVE: 0,
    COURSE_INACTIVE: 0,

    BATCH_COMPLETED:0,
    BATCH_INPROGRESS:0,

    PAID_AMOUNT: 0,
    BALANCE_AMOUNT: 0,

    TRAINEE_ACTIVE: 0,
    TRAINEE_INACTIVE: 0,

    TRAINERS_ACTIVE: 0,
    TRAINERS_INACTIVE: 0,

    session_conducted: 0,
    ongoing_session: 0,
  };


  constructor(private CommonService: CommonService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getDashBoard();
    this.LoadGrid()

  }

  LoadGrid() {// http://localhost:56608/api/InternshipJobs/GetAdminDashboardCount/{CompanyId}
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/GetAdminDashboardCount/${sessionStorage.getItem('company_id')}`, '').subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.CommonService.deactivateSpinner();
          this.listGrid = res.data;
        } else {
          this.toastr.warning(res.message);
          this.CommonService.deactivateSpinner();
        }
      },
      err => {
          this.CommonService.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
  }
  // enableOrDisabledSpinner(flag: boolean = true) {
  //   flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  // }

  getDashBoard() {
    // this.CommonService.activateSpinner();
    const { tenantCode } = sessionStorage;
    if(tenantCode != undefined && tenantCode != null && tenantCode != '') {
      const ob1$ = this.CommonService.getCall(`Courses/DashboardForAdmin/${tenantCode}`).subscribe((res: any) => {
        const dashboard = res;
        this.dashboard.COURSE_ACTIVE = dashboard.Course[0].count | 0;
        this.dashboard.COURSE_INACTIVE = dashboard.Course[1].count | 0;
  
        this.dashboard.PAID_AMOUNT = dashboard.Payment[0].count | 0;
        this.dashboard.BALANCE_AMOUNT = dashboard.Payment[1].count | 0;
  
        this.dashboard.TRAINEE_ACTIVE = dashboard.Trainee[0].count | 0;
        this.dashboard.TRAINEE_INACTIVE = dashboard.Trainee[1].count | 0;
  
        this.dashboard.TRAINERS_ACTIVE = dashboard.Trainer[0].count | 0;
        this.dashboard.TRAINERS_INACTIVE = dashboard.Trainer[1].count | 0;
  
        this.dashboard.session_conducted = dashboard.Session[0].count | 0 ;
        this.dashboard.ongoing_session = dashboard.Session[1].count | 0 ;
  
        this.dashboard.BATCH_COMPLETED = dashboard.Batch[0].count | 0;
        this.dashboard.BATCH_INPROGRESS = dashboard.Batch[1].count | 0;
  
        console.log(res, this.dashboard);
        // this.CommonService.deactivateSpinner();
        // this.enableOrDisabledSpinner(false);
      }, e => { 
        // this.CommonService.deactivateSpinner();
      });
      this.onDestroy.add(ob1$);
    }


  }


}

interface IDashboard {
  COURSE_ACTIVE: number;
  COURSE_INACTIVE: number;
  BATCH_COMPLETED: number;
  BATCH_INPROGRESS: number;
  PAID_AMOUNT: number;
  BALANCE_AMOUNT: number;
  TRAINEE_ACTIVE: number;
  TRAINEE_INACTIVE: number;
  TRAINERS_ACTIVE: number;
  TRAINERS_INACTIVE: number;
  session_conducted: number;
  ongoing_session: number;
};
