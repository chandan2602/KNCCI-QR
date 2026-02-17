import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent extends BaseComponent implements OnInit {


  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; listGrid: any[] = [];
  tooltipContent = `
					Company admins can view all published job applications in the table below. They can also <strong>view</strong> or <strong>edit</strong> existing job postings at any time. <br><br>
To create a new job listing, click the <strong>Add</strong> button at the top right of the screen.

					`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.isAdmin = (+this.USERTYPE == 24);
    // this.active.queryParams.subscribe((res) => {
    //   if (Object.keys(res).length) {
    //     this.params = res;
    //     this.getAll();
    //   }
    // })
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() {
    this.CommonService.activateSpinner();
    let payLoad: any = {company_id: sessionStorage.getItem('company_id'), tnt_code: sessionStorage.getItem('TenantCode'), job_id: 0}
    this.CommonService.postCall('InternshipJobs/GetList', payLoad).subscribe(
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

  add() {
    this.router.navigate(['/HOME/job'])
  }

  ApplyJob(evnt: any) {
    let params = {type: 'add', id: evnt}
    this.router.navigate(['/HOME/apply_job'])
  }

  OnEditView(evnt: any, ctrl: string = '' ) {
    let params = {type: ctrl, id: evnt?.job_id}
    this.router.navigate(['/HOME/job'], { queryParams: params })
  }

}
