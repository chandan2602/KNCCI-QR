import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { constants } from 'src/app/constants';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.css']
})

export class LandingHomeComponent extends BaseComponent {

  intrmcompany_id = '0'; allDropDwns: any; job_type_ids = ''; county_id = 0; job_title = ''; jobSearchType = 'job'; courseList: any[] = [];
  isShowCourseSche = false; companyList: any[] = []; jobTypeLst: any[] = []; job_salary_from = 0; job_salary_to = 0; job_category_id = 0;
  company_id = 0; listGrid: any[] = []; isShw = false;

  constructor(CommonService: CommonService,
    toastr: ToastrService,
    private rtr: Router) {
    super(CommonService, toastr);
    this.AllDropDowns(), this.getCompanyList();
  }

  LoadGrid(ctrl: string) {
    this.CommonService.activateSpinner();
    let job_Type = this.jobTypeLst.filter(item => item.isSts == true).map(item => item.id).join(',');
    ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
    let payLoad: any = { job_title: this.job_title, job_category_id: this.job_category_id, 
      county_id: this.county_id, job_type_ids: job_Type, shift_id: 0, company_id: this.company_id, 
      job_salary_from: this.job_salary_from, job_salary_to: this.job_salary_to }
    this.CommonService.postCall('InternshipJobs/GetActiveJobList', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data, ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true, this.isShw = false,
            this.rtr.navigate(['/cmpnyLst']);
        } else {
          this.isShw = false, this.toastr.warning(res.message);
        }
      },
      err => {
        this.isShw = false, this.deactivateSpinner(), this.toastr.warning(err.error ? err.error.text || err.error :
          'Job relatd record not getting');
      })
  }

  AllDropDowns() {
    this.jobTypeLst = [];
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data, this.jobTypeLst = this.allDropDwns?.jobtype.map( e => ({ ...e, isSts: false}))
    })
  }

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
    })
  }

  getAllCourseCategory(ctrl = '') {
    ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
    this.CommonService.getCall(`${constants.GetAllActiveCoursesByCategoryId}`, `/0/${+this.intrmcompany_id}`).subscribe((res: any) => {
      let allCourseList: any = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
          count: 120,
          discount: 500
        }));
      this.courseList = allCourseList;

      if (this.courseList.length == 0) {
        this.toastr.info('No records Found');
      }
      this.isShowCourseSche = true;
    })
  }

  SrchType() {
    if(this.jobSearchType=='job') {
      let xy = { job_title: this.job_title, job_category_id: 0, 
        county_id: this.county_id, job_type_ids: '', shift_id: 0, company_id: this.company_id, 
        job_salary_from: 0, job_salary_to: 0 };
        sessionStorage.setItem('jobPL', JSON.stringify(xy))
      this.rtr.navigate(['/job'], { queryParams: {type : 'job'} });
    }
    if(this.jobSearchType=='internship') {
      sessionStorage.setItem('intrenshipPL', `${this.intrmcompany_id}`)
      this.rtr.navigate(['/internship'], { queryParams: {type : 'internship'} });
    }
  }

}