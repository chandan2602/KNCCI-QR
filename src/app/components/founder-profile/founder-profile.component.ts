import {Component, ElementRef, ViewChildren, QueryList, AfterViewInit, OnInit} from '@angular/core';
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
  selector: 'app-founder-profile',
  templateUrl: './founder-profile.component.html',
  styleUrls: ['./founder-profile.component.css']
})
export class FounderProfileComponent extends BaseComponent implements OnInit, AfterViewInit {
  dtF = DateFrmts;
  currentStep = 0; userDetails: any = ''; isVisable: boolean = location.href.includes('/HOME/founderProfile');
  dt2Day: any = new Date(); defluDF: string = 'DD-MM-YYYY';
  dtPkrCnfg: any = {bsInlineValue:true, isAnimated: true, adaptivePosition: true, dateInputFormat: 'DD-MM-YYYY', showWeekNumbers: false };
  screenType: string = 'add'; isSubmt: boolean = false;
  isFounder = location.href.includes('/HOME/founder-view');
  @ViewChildren('stepRef') steps!: QueryList<ElementRef>;
  @ViewChildren('stepHeaderRef') headers!: QueryList<ElementRef>;
  setupRegForm = this.fb.group({ 
    username: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    UserType: [27],
    title: [38],
    firstname: ['', Validators.required],
    lastname: [''], 
    Gender: [1],
    mobileno: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    Role: [6],
    Timezone: "India Standard Time",
    CREATEDBY: [12345678],
    TENANT_CODE: [12345678],
    password: "abc123",
    confirmPassword: "abc123",
    company_id: [0],
    dob: ['', Validators.required],
    
    // gender_id: [''],
  })

  get fc() { return this.setupRegForm.controls }
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr)
    this.userDetails =  JSON.parse(<any>sessionStorage.getItem('userDetails'));
    if(this.isVisable) {
      this.GetById(sessionStorage.UserId), this.screenType = 'view';
    }
    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        if(this.isFounder) {
          this.GetById(res?.founderU_id), this.screenType = 'view';
        }

      }
    })
  }
  ngOnInit(): void {
  }

  GetById(uId: any) { // Registration/GetFounderByUserId/{user_id}
    if(uId != 0) {
      this.screenType = 'view';
      this.CommonService.activateSpinner();
      this.CommonService.getCall(`Registration/GetFounderByUserId/${uId}`, '', false).subscribe(
        (res: any) => {
          if(res?.status == true) {
            this.deactivateSpinner();
            this.editData = res.data;
            this.BindData()
          } else {
            this.toastr.success(res.message);
          }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
          window.history.back()
        })
    }
  }

  BindData() {
    this.setupRegForm.patchValue({
      firstname: this.editData?.firstname,
      lastname: this.editData?.lastname,
      username: this.editData?.emailid,
      mobileno: this.editData?.mobileno,
      // dob: this.editData?.dob != null && this.editData?.dob !='' ? new Date(this.editData?.dob): '',
      UserType: this.editData?.UserType,
      title: this.editData?.title,
      Gender: this.editData?.Gender,
      Role: this.editData?.Role,
      Timezone: this.editData?.Timezone,
      CREATEDBY: this.editData?.CREATEDBY,
      TENANT_CODE: this.editData?.TENANT_CODE,
      password: this.editData?.password,
      confirmPassword: this.editData?.confirmPassword,
      company_id: this.editData?.company_id,
    })
    let dte: any = this.editData?.dob != null && this.editData?.dob !='' ? new Date(this.editData?.dob): '';
    this.setupRegForm?.get('dob').setValue(dte)
  }

  Save() { // InternshipJobs/SaveOrUpdateJobApplications
    if (this.setupRegForm.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields', 'SignUp');
      return;
    }
    let payLoad = this.setupRegForm.getRawValue();
    if(payLoad.dob == null || payLoad.dob == '') {
      this.toastr.warning('Please Enter Date of Birth', 'SignUp');
      return;
    }
   
    // payLoad.company_id = +sessionStorage.company_id;
    if (this.fileName)
    payLoad.dob = payLoad.dob != null && payLoad.dob != '' ? this.CommonService.setDtFrmt( new Date(payLoad.dob), this.dtF.ymd): '';
    this.activeSpinner();
    this.CommonService.postCall('Registration/SaveRegistration', payLoad).subscribe(
      (res: any) => {
        this.toastr.success('Created Successfully'),
        // if(res?.status == true) {
        //   this.deactivateSpinner();
        //   this.toastr.success(res.message);
          // window.history.back()
          this.Back();
        // } else {
        //   this.toastr.success(res.message);
        // }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'User not Registered');
        // window.history.back()
      })
  }

  Back(){
    // window.history.back()
    this.router.navigate(['/signup'])
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

  ngAfterViewInit(): void {
    this.showStep(this.currentStep);
  }

  showStep(n: number) {
    this.steps.forEach((step, index) => {
      step.nativeElement.classList.toggle('active', index === n);
    });
    this.headers.forEach((header, index) => {
      header.nativeElement.classList.toggle('active', index === n);
    });
  }

  nextPrev(n: number) {
    const currentForm = this.steps.toArray()[this.currentStep].nativeElement.querySelectorAll('input, select, textarea');
    for (const input of currentForm) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
    }

    this.currentStep += n;

    // Clamp value within bounds
    this.currentStep = Math.max(0, Math.min(this.currentStep, this.steps.length - 1));

    this.showStep(this.currentStep);
  }

  toggleFunding(value: string) {
    const ticketSizeDiv = document.getElementById('ticketSizeDiv');
    if (ticketSizeDiv) {
      ticketSizeDiv.style.display = value === 'Yes' ? 'block' : 'none';
    }
  }

  toggleFees(value: string) {
    const feeDetails = document.getElementById('feeDetails');
    if (feeDetails) {
      feeDetails.style.display = value === 'Yes' ? 'block' : 'none';
    }
  }

  onSubmit() {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-5">
          <h2 class="text-success mb-3">🎉 Thank you for submitting!</h2>
          <p>We’ve received your incubator registration successfully.</p>
        </div>
      `;
    }
  }

}
