import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from 'src/app/pages/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  listGrid: Array<any> = [];
  userId = sessionStorage.UserId;
  company_id = sessionStorage.company_id;
  InstallmentList: Array<any> = [];
  showInstallmentModel: boolean = false;
  tooltipContent = `
					Access the complete list of jobs you’ve applied for along with key details. Click on <strong>View Details </strong>to see full job information anytime.
					`;

  // COURSESHD_ID:any;
  private readonly onDestroy = new Subscription();

  constructor(CommonService: CommonService, toastr: ToastrService, private route: Router,) {
    super(CommonService, toastr);
    // this.getCourses();
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  LoadGrid() { // http://localhost:56608/api/InternshipJobs/GetStudentJobsList/
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/GetStudentJobsList/${this.userId}`, '', false).subscribe(
      (res: any) => {
    if(res?.status == true) {
      this.deactivateSpinner();
      this.listGrid = res.data;
    } else {
      this.toastr.warning(res.message);
    }
  },
  err => {
    this.deactivateSpinner();
    this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
    // window.history.back()
  })
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

   ApplyJob(evnt: any) {
      this.route.navigate(['HOME/jobSummery'], {  queryParams: {job_id: evnt.job_id, jobApply: false} })
  }
}