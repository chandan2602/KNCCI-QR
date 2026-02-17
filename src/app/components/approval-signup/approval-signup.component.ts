import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-approval-signup',
  templateUrl: './approval-signup.component.html',
  styleUrls: ['./approval-signup.component.css']
})
export class ApprovalSignupComponent extends BaseComponent implements OnInit {

  roleId: any = ''; listGrid: any[] = []; isAddEdt = false; approve_comments: any = ''; isAprveRejct: any = 2;
  tableId: any = 0;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() { // http://localhost:56608/api/Registration/GetIncubatorsOrInvestor/7
    this.listGrid = [];
    if(this.roleId != '' && this.roleId != null) {
      this.CommonService.activateSpinner();
      let payLoad: any = {company_id: sessionStorage.getItem('company_id'), tnt_code: sessionStorage.getItem('TenantCode'), job_id: 0}
      this.CommonService.getCall(`Registration/GetIncubatorsOrInvestor/${this.roleId}`, '', false).subscribe(
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
  }

  Save() {// ApprovedOrRejected
    if(this.approve_comments == '') {
      return this.toastr.warning(`Enter ${this.isAprveRejct==2 ? 'Approve' : 'Reject'} Comments`);
    }
    this.CommonService.activateSpinner();
    let payLoad: any = {id: this.roleId == 6 ? (this.tableId?.founder_id): (this.roleId == 7 ? (this.tableId?.incubator_id): (this.tableId?.investor_id)), 
      status_id: this.isAprveRejct, user_id: sessionStorage.UserId, role_id: this.roleId, 
      comments: this.approve_comments, approvel_type: 'Registration'}
    this.CommonService.postCall('Registration/ApprovedOrRejected', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.Back(), this.LoadGrid();
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

  Back() {
    this.isAddEdt = !this.isAddEdt, this.approve_comments = '';
  }

  OnView(evnt: any) {
    if(this.roleId == '6') {
      this.router.navigate(['/HOME/founder-view'], { queryParams: {founderU_id: evnt.user_id} })
    }
    if(this.roleId == '7') {
      this.router.navigate(['/HOME/incubtr-view'], { queryParams: {incubatorU_id: evnt.user_id} })
    }
    if(this.roleId == '8') {
      this.router.navigate(['/HOME/investr-view'], { queryParams: {investorU_id: evnt.user_id} } )
    }
    
  }
}
