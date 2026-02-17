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
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-incubator-profile',
  templateUrl: './incubator-profile.component.html',
  styleUrls: ['./incubator-profile.component.css']
})
export class IncubatorProfileComponent extends BaseComponent implements OnInit {

  dtF = DateFrmts; slctTrgtSctrList: any[] = []; slctSrvcOfrd: any[] = []; isVisable: boolean = location.href.includes('/HOME/incubtrProfile');
  slctdTrgtSctrList: any[] = []; slctdSrvcOfrd: any[] = []; dateOfBirth: any = ''; editData: any = '';
  isIncubator: boolean = location.href.includes('/HOME/incubtr-view');
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
  // @ViewChildren('stepRef') steps!: QueryList<ElementRef>;
  // @ViewChildren('stepHeaderRef') headers!: QueryList<ElementRef>;

  incubatorForm = this.fb.group({     
    incubator_id: [0],
    incubator_name: ['', Validators.required],
    legal_entity_type_id:[0],
    year_of_establishment:[''],
    registered_address: [''],
    official_website: [''],
    logo_upload: [''],
    registration_number: [''],
    certificate_of_recognition: [''],
    full_name: ['', Validators.required],
    designation: [''],
    email_id: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    mobile_no: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    description: [''],
    services_offered_ids: [''],
    target_sectors_ids: [''],
    incubation_model_id: [0],
    startup_capacity: [0],
    criteria_for_startups: [''],
    direct_funding: ['no'],
    average_ticket_size_id: [0],
    monitoring_reporting: [''],
    charge_startups_any_fees: [true],
    specify_amount: [0],
    govt_recognitions: [''],
    is_confirm: [false],
    is_agreed: [false],
    isdeleted: [false],
    tnt_code:[12345678],
    userDetails: ['']
  })

  get fc() { return this.incubatorForm.controls }
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, 
    toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr)
    this.userDetails =  JSON.parse(<any>sessionStorage.getItem('userDetails'));
    if(this.isVisable) {
      this.GetById(sessionStorage.UserId), this.screenType = 'view';
    }
    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        if(this.isIncubator) {
          this.GetById(res?.incubatorU_id), this.screenType = 'view';
        }

      }
    })
  }
  ngOnInit(): void {

    this.AllDropDowns();
    this.incubatorForm?.get('legal_entity_type_id').disable(),
    this.incubatorForm?.get('incubation_model_id').disable(),
    this.incubatorForm?.get('charge_startups_any_fees').disable(),
    this.incubatorForm?.get('direct_funding').disable(),
    this.incubatorForm?.get('average_ticket_size_id').disable()
  }

  AllDropDowns() { // http://localhost:56608/api/Registration/GetJobMasterList/KENYA
    // this.activeSpinner();
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;
        // this.deactivateSpinner();
   })
  //  this.deactivateSpinner();
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
    // if(this.dateOfBirth == null || this.dateOfBirth == '') {
    //   this.toastr.warning('Please Enter Date of Birth', 'SignUp');
    //   return;
    // }
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
          this.toastr.success('🎉 Thank you for submitting!. We’ve received your incubator registration successfully.')
          // window.history.back()
          this.Back();
        } else {
          this.toastr.success(res.message);
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
    this.router.navigate(['/signup'])
  }

  GetById(uId: any) { // Registration/GetInburatorByUserId/{user_id}
     if(uId != 0) {
       this.screenType = 'view';
       this.CommonService.activateSpinner();
       this.CommonService.getCall(`Registration/GetInburatorByUserId/${uId}`, '', false).subscribe(
         (res: any) => {
           if(res?.status == true) {
             this.deactivateSpinner();
             if (Object.keys(res.data).length > 0) {
               // let x = res.data.map((e: any) =>({ ...e, logo_uploadview: `${this.environment.apiURL}${e.logo_upload}`}));
               this.editData = res.data // .map((e: any) =>({ ...e, logo_uploadview: `${this.environment.apiURL}${e.logo_upload}`}));
               let srvcIds: any = this.editData?.services_offered_ids.split(',').map(Number);
               let sctrsIds: any = this.editData?.target_sectors_ids.split(',').map(Number);
               setTimeout(() => {
                 this.allDropDwns.services_offered.forEach( e => {
                   if(srvcIds.includes(e.id)) {
                     this.slctSrvcOfrd.push(e) //, this.onMSD('s', 'So', e)
                   }
                 }), this.slctSrvcOfrd = [...this.slctSrvcOfrd]
                 this.allDropDwns.target_sectors.forEach( e => {
                   if(sctrsIds.includes(e.id)) {
                     this.slctTrgtSctrList.push(e) //, this.onMSD('s', 'So', e)
                   }
                 }), this.slctTrgtSctrList = [...this.slctTrgtSctrList]
                 // this.incubatorForm.get('services_offered_ids')?.setValue(`${this.slctSrvcOfrd}`)
               }, 500);
               this.BindData();
             }
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
  }

  BindData() {
    // this.slctSrvcOfrd = this.allDropDwns.services_offered.filter(item => srvcIds.includes(item.id))
    this.incubatorForm.patchValue({
      // job_id: this.editData?.job_id,
      incubator_id: this.editData?.incubator_id,
      incubator_name: this.editData?.incubator_name,
      legal_entity_type_id: this.editData?.legal_entity_type_id,
      year_of_establishment: this.editData?.year_of_establishment,
      registered_address: this.editData?.registered_address,
      official_website: this.editData?.official_website,
      logo_upload: this.getImagePath(this.editData.logo_upload, this.editData?.incubator_name), // this.editData.logo_upload,
      registration_number: this.editData?.registration_number,
      certificate_of_recognition: this.editData?.certificate_of_recognition,
      full_name: this.editData?.full_name,
      designation: this.editData?.designation,
      email_id: this.editData?.email_id,
      mobile_no: this.editData?.mobile_no,
      description: this.editData?.description,
      // services_offered_ids: this.editData?.services_offered_ids,
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
    let dte: any = this.userDetails?.DOB != null && this.userDetails?.DOB !='' ? new Date(this.userDetails?.DOB): '';
    this.dateOfBirth = dte;
   
  }


  // str.split(',').map(Number)
  
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
}
