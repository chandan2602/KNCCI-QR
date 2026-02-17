import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-job-applied-lst',
  templateUrl: './job-applied-lst.component.html',
  styleUrls: ['./job-applied-lst.component.css']
})
export class JobAppliedLstComponent extends BaseComponent implements OnInit {
  tooltipContent = `
					All job applications submitted by students will be displayed in the table below. <br><br>
Company admins can review each application and update the status using the <strong>Update</strong> button corresponding to each record. <br><br>
Available status options include: <strong>Pending, Shortlisted, Rejected, </strong> and <strong>Call for Interview, </strong> along with a field for optional comments. <br><br>
Once the status is updated, the student will receive a <strong>system notification</strong> and an <strong>email update</strong> regarding their application.


					`;
  cmpny_id: any = sessionStorage.getItem('company_id');
  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE'); tableId: any = '';
  isAdmin: boolean = false; listGrid: any[] = []; tnt_code: any = ''; isAddEdt = false; Job_Application_Comments: any = '';
  Job_Application_Status: any = 0;
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.tnt_code = sessionStorage.getItem('TenantCode')
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

  LoadGrid() { // http://localhost:56608/api/InternshipJobs/CompanyApplyJobsList/22584592/44
    this.listGrid = [];
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/CompanyApplyJobsList/${this.tnt_code}/${this.cmpny_id}`, '', false).subscribe(
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

  // ApplyJob(evnt: any) {
  //   let params = {type: 'add', id: evnt}
  //   this.router.navigate(['/HOME/apply_job'])
  // }

  // OnEditView(evnt: any, ctrl: string = '' ) {
  //   let params = {type: ctrl, id: evnt?.job_id}
  //   this.router.navigate(['/HOME/job'], { queryParams: params })
  // }

    Save() {// http://localhost:56608/api/InternshipJobs/UpdateApplicationStatus/{application_id}
      if(this.Job_Application_Comments == '') {
        return this.toastr.warning(`Enter Comments`);
      }
      this.CommonService.activateSpinner();
      let payLoad: any = {application_id: this.tableId?.application_id, Job_Application_Status: this.Job_Application_Status, 
        Job_Application_Comments: this.Job_Application_Comments,
        updated_by:`${sessionStorage.UserId}`}
        
      this.CommonService.postCall('InternshipJobs/UpdateApplicationStatus', payLoad).subscribe(
        (res: any) => {
          if(res?.status == true) {
            this.deactivateSpinner();
            this.Back(), this.LoadGrid();
            this.toastr.success(res.message);
          } else {
            this.toastr.warning(res.message);
          }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Approve / Reject Record not getting');
          // window.history.back()
        })
  }

  Back() {
    this.isAddEdt = !this.isAddEdt, this.Job_Application_Comments = '';
  }

}
