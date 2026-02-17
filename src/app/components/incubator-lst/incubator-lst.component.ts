import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-incubator-lst',
  templateUrl: './incubator-lst.component.html',
  styleUrls: ['./incubator-lst.component.css']
})
export class IncubatorLstComponent extends BaseComponent implements OnInit {
  parentMessage: any = ''; parentUser: any = 0;
  roleId: any = ''; listGrid: any[] = []; isAddEdt = false; approve_comments: any = ''; isAprveRejct: any = 2;
  tableId: any = 0; rating: any = '1'; screnType = 'add';

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() { // api/Registration/GetMyStartUpList/{user_id}
 
    this.listGrid = [];
    // if(this.roleId != '' && this.roleId != null) {
      this.CommonService.activateSpinner();
      this.CommonService.getCall(`Registration/GetMyStartUpList/${sessionStorage.UserId}`, '', false).subscribe(
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
          this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
          // window.history.back()
        })
    // }
  }

  onCheck(evnt: any) {
    this.parentMessage = evnt.startup_id, this.parentUser = evnt?.user_id;
    if(this.screnType == 'view') {
      this.rating = this.tableId?.incubatorDetails[0]?.rating,
      this.approve_comments = this.tableId?.incubatorDetails[0]?.comments
    }

  }

  Save() {// ApprovedOrRejected
    if(this.approve_comments == '') {
      return this.toastr.warning(`Enter ${this.isAprveRejct==2 ? 'Approve' : 'Reject'} Comments`);
    }
    this.CommonService.activateSpinner();
    let payLoad: any = {id: this.tableId?.startup_id, status_id: this.isAprveRejct, 
      user_id: this.tableId?.incubatorDetails[0]?.startup_incubator_id, role_id: 7, comments: this.approve_comments,
      approvel_type: 'Incubator', rating: this.rating, sector_id: this.tableId?.sector_id}
    this.CommonService.postCall('Registration/ApprovedOrRejected', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.Back(), this.LoadGrid();
        } else {
          this.toastr.warning(res.message);
           this.deactivateSpinner();
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Approve / Reject Record not getting');
        // window.history.back()
      })
  }

  Back() {
    this.isAddEdt = !this.isAddEdt, this.approve_comments = ''; this.screnType='add'
  }

}
