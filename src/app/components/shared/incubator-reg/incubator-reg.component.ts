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
  selector: 'app-incubator-reg',
  templateUrl: './incubator-reg.component.html',
  styleUrls: ['./incubator-reg.component.css']
})
export class IncubatorRegComponent extends BaseComponent implements OnInit, AfterViewInit {

  dtF = DateFrmts; slctTrgtSctrList: any[] = []; slctSrvcOfrd: any[] = []; isVisable: boolean = location.href.includes('/HOME/incubtrProfile');
  slctdTrgtSctrList: any[] = []; slctdSrvcOfrd: any[] = []; dateOfBirth: any = '';
  currentStep = 0;a
  logoPath: any = '';
  certificatePath: any = '';
  govtPath: any = '';
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
  screenType: string = 'add'; dirctFndng: any = 'no'; chrgeStrtup: any = 'no'
  isSubmt: boolean = false;
  allDropDwns: any = '';
  @ViewChildren('stepRef') steps!: QueryList<ElementRef>;
  @ViewChildren('stepHeaderRef') headers!: QueryList<ElementRef>;

  incubatorForm = this.fb.group({     
    incubator_id: [0],
    incubator_name: ['', Validators.required],
    legal_entity_type_id:[0, Validators.required],
    year_of_establishment:['', Validators.required],
    registered_address: ['', Validators.required],
    official_website: ['', Validators.required],
    logo_upload: [''],
    registration_number: ['', Validators.required],
    certificate_of_recognition: [''],
    full_name: ['', Validators.required],
    designation: ['', Validators.required],
    email_id: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    mobile_no: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    description: ['', Validators.required],
    services_offered_ids: ['', Validators.required],
    target_sectors_ids: ['', Validators.required],
    incubation_model_id: [0, Validators.required],
    startup_capacity: [0, Validators.required],
    criteria_for_startups: ['', Validators.required],
    direct_funding: ['no', Validators.required],
    average_ticket_size_id: [0, Validators.required],
    monitoring_reporting: ['', Validators.required],
    charge_startups_any_fees: [false],
    is_agreed: [false],
    isdeleted: [false],
    tnt_code:[12345678],
    userDetails: [''],
    is_confirm: [false],
    govt_recognitions: [''],
    specify_amount: [0]
  })

  get fc() { return this.incubatorForm.controls }
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

  typesOfFile: object = {
    'Uploaded Resume': {
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
      let materialType: object = ctrl == 'logo' ? this.typesOfFile['logo'] : this.typesOfFile['certificate']

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
        if(ctl == 'logo')
          this.logoPath = res.path;
        if(ctl == 'certificate')
          this.certificatePath = res.path;
        if(ctl == 'govt')
          this.govtPath = res.path;

      } catch (e) { console.log(e); }

    }, err => { })
  }

  Save() { // /api/Registration/SaveInburator
    // if (this.incubatorForm.invalid) {
    //   this.toastr.warning('Please Enter All Mandatory Fields', 'SignUp');
    //   return;
    // }
    if (this.incubatorForm.invalid) {
      this.incubatorForm.markAllAsTouched(); // Show all errors
      return;
    }
    if(this.incubatorForm?.get('is_confirm').value == false) {
      this.toastr.warning('I confirm the above information is accurate and true.');
      return;
    }
    if(this.incubatorForm?.get('is_agreed').value == false) {
      this.toastr.warning('I agree to the platform’s Terms of Use and Privacy Policy.');
      return;
    }
    if(this.logoPath == '') {
      this.toastr.warning('Please upload the logo');
      return;
    }
    if(this.certificatePath == '') {
      this.toastr.warning('Please upload the certificate');
      return;
    }
    if(this.govtPath == '') {
      this.toastr.warning('Please upload the govt recognitions');
      return;
    }

    let payLoad = this.incubatorForm.getRawValue();
    let userDtls: any = {
      username: `${payLoad.email_id}`, UserType: 28, title: 38, firstname: `${payLoad.full_name}`, lastname: '', Gender: 1, mobileno: payLoad.mobile_no, Role: 7, 
      Timezone: "India Standard Time", CREATEDBY: 12345678, TENANT_CODE: 12345678, password: 'abc123', confirmPassword: 'abc123', company_id: 0, dob: this.CommonService.setDtFrmt(new Date(this.dateOfBirth), this.dtF.ymd)
    }
    payLoad.userDetails = userDtls,
    payLoad.services_offered_ids = this.slctdTrgtSctrList.length > 0 ? this.slctdTrgtSctrList.map(item => item.id).join(','): '';
    payLoad.target_sectors_ids = this.slctdSrvcOfrd.length > 0 ? this.slctdSrvcOfrd.map(item => item.id).join(','): '';
    // if(payLoad.date_birth == null || payLoad.date_birth == '') {
    //   this.toastr.warning('Please Enter Date of Birth', 'SignUp');
    //   return;
    // }
    if (this.logoPath)
      payLoad.logo_upload = this.logoPath;
    if (this.certificatePath)
      payLoad.certificate_of_recognition = this.certificatePath;
    if (this.govtPath)
      payLoad.govt_recognitions = this.govtPath;
    // payLoad.date_birth = payLoad.date_birth != null && payLoad.date_birth != '' ? this.CommonService.setDtFrmt( new Date(payLoad.date_birth), this.dtF.ymd): '';
    this.activeSpinner();
    this.CommonService.postCall('Registration/SaveIncubator', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.onSubmit();
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

  GetById() { // Registration/GetInburatorByUserId/{user_id}
    this.screenType = 'view';
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`Registration/GetInburatorByUserId/${sessionStorage.UserId}`, '', false).subscribe(
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
    this.incubatorForm.patchValue({
      // job_id: this.editData?.job_id,
      incubator_id: this.editData?.incubator_id,
      incubator_name: this.editData?.incubator_name,
      legal_entity_type_id: this.editData?.legal_entity_type_id,
      year_of_establishment: this.editData?.year_of_establishment,
      registered_address: this.editData?.registered_address,
      official_website: this.editData?.official_website,
      logo_upload: this.editData?.logo_upload,
      registration_number: this.editData?.registration_number,
      certificate_of_recognition: this.editData?.certificate_of_recognition,
      full_name: this.editData?.full_name,
      designation: this.editData?.designation,
      email_id: this.editData?.email_id,
      mobile_no: this.editData?.mobile_no,
      description: this.editData?.description,
      services_offered_ids: this.editData?.services_offered_ids,
      target_sectors_ids: this.editData?.target_sectors_ids,
      incubation_model_id: this.editData?.incubation_model_id,
      startup_capacity: this.editData?.startup_capacity,
      criteria_for_startups: this.editData?.criteria_for_startups,
      direct_funding: this.editData?.direct_funding,
      average_ticket_size_id: this.editData?.average_ticket_size_id,
      monitoring_reporting: this.editData?.monitoring_reporting,
      charge_startups_any_fees: this.editData?.charge_startups_any_fees,
      specify_amount: this.editData?.specify_amount,
      govt_recognitions: this.editData?.govt_recognitions,
      is_confirm: this.editData?.is_confirm,
      is_agreed: this.editData?.is_agreed,
      isdeleted: this.editData?.isdeleted,
      tnt_code: this.editData?.tnt_code,
      userDetails: this.editData?.userDetails
    })
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
