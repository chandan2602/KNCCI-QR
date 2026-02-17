import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-student-registration-approval',
  templateUrl: './student-registration-approval.component.html',
  styleUrls: ['./student-registration-approval.component.css']
})
export class StudentRegistrationApprovalComponent extends BaseComponent implements OnInit {


  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService, private route: Router) {

    super(CommonService, toastr);
    this.load()
  }

  ngOnInit(): void {
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }
  deactivateSpinner() {
    this.CommonService.deactivateSpinner();
  }

  load() {
    this.activeSpinner();
    let payLoad = {
      "TENANT_CODE": this.TenantCode ,
      // "TENANT_CODE": 60268037
    }
    this.CommonService.postCall('StudentRegistration/GetPendingList', payLoad).subscribe((res: any) => {
      this.editData=res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })

  }

  Approval(item) {
    let payload = {
      "UserId": sessionStorage.getItem('UserId'),
      "Email": item.EMAIL,
      "FIRST_NAME": item.FIRST_NAME,
      "LAST_NAME": item.LAST_NAME,
      // "TENANT_CODE": 60268037,
      "TENANT_CODE" :  sessionStorage.getItem('TenantCode'),
      "Title": item.Title,
      "dob": item.DOB,
      "Gender": item.GENDER,
      "password": item.PASSWORD,
      "ADMISSION_INTO_CLASS": item.ADMISSION_INTO_CLASS,
      "MOBILE": item.MOBILE,
      "CREATEDBY": sessionStorage.getItem('UserId'),
      "ConfirmationToken": item.ConfirmationToken,
      "VerificationToken": item.VerificationToken,
      "RollNumber": item.RollNumber,
      "student_regid": item.student_regid,
    }
    this.CommonService.postCall('StudentRegistration/Approve', payload).subscribe((res: any) => {
      this.load();
      this.toastr.success("Approved Succuessfully");
    }, err => {
      this.toastr.error(err.error ? err.error : 'Not Approved')
    })
  }

}
