import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { FileuploadService } from '../../services/fileupload.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent extends BaseComponent implements OnInit {

  dtF = DateFrmts; params: any = ''; userDetails: any = ''; subscribeDetails: any = '';
  cmpny_id: any = sessionStorage.getItem('company_id');
  allDropDwns: any = ''; // subCountyList: any[] = []; subCounty: any = '';
  dt2Day: any = new Date(); defluDF: string = 'DD-MM-YYYY';
  dtPkrCnfg: any = {bsInlineValue:true, isAnimated: true, adaptivePosition: true, dateInputFormat: 'DD-MM-YYYY', showWeekNumbers: false };
  screenType: string = 'add'; job_title: any = ''; isSubmt: boolean = false;
  // slryFrm: number = 0; slryTo: number = 0; jobCatgry: any = '';
  // stngsMSD(isSngl: boolean, 
  //   idFld: string, txtFld: string, alwSrch: boolean = true, itmShwLmt: number = 2, slctAllTxt: string = 'Select All', 
  //   unSlctAllTxt: string = 'UnSelect All', noDatTxt: string = '') {
  //   return { singleSelection: isSngl, idField: idFld,  textField: txtFld,  allowSearchFilter: alwSrch, itemsShowLimit: itmShwLmt,
  //     selectAllTxt: slctAllTxt, unSelectAllTxt: unSlctAllTxt, closeDropDownOnSelection: isSngl, noDataAvailablePlaceholderText: noDatTxt };
  // };

  jobApplyForm = this.fb.group({
    job_id: [0], 
    company_id: [0],
    firstname: ['', Validators.required],
    lastname: [''], 
    email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    phone_number: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]],
    date_birth: ['', Validators.required],
    location: [''], 
    education_level_id: [''],
    experience_level_id: [''],
    skills: [''],
    resume: [''],
    created_by: [0],
    updated_by: [0],
    tnt_code: [0],
    student_id: [0]
    // gender_id: [''],
  })

  get fc() { return this.jobApplyForm.controls }
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr)
    this.userDetails =  JSON.parse(<any>sessionStorage.getItem('userDetails'));
    if (sessionStorage.getItem('subscribeData') != null && sessionStorage.getItem('subscribeData') != 'undefined') {
      this.subscribeDetails = '',
      this.subscribeDetails = JSON.parse(<string>sessionStorage.getItem('subscribeData'));
    };

    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        this.AllDropDowns();
        this.GetById(res.jobId)
        //  this.jobId = res.job_id;
        // this.params = res;
        // this.screenType = this.params?.type,
        // this.job_title = this.params?.job_title
        // this.editData = res;
        // this.BindData
        // this.jobApplyForm.patchValue({
        //   job_id: this.params?.job_id,
        //   company_id: this.params?.company_id,
        //   created_by: this.params?.created_by,
        //   updated_by: this.params?.updated_by,
        //   tnt_code: this.params?.tnt_code
        // })
      }
    })
  }
  
  ngOnInit(): void {
    this.dtPkrCnfg = { isAnimated: true, adaptivePosition: true, dateInputFormat: this.defluDF , showWeekNumbers: false };
    if(this.screenType == 'add') {
      this.AllDropDowns();
    }
  }

  AllDropDowns() { // http://localhost:56608/api/Registration/GetJobMasterList/KENYA
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;
   })
  }

  typesOfFile: object = {
    'Uploaded Resume': {
      types: ['doc', 'docx', 'pdf', 'jpg', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg'],
      message: 'Please upload the',
    },
    'Webinar Info': {
      types: ['m4v', 'avi', 'mpg', 'mp4'],
      message: "Please upload the "
    },
    'Resume': {
      types: ['pdf', 'xlsx', 'doc'],
      message: "Please upload the Flash file Like"
    },
    'Audio': {
      types: ['mp3', 'wav'],
      message: "please upload the"
    }
  };

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let materialType: object = this.typesOfFile['Resume']

      let check = materialType['types'].includes(filetype?.toLowerCase());
      if (check) {
        this.file = file;
        this.upload()
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning(materialType['message'] + JSON.stringify(materialType['types']))
        event.target.value = ''
      }
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/UploadMaterial');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
      } catch (e) { console.log(e); }

    }, err => { })
  }

  // contyChange(scId: any) {
  //   this.subCountyList = [];
  //   this.CommonService.activateSpinner();
  //   this.CommonService.postCall('Registration/GetSubCountiesList', { counties_id: scId }).subscribe(
  //     (res) => {
  //       this.subCountyList = res.data;
  //       this.CommonService.deactivateSpinner()
  //     }, err => {
  //       this.CommonService.deactivateSpinner()
  //     }
  //   )
  // }
  /*
  http://localhost:56608/api/InternshipJobs/GetList
{

  "company_id": 1,

  "tnt_code": 18960549,

  "job_id": 1

}
 
  */

  GetById(iD: any) { // http://localhost:56608/api/InternshipJobs/JobGetById/job_id
    this.activeSpinner();
    this.CommonService.getCall(`InternshipJobs/JobGetById/${iD}`, '', false).subscribe(
          (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.editData = res.data[0];
          this.BindData()
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

  SubscriptionCheck() { //InternshipJobs/UpdateSubscriberPlan/{user_id}/{subscriber_id}/{applied_type}
    this.activeSpinner();
    this.CommonService.getCall(`InternshipJobs/UpdateSubscriberPlan/${sessionStorage.UserId}/${this.subscribeDetails?.subscriber_id}/Job`, '', false).subscribe(
          (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();

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

  BindData() {
    this.jobApplyForm.patchValue({
      job_id: this.editData?.job_id,
      company_id: this.editData?.company_id,
      created_by: this.editData?.created_by,
      updated_by: this.editData?.updated_by,
      tnt_code: this.editData?.tnt_code,

      firstname: this.userDetails.FIRSTNAME,
      lastname: this.userDetails.LASTNAME,
      email: this.userDetails.USERNAME,
      phone_number: this.userDetails?.MobileNo,
      // date_birth: `${new Date(this.userDetails?.DOB)}`,
    })
    this.job_title = this.editData?.job_title
  }

  Save() { // InternshipJobs/SaveOrUpdateJobApplications
    if (this.jobApplyForm.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }
    if (this.fileName == '' || this.fileName == null) {
      this.toastr.warning('Please attach Resume');
      return;
    }
    let payLoad = this.jobApplyForm.getRawValue();
    if(payLoad.date_birth == null || payLoad.date_birth == '') {
      this.toastr.warning('Please Enter Date of Birth');
      return;
    }
    payLoad.created_by = sessionStorage.UserId;
    payLoad.student_id = sessionStorage.UserId;
    // payLoad.company_id = +sessionStorage.company_id;
    if (this.fileName)
      payLoad.resume = this.fileName;
    payLoad.updated_by = payLoad.job_id !=0 ? sessionStorage.UserId: 0;
    payLoad.date_birth = payLoad.date_birth != null && payLoad.date_birth != '' ? this.CommonService.setDtFrmt( new Date(payLoad.date_birth), this.dtF.ymd): '';
    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/SaveOrUpdateJobApplications', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.toastr.success(res.message), this.SubscriptionCheck();
          // window.history.back()
          this.Back();
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

  Back(){
    // window.history.back()
    this.router.navigate(['/HOME/cmpnyLst'])
  }
}
