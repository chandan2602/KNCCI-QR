import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-approve-jobs-internships',
  templateUrl: './approve-jobs-internships.component.html',
  styleUrls: ['./approve-jobs-internships.component.css']
})
export class ApproveJobsInternshipsComponent extends BaseComponent implements OnInit {

  jobListGrid: any[] = []; 
  courseListGrid: any[] = [];
  isAddEdt = false; 
  isAprveRejct: any = 2; 
  super_admin_app_rej_comments: any =''; 
  parentId: number = 0;
  roleId: any = sessionStorage.getItem('RoleId'); 
  tableId: any = ''; 
  screnType: any = 'add'; 
  type: string = 'Job';
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; 
  intrnListGrid: any[] = [];

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
    if(this.type == 'Job') {
      this.LoadGridOfJob()
    }
    if(this.type == 'Internship') {
      this.LoadGridOfIntrnship()
    }
    if(this.type == 'Course') {
      this.LoadGridOfCourse()
    }
  }

  LoadGridOfJob() {
    this.jobListGrid = [];
    this.CommonService.activateSpinner();
    let payLoad: any = {company_id: 0, tnt_code: 0, job_id: 0}
    this.CommonService.postCall('InternshipJobs/GetList', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.jobListGrid = res.data;
        } else {
          this.deactivateSpinner();
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
        // window.history.back()
      })
  }

  LoadGridOfIntrnship() {
    this.intrnListGrid = [];
      // this.activeSpinner()
    let payLoad = { TENANT_CODE: 0, RoleId: 0, USER_ID: 0 };
    this.CommonService.postCall("LoadCourse", payLoad).subscribe((res: any) => {
      this.intrnListGrid = res;
      this.renderDataTable();
      // this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  LoadGridOfCourse() {
    this.courseListGrid = [];
    this.CommonService.activateSpinner();
    
    this.CommonService.getCourseApplications().subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          
          // Filter only pending courses from the response
          const allCourses = res.data || [];
          this.courseListGrid = allCourses.filter((course: any) => 
            course.course_approval_status === 'Pending' || 
            course.approval_status === 'Pending'
          );
          
          this.renderDataTable();
        } else {
          this.deactivateSpinner();
          this.toastr.warning(res.message || 'No courses found');
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Error loading courses');
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


  Back() {
    this.isAddEdt = !this.isAddEdt, this.super_admin_app_rej_comments = '', this.LoadGrid();
  }

  /*
  http://localhost:56608/api/InternshipJobs/ApprovalJobInternship/Job
{
    "job_id":11,
    "super_admin_app_rej_by":3,
    "super_admin_app_rej_status":2,
    "super_admin_app_rej_comments":"selected"
}
 
  */
  onCheck(evnt: any) {
    // this.jobId = this.tableId?.job_id;
    if(this.screnType == 'view') {
      this.super_admin_app_rej_comments = (this.type == 'Internship') ? this.tableId?.SUPER_ADMIN_APP_REJ_COMMENTS : this.tableId?.super_admin_app_rej_comments;
      // this.approve_comments = this.tableId?.incubatorDetails[0]?.comments
    }

  }

  Save() { // http://localhost:56608/api/InternshipJobs/ApprovalJobInternship/Job
    if(this.super_admin_app_rej_comments == '') {
        return this.toastr.warning(`Enter ${this.isAprveRejct==2 ? 'Approve' : 'Reject'} Comments`);
      }
      this.CommonService.activateSpinner();
      let payLoad: any = {};
      if(this.type == 'Job') {
        payLoad= {job_id: this.tableId?.job_id, super_admin_app_rej_status: this.isAprveRejct, 
          super_admin_app_rej_by:`${sessionStorage.UserId}`, super_admin_app_rej_comments: this.super_admin_app_rej_comments}
      }
      if(this.type == 'Internship') {
        payLoad = { super_admin_app_rej_status: this.isAprveRejct, super_admin_app_rej_by:`${sessionStorage.UserId}`,
          super_admin_app_rej_comments: this.super_admin_app_rej_comments, course_id: this.tableId?.COURSE_ID }
      }
      if(this.type == 'Course') {
        const courseId = this.tableId?.id;
        payLoad = { 
          course_approval_status: this.isAprveRejct == 2 ? 'Approved' : 'Rejected',
          approved_by: sessionStorage.UserId,
          approval_comments: this.super_admin_app_rej_comments
        }
        this.CommonService.approveCourse(courseId, payLoad).subscribe(
          (res: any) => {
            if(res?.status == true) {
              this.deactivateSpinner();
              this.Back();
              this.LoadGridOfCourse();
              this.toastr.success(res.message || 'Course approval updated successfully');
            } else {
              this.deactivateSpinner();
              this.toastr.warning(res.message);
            }
          },
          err => {
            this.deactivateSpinner();
            this.toastr.warning(err.error ? err.error.text || err.error : 'Error updating course approval');
          })
        return;
      }
      this.CommonService.postCall(`InternshipJobs/ApprovalJobInternship/${this.type}`, payLoad).subscribe(
        (res: any) => {
          if(res?.status == true) {
            this.deactivateSpinner();
            this.Back(), this.LoadGridOfJob();
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

}
