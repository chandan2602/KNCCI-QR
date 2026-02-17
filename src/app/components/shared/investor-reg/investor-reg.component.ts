import {Component, ElementRef, ViewChildren, QueryList, AfterViewInit, OnInit} from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../../app/services/common.service';
import { FileuploadService } from '../../../services/fileupload.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-investor-reg',
  templateUrl: './investor-reg.component.html',
  styleUrls: ['./investor-reg.component.css']
})
export class InvestorRegComponent extends BaseComponent implements OnInit, AfterViewInit {

  dtF = DateFrmts; slctTrgtSctrList: any[] = []; slctSrvcOfrd: any[] = [];
  slctdTrgtSctrList: any[] = []; slctdSrvcOfrd: any[] = []; dateOfBirth: any = '';
  currentStep = 0; isVisable: boolean = location.href.includes('/HOME/investrProfile');
  portfolioPath: any = '';
  profilePath: any = '';
  kycPath: any = '';
  acrdtonProfPath: any = '';
  userDetails: any = '';
  dt2Day: any = new Date(); 
  defluDF: string = 'DD-MM-YYYY';
  dtPkrCnfg: any = {bsInlineValue:true, isAnimated: true, adaptivePosition: true, dateInputFormat: 'DD-MM-YYYY', showWeekNumbers: false };
  stngsMSD(isSngl: boolean, 
    idFld: string, txtFld: string, alwSrch: boolean = true, itmShwLmt: number = 2, slctAllTxt: string = 'Select All', 
    unSlctAllTxt: string = 'UnSelect All', noDatTxt: string = '') {
    return { singleSelection: isSngl, idField: idFld,  textField: txtFld,  allowSearchFilter: alwSrch, itemsShowLimit: itmShwLmt,
      selectAllTxt: slctAllTxt, unSelectAllTxt: unSlctAllTxt, closeDropDownOnSelection: isSngl, noDataAvailablePlaceholderText: noDatTxt };
  };
  screenType: string = 'add'; dirctFndng: any = 'no'; chrgeStrtup: any = 'no';
  isSubmt: boolean = false;
  allDropDwns: any = '';
  @ViewChildren('stepRef') steps!: QueryList<ElementRef>;
  @ViewChildren('stepHeaderRef') headers!: QueryList<ElementRef>;

  invertorForm = this.fb.group({  
       
    investor_id: [0],
    name: ['', Validators.required],
    investor_type_id:[0],
    website:[''],
    email_id: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    mobile_no: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    official_address: [''],
    accredited_investor: ['no'],
    average_investment_id: [''],
    investment_stages_ids: [''],
    certificate_of_recognition: [''],
    sectors_of_interest_ids: [''],
    decision_makers: [''],
    portfolio: [''],
    investor_profile: [''],
    kyc_document: [''],
    proof_accreditation: [''],
    preferred_method_id: [0],
    startup_dealflow: ['no'],
    is_confirm: [false],
    is_agreed: [false],
    tnt_code:[12345678],
    userDetails: ['']
  })

  get fc() { return this.invertorForm.controls }
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr)
    this.userDetails =  JSON.parse(<any>sessionStorage.getItem('userDetails'));
    // if(this.isVisable) {
    //   this.GetById(), this.screenType = 'view';
    // }
  }
  ngOnInit(): void {

    this.AllDropDowns();
  }

  AllDropDowns() { // http://localhost:56608/api/Registration/GetJobMasterList/KENYA
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;
   })
  }

  GetById() { // Registration/GetInvestorByUserId/{user_id}
    this.screenType = 'view';
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`Registration/GetInvestorByUserId/${sessionStorage.UserId}`, '', false).subscribe(
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
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        window.history.back()
      })
  }

  BindData() {
    this.invertorForm.patchValue({
      investor_id: this.editData?.investor_id,
      name: this.editData?.name,
      investor_type_id: this.editData?.investor_type_id,
      website: this.editData?.website,
      email_id: this.editData?.email_id,
      mobile_no: this.editData?.mobile_no,
      official_address: this.editData?.official_address,
      accredited_investor: this.editData?.accredited_investor,
      average_investment_id: this.editData?.average_investment_id,
      investment_stages_ids: this.editData?.investment_stages_ids,
      certificate_of_recognition: this.editData?.certificate_of_recognition,
      sectors_of_interest_ids: this.editData?.sectors_of_interest_ids,
      decision_makers: this.editData?.decision_makers,
      portfolio: this.editData?.portfolio,
      investor_profile: this.editData?.investor_profile,
      kyc_document: this.editData?.kyc_document,
      proof_accreditation: this.editData?.proof_accreditation,
      preferred_method_id: this.editData?.preferred_method_id,
      startup_dealflow: this.editData?.startup_dealflow,
      is_confirm: this.editData?.is_confirm,
      is_agreed: this.editData?.is_agreed,
      tnt_code: this.editData?.tnt_code,
      // userDetails: this.editData?.userDetails
    });
    let dte: any = this.userDetails?.DOB != null && this.userDetails?.DOB !='' ? new Date(this.userDetails?.DOB): '';
    this.dateOfBirth = dte;
  }

  typesOfFile: object = {
    'portfolio': {
      types: ['doc', 'docx', 'pdf', 'jpg', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg'],
      message: 'Please upload the',
    },
    'logo': {
      types: ['jpg', 'gif', 'png', 'jpeg'],
      message: 'Please upload the',
    },
    'Webinar Info': {
      types: ['m4v', 'avi', 'mpg', 'mp4'],
      message: "Please upload the "
    },
    'certificate': {
      types: ['pdf', 'xlsx', 'doc'],
      message: "Please upload the Flash file Like"
    },
    'Audio': {
      types: ['mp3', 'wav'],
      message: "please upload the"
    }
  };

  changeFile(event, ctrl: string = '') {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let materialType: object = ctrl == 'logo' ? this.typesOfFile['logo'] : this.typesOfFile['portfolio']

      let check = materialType['types'].includes(filetype?.toLowerCase());
      if (check) {
        this.file = file;
        this.upload(ctrl)
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning(materialType['message'] + JSON.stringify(materialType['types']))
        event.target.value = ''
      }
    }
  }

  upload(ctl: string) { 
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/UploadMaterial');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if(ctl == 'portfolio')
          this.portfolioPath = res.path;
        if(ctl == 'profile')
          this.profilePath = res.path;
        if(ctl == 'kyc')
          this.kycPath = res.path;
        if(ctl == 'proof')
          this.acrdtonProfPath = res.path;

      } catch (e) { console.log(e); }

    }, err => { })
  }

  Save() { // /api/Registration/SaveInvestor
    // if (this.invertorForm.invalid) {
    //   this.toastr.warning('Please Enter All Mandatory Fields', 'SignUp');
    //   return;
    // }
    if(this.dateOfBirth == null || this.dateOfBirth == '') {
      this.toastr.warning('Please Enter Date of Birth', 'SignUp');
      return;
    }
    if(this.invertorForm?.get('is_confirm').value == false) {
      this.toastr.warning('I confirm the above information is accurate and true.');
      return;
    }
    if(this.invertorForm?.get('is_agreed').value == false) {
      this.toastr.warning('I agree to the platform’s Terms of Use and Privacy Policy.');
      return;
    }
    let payLoad = this.invertorForm.getRawValue();
    let userDtls: any = {
      username: `${payLoad.email_id}`, UserType: 29, title: 38, firstname: `${payLoad.name}`, lastname: '', Gender: 1, mobileno: payLoad.mobile_no, Role: 8, 
      Timezone: "India Standard Time", CREATEDBY: 12345678, TENANT_CODE: 12345678, password: 'abc123', confirmPassword: 'abc123', company_id: 0, dob: this.CommonService.setDtFrmt(new Date(this.dateOfBirth), this.dtF.ymd)
    }
    payLoad.userDetails = userDtls;
    payLoad.sectors_of_interest_ids = this.slctdTrgtSctrList.length > 0 ? this.slctdTrgtSctrList.map(item => item.id).join(','): '';
    payLoad.investment_stages_ids = this.slctdSrvcOfrd.length > 0 ? this.slctdSrvcOfrd.map(item => item.id).join(','): '';
    // if(payLoad.date_birth == null || payLoad.date_birth == '') {
    //   this.toastr.warning('Please Enter Date of Birth', 'SignUp');
    //   return;
    // }
    if (this.portfolioPath)
      payLoad.portfolio = this.portfolioPath;
    if (this.profilePath)
      payLoad.investor_profile = this.profilePath;
    if (this.kycPath)
      payLoad.kyc_document = this.kycPath;
    if (this.acrdtonProfPath)
      payLoad.proof_accreditation = this.acrdtonProfPath;
    // payLoad.date_birth = payLoad.date_birth != null && payLoad.date_birth != '' ? this.CommonService.setDtFrmt( new Date(payLoad.date_birth), this.dtF.ymd): '';
    this.activeSpinner();
    this.CommonService.postCall('Registration/SaveInvestor', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.toastr.success(`🎉 Congratulations! Your registration was successful. Your credentials will be sent to your registered email after review and approval.`),
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
    this.router.navigate(['/login'])
  }

  
  onMSD(type: string, ctrl: string, item: any) {
    if (type == 's') {
      if (ctrl == 'Ts') {
        if (this.slctdTrgtSctrList.filter((f: { id: any; }) => f.id == item.id).length == 0)
          this.slctdTrgtSctrList.push(...item);
      }
      if (ctrl == 'So') {
        if (this.slctdSrvcOfrd.filter((f: { id: any; }) => f.id == item.id).length == 0)
          this.slctdSrvcOfrd.push(...item);
      }
    }
    else if (type == 'r') {
      if (ctrl == 'Ts')
        this.slctdTrgtSctrList = [];
      if (ctrl == 'So')
        this.slctdSrvcOfrd = [];
    }
    else if (type == 'a') {
      if (ctrl == 'Ts')
        this.slctdTrgtSctrList = this.allDropDwns.target_sectors;
      if (ctrl == 'So')
        this.slctdSrvcOfrd = this.allDropDwns.services_offered;
    }
    else {
      if (ctrl == 'Ts')
        this.slctdTrgtSctrList = this.slctdTrgtSctrList.filter((f: { id: any; }) => f.id != item.id);
      if (ctrl == 'So')
        this.slctdSrvcOfrd = this.slctdSrvcOfrd.filter((f: { id: any; }) => f.id != item.id);
    }
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
