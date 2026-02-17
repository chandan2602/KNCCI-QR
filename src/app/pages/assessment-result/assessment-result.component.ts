import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VirtualTimeScheduler } from 'rxjs';
import { constants } from 'src/app/constants';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './assessment-result.component.html',
  styleUrls: ['./assessment-result.component.css']
})
export class AssessmentResultComponent extends BaseComponent implements OnInit {
  users: [] = [];
  aId: any = '1';
  uId: string;
  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr)
  }

  ngOnInit(): void {
    if (this.roleId != '4') {
      this.changeTname();
    }
  }
  changeTname() {
    const { company_id = 0 } = sessionStorage;
    this.courseId = '';
    // this.aId='';
    this.uId = '';
    let tnt_code = this.tId == '' ? this.TenantCode : this.tId || this.TenantCode;
    this.activeSpinner();
    this.CommonService.postCall('GetStudents', { TENANT_CODE: tnt_code, company_id }).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        this.users = res;
      }, err => {
        this.deactivateSpinner();
      }
    )
  }
  userChange() {
    this.courseId = '';
    // this.aId='';
    this.typeChange();
  }
  typeChange() {
    this.courseId = '';
    if (this.uId && this.uId == '') return
    let id = this.uId == '' ? 0 : this.uId;
    this.activeSpinner();
    let url = constants['GetCourses'] || 'GetCourses'
    this.CommonService.getCall(url + '/' + id + '/3',).subscribe(
      (res) => {
        this.deactivateSpinner();
        this.courses = res;
      }, err => {
        this.deactivateSpinner();
      }
    )
  }
  submit() {
    if (this.courseId && this.courseId != '' && this.uId && this.uId != '' && this.aId && this.aId != '') {
      this.activeSpinner();
      let payload = {
        TENANT_CODE: this.tId ? this.tId : this.TenantCode,
        RESULT_STUDENT_ID: parseInt(this.uId),
        RESULT_ASSESSMENT_TYPE: parseInt(this.aId),
        RESULT_COURSE_ID: parseInt(this.courseId)
      }
      this.CommonService.postCall('GetAssessmentResult', payload).subscribe(
        (res) => {
          this.deactivateSpinner();
          this.table = res;
        }, err => {
          this.deactivateSpinner();
        }
      )
    } else {
      this.toastr.warning("Please Select Mandatory Fields");
    }
  }
  update(item) {
    if (item.RESULT_ATTEMPTSLEFT.trim() != '' && item.RESULT_ATTEMPTSLEFT > -1) {
      this.activeSpinner();
      let payload = {
        RESULT_ATTEMPTSLEFT: item.RESULT_ATTEMPTSLEFT,
        RESULT_ID: item.RESULT_ID
      }
      this.CommonService.postCall('UpdateAssessmentResult', payload).subscribe(res => {
        this.deactivateSpinner();
        this.toastr.success("Information Saved successfully");
      }, e => {
        this.deactivateSpinner();
        this.toastr.error(e.error ? e.error.text || e.error : "Information not updated")
      })
    } else {
      this.toastr.warning("Please Enter The Value")
    }
  }
}
