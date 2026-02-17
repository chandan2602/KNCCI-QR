import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-jobs-in-company-lst',
  templateUrl: './jobs-in-company-lst.component.html',
  styleUrls: ['./jobs-in-company-lst.component.css']
})
export class JobsInCompanyLstComponent extends BaseComponent implements OnInit {

  allDropDwns: any = ''; listGrid: any[] = []; job_title: any = ''; job_category_id: any = 0; county_id: any = 0; 
  job_type_ids: any = ''; jobTypeLst: any[] = []; companyList: any[] = []; company_id: any = 0; isSalary = '0';
  job_salary_from: number = 0; job_salary_to: number = 0;
  			tooltipContent = `
					Browse job listings posted by companies using filters like company name, location, salary, and job type. Click on a job card to view full details including job description and contact information. To apply, click <strong>Apply Job Now, </strong> fill out the form, attach your resume, and submit your application.
					`;

  constructor(private route: Router,
    CommonService: CommonService, public fb: FormBuilder, 
    public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
   }

   ngOnInit(): void {
    this.AllDropDowns(), this.getCompanyList(), this.LoadGrid();
  }

  // Web Functionality
  AllDropDowns() { // http://localhost:56608/api/Registration/GetJobMasterList/KENYA
    this.jobTypeLst = [];
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;

        this.jobTypeLst = this.allDropDwns?.jobtype.map( e => ({ ...e, isSts: false}))
   })
  }

   LoadGrid(ctrl='') { // InternshipJobs/HomePageGetList
    // let job_salary_from: number = 0, job_salary_to: number = 0;
    this.CommonService.activateSpinner();
    let job_Type = this.jobTypeLst.filter(item => item.isSts == true).map(item => item.id).join(',');
    let payLoad: any = { job_title: this.job_title, job_category_id: this.job_category_id, 
      county_id: this.county_id, job_type_ids: job_Type, shift_id: 0, company_id: this.company_id, 
      job_salary_from: this.job_salary_from, job_salary_to: this.job_salary_to }
    this.CommonService.postCall('InternshipJobs/GetActiveJobList', payLoad).subscribe(
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

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
      // console.log(this.companyList);
    })
  }

  ApplyJob(evnt: any) {
    let params = evnt
  
    // if (this.isLogin) {
      this.router.navigate(['HOME/jobSummery'], {  queryParams: {job_id: evnt.job_id, jobApply: true} })
  //   } else 
  //     this.router.navigate(['/login'], { queryParams: {job_id: evnt.job_id} });
  }

}
