import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';
// import { BaseComponent } from 'src/base.component';

@Component({
  selector: 'app-job-add',
  templateUrl: './job-add.component.html',
  styleUrls: ['./job-add.component.css']
})
export class JobAddComponent extends BaseComponent implements OnInit {
  tooltipContent = `
					1. Company admins can post a new job from this section. <br>
2. Fill in all the mandatory and required fields, then click <strong>Save. </strong><br><br>
Once saved, the job request will be sent to the admin for <strong>review and approval. </strong><br><br>
Only after approval, the job will be <strong>visible on the portal</strong> and accessible to students and job seekers.
					`;
  dtF = DateFrmts; params: any = '';
  cmpny_id: any = sessionStorage.getItem('company_id');
  allDropDwns: any = ''; subCountyList: any[] = []; subCounty: any = '';
  genders: any[] = []; dt2Day: any = new Date(); defluDF: string = 'DD-MM-YYYY';
  dtPkrCnfg: any = { bsInlineValue: true, isAnimated: true, adaptivePosition: true, dateInputFormat: 'DD-MM-YYYY', showWeekNumbers: false };
  screenType: string = 'add'; slctdLanguageLst: any[] = []; slctLngList: any = '';
  slryFrm: number = 0; slryTo: number = 0; jobCatgry: any = '';
  CountryList: any=[]; subscribeDetails: any = '';
  countyList: any=[];
  isPublicView: boolean = false;
  stngsMSD(isSngl: boolean,
    idFld: string, txtFld: string, alwSrch: boolean = true, itmShwLmt: number = 2, slctAllTxt: string = 'Select All',
    unSlctAllTxt: string = 'UnSelect All', noDatTxt: string = '') {
    return {
      singleSelection: isSngl, idField: idFld, textField: txtFld, allowSearchFilter: alwSrch, itemsShowLimit: itmShwLmt,
      selectAllTxt: slctAllTxt, unSelectAllTxt: unSlctAllTxt, closeDropDownOnSelection: isSngl, noDataAvailablePlaceholderText: noDatTxt
    };
  };

  createJobForm = this.fb.group({
    job_id: [0],
    job_title: ['',Validators.required],
    company_id: [this.cmpny_id],
    job_description: ['',Validators.required],
    job_responsibilities: ['',Validators.required],
    job_skills: ['',Validators.required],
    education_level_id: ['',Validators.required],
    experience_level_id: ['',Validators.required],
    country_id:['',Validators.required],
    county_id: ['',Validators.required],
    sub_county_id: ['',Validators.required],
    zip_code: ['',Validators.required],
    job_type_id: ['',Validators.required],
    shift_id: ['',Validators.required],
    pay_type_id: ['',Validators.required],
    no_of_positions: ['',Validators.required],
    language_ids: [''],
    job_posted_date: [this.dt2Day,Validators.required],
    job_expiry_date: [this.dt2Day,Validators.required],
    job_salary_from: [0,Validators.required],
    job_salary_to: [0,Validators.required],
    is_active: [true],
    location: [''],
    created_by: [0],
    updated_by: [0],
    tnt_code: [''],
    job_category_id: ['',Validators.required],
    // gender_id: [''],
  })


  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService) {
    super(CommonService, toastr)
    
    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        this.params = res;
        this.screenType = this.params?.type;
        this.isPublicView = this.params?.publicView === 'true';
        
        // Only check subscription if not in public view mode
        if (!this.isPublicView) {
          if (sessionStorage.getItem('subscribeData') != null && sessionStorage.getItem('subscribeData') != 'undefined') {
            this.subscribeDetails = '';
            this.subscribeDetails = JSON.parse(<string>sessionStorage.getItem('subscribeData'));
          }
        }
        
        this.AllDropDowns();
        this.GetById(this.params?.id);
      }
    });
  }
  get f() {
    return this.createJobForm.controls
  }

  ngOnInit(): void {
    this.dtPkrCnfg = { isAnimated: true, adaptivePosition: true, dateInputFormat: this.defluDF, showWeekNumbers: false };
    if (this.screenType == 'add') {
      this.AllDropDowns();
    }
    this.countries();
    this.PostJob();
    this.createJobForm?.get('job_posted_date').disable();
  }

  PostJob() {
    // Skip subscription check if in public view mode (just viewing)
    if (this.isPublicView) {
      return;
    }

    let today = new Date();
    let dateToCheck = new Date(this.subscribeDetails?.expired_date);

    // Remove time for accurate comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    let isFutureDate: boolean = dateToCheck < today;
    if (this.subscribeDetails == '' || this.subscribeDetails == 'undefined' ) {
      this.toastr.info('Please Subscribe');
      this.router.navigate(['/HOME/subscribe']);
    }
    //  else 
    if(this.subscribeDetails?.jobs_remaining == 0 || isFutureDate) {
      this.toastr.info('Subscription is Expired');
      this.router.navigate(['/HOME/subscribe']);
    }
    //  else {
    //   this.router.navigate(['HOME/job'])
    // }
    // if (this.isLogin) {
    // } else 
    //   this.router.navigate(['/login'], { queryParams: {job_id: params.job_id} });
  }

  AllDropDowns() { // http://localhost:56608/api/Registration/GetJobMasterList/KENYA
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;
      })
  }

  countries() {
    this.CommonService.activateSpinner();
    this.CommonService.postCall('Registration/GetCountrys','').subscribe(
      (res) => {
        this.CountryList = res.data;
        let country = this.CountryList.find((e:any)=> e.country_name.toLowerCase() == 'kenya').country_id
        this.createJobForm.patchValue({country_id : country});
        this.countyDropdowns(country)
        this.CommonService.deactivateSpinner();
      }, err => {
        this.CommonService.deactivateSpinner()
      }
    )
  }

  countyDropdowns(item) {
    let payLoad = {
      "country_id": item,
    }
    this.CommonService.postCall("Registration/GetCountiesListByCountryId",payLoad).subscribe((res: any) => {
      this.countyList = res.data;
    }, (err: any) => {
      return this.toastr.error(
        err.error ? err.error : "No County's found!"
      );
    })
  }
  
  contyChange(scId: any) {
    this.subCountyList = [];
    this.CommonService.activateSpinner();
    this.CommonService.postCall('Registration/GetSubCountiesList', { counties_id: scId }).subscribe(
      (res) => {
        this.subCountyList = res.data;
        this.CommonService.deactivateSpinner()
      }, err => {
        this.CommonService.deactivateSpinner()
      }
    )
  }
  /*
  http://localhost:56608/api/InternshipJobs/GetList
{

  "company_id": 1,

  "tnt_code": 18960549,

  "job_id": 1

}
 
  */

  salryValdtn() {
    if (this.slryTo < this.slryFrm) {
      this.toastr.warning('Salary Range To is More than Salary Range From'), this.slryTo = 0;
    }
  }

  GetById(iD: any) {
    this.CommonService.activateSpinner();
    
    // For public view, use a simpler API call that doesn't require company_id
    if (this.isPublicView) {
      this.CommonService.getCall(`InternshipJobs/JobGetById/${iD}`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            if (res.data.length > 0) {
              this.editData = res.data[0];
              this.contyChange(this.editData?.county_id);
              this.BindData();
              let srvcIds: any = this.editData?.language_ids.split(',').map(Number);
              this.slctLngList = [];
              setTimeout(() => {
                this.slctLngList = this.allDropDwns.languages.filter(lang => srvcIds.includes(lang.id));
                this.slctLngList = [...this.slctLngList];
              }, 1000);
            } else {
              this.toastr.success(res.message);
            }
          }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Job related record not getting');
          window.history.back();
        }
      );
    } else {
      // For admin view, use the original API with company_id
      let payLoad: any = { company_id: this.cmpny_id, tnt_code: sessionStorage.getItem('TenantCode'), job_id: iD };
      this.CommonService.postCall('InternshipJobs/GetList', payLoad).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            if (res.data.length > 0) {
              this.editData = res.data[0];
              this.contyChange(this.editData?.county_id);
              this.BindData();
              let srvcIds: any = this.editData?.language_ids.split(',').map(Number);
              this.slctLngList = [];
              setTimeout(() => {
                this.slctLngList = this.allDropDwns.languages.filter(lang => srvcIds.includes(lang.id));
                this.slctLngList = [...this.slctLngList];
              }, 1000);
            } else {
              this.toastr.success(res.message);
            }
          }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Job related record not getting');
          window.history.back();
        }
      );
    }
  }

  BindData() {
    this.slryFrm = this.editData?.job_salary_from, this.slryTo = this.editData?.job_salary_to, this.jobCatgry = this.editData?.job_category_id
    this.createJobForm.patchValue({
      job_id: this.editData?.job_id,
      job_title: this.editData?.job_title,
      company_id: this.editData?.company_id,
      job_description: this.editData?.job_description,
      job_responsibilities: this.editData?.job_responsibilities,
      job_skills: this.editData?.job_skills,
      education_level_id: this.editData?.education_level_id,
      experience_level_id: this.editData?.experience_level_id,
      county_id: this.editData?.county_id,
      sub_county_id: this.editData?.sub_county_id,
      zip_code: this.editData?.zip_code,
      job_type_id: this.editData?.job_type_id,
      shift_id: this.editData?.shift_id,
      pay_type_id: this.editData?.pay_type_id,
      no_of_positions: this.editData?.no_of_positions,
      language_ids: this.editData?.language_ids,
      // job_posted_date: this.CommonService.setDtFrmt(new Date(this.editData?.job_posted_date), this.dtF.dmy),
      // job_expiry_date: this.CommonService.setDtFrmt(new Date(this.editData?.job_expiry_date), this.dtF.dmy),

      // job_salary_from: this.editData?.job_salary_from,
      // job_salary_to: this.editData?.job_salary_to,
      // created_at: this.editData?.created_at,
      // updated_at: this.editData?.updated_at,
      location: this.editData?.location,
      created_by: this.editData?.created_by,
      updated_by: this.editData?.updated_by,
      tnt_code: this.editData?.tnt_code,
      // job_category_id: this.editData?.job_category_id
      // is_active: this.editData?.is_active,
    })

    let pstdDte: any = this.editData?.job_posted_date != null && this.editData?.job_posted_date !='' ? new Date(this.editData?.job_posted_date): '';
    let expreDte: any = this.editData?.job_expiry_date != null && this.editData?.job_expiry_date !='' ? new Date(this.editData?.job_expiry_date): '';
    this.createJobForm?.get('job_posted_date').setValue(pstdDte),
    this.createJobForm?.get('job_expiry_date').setValue(expreDte)
  }

  Save() { 
    if (this.createJobForm.invalid) {
      this.createJobForm.markAllAsTouched();
      this.toastr.warning('Please Enter Mandatory Fields')  // Correct way to mark all fields
    }
    if (this.createJobForm.invalid) {
      this.createJobForm.markAllAsTouched();
      this.toastr.warning('Please Enter Mandatory Fields')  // Correct way to mark all fields
    }

    else{
    this.CommonService.activateSpinner();
    let payLoad = this.createJobForm.getRawValue();
    payLoad.created_by = sessionStorage.UserId;
    payLoad.company_id = +sessionStorage.company_id;
    // payLoad.updated_at = sessionStorage.UserId;
    payLoad.updated_by = payLoad.job_id != 0 ? sessionStorage.UserId : 0;
    payLoad.tnt_code = sessionStorage.getItem('TenantCode');
    payLoad.job_posted_date = this.CommonService.setDtFrmt(new Date(payLoad.job_posted_date), this.dtF.ymd)// payLoad.job_posted_date != '' && payLoad.job_posted_date != null ? this.CommonService.setDtFrmt( new Date(payLoad.job_posted_date), this.dtF.ymd): '',
    payLoad.job_expiry_date = this.CommonService.setDtFrmt(new Date(payLoad.job_expiry_date), this.dtF.ymd)// payLoad.job_expiry_date != '' && payLoad.job_expiry_date != null ? this.CommonService.setDtFrmt( new Date(payLoad.job_expiry_date), this.dtF.ymd): '',
    // payLoad.created_at = this.CommonService.setDtFrmt( new Date(), this.dtF.ymd)// payLoad.job_expiry_date != '' && payLoad.job_expiry_date != null ? this.CommonService.setDtFrmt( new Date(payLoad.job_expiry_date), this.dtF.ymd): '',
    payLoad.language_ids = this.slctdLanguageLst.length > 0 ? this.slctdLanguageLst.map(item => item.id).join(',') : '';
    // if (+this.params.rId == 2)
    //   payLoad.Company_id = +sessionStorage.company_id;
    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/SaveOrUpdate', payLoad).subscribe(
      (res: any) => {
        if (res?.status == true) {
          this.deactivateSpinner();
          this.toastr.success(res.message);
          window.history.back();
          this.deactivateSpinner(), this.Back();
        } else {
          this.toastr.success(res.message);
          this.deactivateSpinner();
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'User not Registered');
        // window.history.back()
      })
    }
  }

  Back() {
    if (this.isPublicView) {
      this.router.navigate(['/jobs']);
    } else {
      this.router.navigate(['/HOME/jobsMnu']);
    }
  }

  onMSD(type: string, ctrl: string, item: any) {
    if (type == 's') {
      if (ctrl == 'Ln') {
        if (this.slctdLanguageLst.filter((f: { id: any; }) => f.id == item.id).length == 0)
          this.slctdLanguageLst.push(item);
      }
    }
    else if (type == 'r') {
      if (ctrl == 'Ln')
        this.slctdLanguageLst = [];
    }
    else if (type == 'a') {
      if (ctrl == 'Ln')
        this.slctdLanguageLst = this.allDropDwns.languages;
    }
    else {
      if (ctrl == 'Ln')
        this.slctdLanguageLst = this.slctdLanguageLst.filter((f: { id: any; }) => f.id != item.id);
    }
  }

  // Helper methods for view mode
  getJobCategoryName(): string {
    const categoryId = this.createJobForm.get('job_category_id')?.value;
    return this.allDropDwns?.job_category?.find(c => c.id === categoryId)?.name || '';
  }

  getJobTypeName(): string {
    const typeId = this.createJobForm.get('job_type_id')?.value;
    return this.allDropDwns?.jobtype?.find(t => t.id === typeId)?.name || '';
  }

  getShiftName(): string {
    const shiftId = this.createJobForm.get('shift_id')?.value;
    return this.allDropDwns?.shift?.find(s => s.id === shiftId)?.name || '';
  }

  getEducationLevelName(): string {
    const eduId = this.createJobForm.get('education_level_id')?.value;
    return this.allDropDwns?.education_level?.find(e => e.id === eduId)?.name || '';
  }

  getExperienceLevelName(): string {
    const expId = this.createJobForm.get('experience_level_id')?.value;
    return this.allDropDwns?.experience_level?.find(e => e.id === expId)?.name || '';
  }

  getPayTypeName(): string {
    const payId = this.createJobForm.get('pay_type_id')?.value;
    return this.allDropDwns?.paytype?.find(p => p.id === payId)?.name || '';
  }

  getCountryName(): string {
    const countryId = this.createJobForm.get('country_id')?.value;
    return this.CountryList?.find(c => c.country_id === countryId)?.country_name || '';
  }

  getCountyName(): string {
    const countyId = this.createJobForm.get('county_id')?.value;
    return this.countyList?.find(c => c.COUNTIES_CODE === countyId)?.COUNTIES_NAME || '';
  }

  getSubCountyName(): string {
    const subCountyId = this.createJobForm.get('sub_county_id')?.value;
    return this.subCountyList?.find(s => s.sub_counties_id === subCountyId)?.sub_counties_name || '';
  }

  applyForJob() {
    const jobId = this.createJobForm.get('job_id')?.value;
    const userId = sessionStorage.getItem('UserId');

    if (!userId) {
      // User not logged in, redirect to login
      sessionStorage.setItem('viewJobId', jobId.toString());
      sessionStorage.setItem('returnUrl', `/HOME/job?type=view&id=${jobId}&publicView=true`);
      this.toastr.info('Please login to apply for this job');
      this.router.navigate(['/login']);
      return;
    }

    // Check subscription only when applying
    if (this.subscribeDetails == '' || this.subscribeDetails == undefined || this.subscribeDetails == null) {
      this.toastr.info('Please Subscribe to apply for jobs');
      this.router.navigate(['/HOME/subscribe']);
      return;
    }

    let today = new Date();
    let dateToCheck = new Date(this.subscribeDetails?.expired_date);
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    let isFutureDate: boolean = dateToCheck < today;

    if (this.subscribeDetails?.jobs_remaining == 0 || isFutureDate) {
      this.toastr.info('Subscription is Expired');
      this.router.navigate(['/HOME/subscribe']);
      return;
    }

    // Navigate to apply job page
    this.router.navigate(['/HOME/applyJob'], { queryParams: { jobId: jobId } });
  }
}

