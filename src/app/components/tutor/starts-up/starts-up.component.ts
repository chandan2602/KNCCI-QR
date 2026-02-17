import {Component, ElementRef, ViewChildren, QueryList, AfterViewInit, OnInit, Input} from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../../app/services/common.service';
import { FileuploadService } from '../../../services/fileupload.service';
import { BaseComponent } from 'src/app/pages/base.component';
 
declare let $: any;

@Component({
  selector: 'app-starts-up',
  templateUrl: './starts-up.component.html',
  styleUrls: ['./starts-up.component.css']
})
export class StartsUpComponent extends BaseComponent implements OnInit, AfterViewInit{

  @ViewChildren('stepRef') steps!: QueryList<ElementRef>;
  @ViewChildren('stepHeaderRef') headers!: QueryList<ElementRef>; currentStep = 0;

  @Input() childData: any = ''; @Input() parentUser: any = 0; isAddEdt = false;
  dtF = DateFrmts; params: any = ''; userDetails: any = ''; fullTime: any = 'no'; isPurpose: any = 'no';
  cmpny_id: any = sessionStorage.getItem('company_id');
  allDropDwns: any = ''; // subCountyList: any[] = []; subCounty: any = '';
  dt2Day: any = new Date(); defluDF: string = 'DD-MM-YYYY';
  dtPkrCnfg: any = {bsInlineValue:true, isAnimated: true, adaptivePosition: true, dateInputFormat: 'DD-MM-YYYY', showWeekNumbers: false };
  screenType: string = 'add'; valdIdea: any = 'no'; isSubmt: boolean = false;
  pitchPath: any = ''; incubatersLst: any[] = []; fundedCompany: any = '0';
  gobusinessvtPath: any = '';
  // slryFrm: number = 0; slryTo: number = 0; jobCatgry: any = '';
  // stngsMSD(isSngl: boolean, 
  //   idFld: string, txtFld: string, alwSrch: boolean = true, itmShwLmt: number = 2, slctAllTxt: string = 'Select All', 
  //   unSlctAllTxt: string = 'UnSelect All', noDatTxt: string = '') {
  //   return { singleSelection: isSngl, idField: idFld,  textField: txtFld,  allowSearchFilter: alwSrch, itemsShowLimit: itmShwLmt,
  //     selectAllTxt: slctAllTxt, unSelectAllTxt: unSlctAllTxt, closeDropDownOnSelection: isSngl, noDataAvailablePlaceholderText: noDatTxt };
  // };

  startsUpForm = this.fb.group({
    startup_id: [0], 
    name: ['', Validators.required],
    email_id: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    mobile_no: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    institution: [''],
    program: [0], 
    year_of_study: [''],
    team_members: [''], 
    project_name: ['', Validators.required],
    statement: ['', Validators.required],
    solution: ['', Validators.required],
    tagline: ['', Validators.required],
    target_audience: ['', Validators.required],
    idea_unique: ['', Validators.required],
    stage_of_idea: [0, Validators.required],
    validated_idea: ['', Validators.required],
    explanation: [''],
    pitch_deck: [''],
    plan_document: [''],
    demo_link: [''],
    video_link: [''],
    support_type: [0, Validators.required],
    declared: [false],
    agree: [false],
    submission_date: [new Date(), Validators.required],
    sector_id: [0, Validators.required],
    user_id: [0],
    incubatorDetails: [''],
    team_size: ['', Validators.required],
    core_team_strengths: ['', Validators.required],
    team_gaps: [''],  // optional         
    founders_working_fulltime: ['', Validators.required],
    yes_founders_working_full_time: [''],
    business_model: ['', Validators.required],
    main_competitors: [''],
    date_founded: ['', Validators.required],
    location: ['', Validators.required],
    target_customer: ['', Validators.required],
    target_market_size: [''],
    customer_acquisition: ['', Validators.required],
    your_market_strategy: ['', Validators.required],
    active_users_currently: ['', Validators.required],
    monthly_revenue: ['', Validators.required],
    milestones_achieved: ['', Validators.required],
    goals_next_3_6_months: ['', Validators.required],
    funded_company: ['', Validators.required],
    capital_raised: [''],
    monthly_burn_rat: [''],
    currently_raising_funds: ['', Validators.required],
    yes_currently_raising_funds: [''],
    long_term_vision: ['', Validators.required],
    incubator_motivation: ['', Validators.required],
    support_expected: ['', Validators.required],
    incubator_contribution: ['', Validators.required],

 
  })

  get fc() { return this.startsUpForm.controls }
  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr)
    this.userDetails =  JSON.parse(<any>sessionStorage.getItem('userDetails'));
    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        this.AllDropDowns() 
        this.params = res;
        this.screenType = this.params?.type,
        this.GetById(this.params?.id)
      }
    })
  }
  
  ngOnInit(): void {
    this.dtPkrCnfg = { isAnimated: true, adaptivePosition: true, dateInputFormat: this.defluDF , showWeekNumbers: false };
    if(this.screenType == 'add') {
      this.AllDropDowns();
      this.startsUpForm.patchValue({
        name: `${this.userDetails?.FIRSTNAME} ${this.userDetails?.LASTNAME}`,
        mobile_no: this.userDetails?.MobileNo,
        email_id: this.userDetails?.USERNAME
      })
    }
    if(this.childData != '') {
      this.GetById(this.childData, this.parentUser), this.screenType = 'view', this.isAddEdt = !this.isAddEdt;
    }
  }

  LoadIncubaters(evnt: any) { // http://localhost:56608/api/Registration/GetInburatorsBySectorId/1
    this.incubatersLst = [];
    this.CommonService.getCall(`Registration/GetInburatorsBySectorId/${evnt}`, '', false).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.incubatersLst = res.data.map( (e: any) =>({ ...e, isChk: false }));
        } else {
          this.toastr.warning(res.message);
        }
   })
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
    'pitch': {
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
      let materialType: object = ctrl == 'logo' ? this.typesOfFile['logo'] : this.typesOfFile['pitch']

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
        if(ctl == 'pitch')
          this.pitchPath = res.path;
        if(ctl == 'gobusinessvt')
          this.gobusinessvtPath = res.path;
      } catch (e) { console.log(e); }

    }, err => { })
  }

  GetById(iD: any, usrId = `${sessionStorage.UserId}`) { // GetMyStartUpList/{user_id}/{startup_id}
  this.CommonService.activateSpinner();
  this.editData = '';
  this.CommonService.getCall(`Registration/GetMyStartUpList/${usrId}/${iD}`, '', false).subscribe( (res: any) => {
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

  BindData() {
    this.startsUpForm.patchValue({
      startup_id: this.editData?.startup_id,
      name: this.editData?.name,
      email_id: this.editData?.email_id,
      mobile_no: this.editData?.mobile_no,
      institution: this.editData?.institution,
      program: this.editData?.program,
      year_of_study: this.editData?.year_of_study,
      team_members: this.editData?.team_members,
      project_name: this.editData?.project_name,
      statement: this.editData?.statement,
      solution: this.editData?.solution,
      tagline: this.editData?.tagline,
      target_audience: this.editData?.target_audience,
      idea_unique: this.editData?.idea_unique,
      stage_of_idea: this.editData?.stage_of_idea,
      validated_idea: this.editData?.validated_idea,
      explanation: this.editData?.explanation,
      pitch_deck: this.editData?.pitch_deck,
      plan_document: this.editData?.plan_document,
      demo_link: this.editData?.demo_link,
      video_link: `${this.editData?.video_link}`,
      support_type: this.editData?.support_type,
      declared: this.editData?.declared,
      agree: this.editData?.agree,
      submission_date: this.editData?.submission_date,
      sector_id: this.editData?.sector_id,
      user_id: this.editData?.user_id,
      incubatorDetails: this.editData?.incubatorDetails
    })
  }

  Save() { // InternshipJobs/SaveOrUpdateJobApplications
    if (this.startsUpForm.invalid) {
      this.startsUpForm.markAllAsTouched();
      this.toastr.warning('Please Enter Mandatory Fields');
      return;  // Correct way to mark all fields
    }
    if(this.startsUpForm?.get('declared').value == false) {
      this.toastr.warning('I declare that this idea is original and owned by my team.');
      return;
    }
    if(this.startsUpForm?.get('agree').value == false) {
      this.toastr.warning('I agree to the Terms & Conditions.');
      return;
    }

    let payLoad = this.startsUpForm.getRawValue();
    let incubatorDetails: any = []; 
    this.incubatersLst.forEach( f=> {
      if(f.isChk)
        incubatorDetails.push({ startup_incubator_id: 0, startup_id: 0, 
        incubator_id: f.incubator_id, created_by: sessionStorage.UserId})
    }) 
    // payLoad.company_id = +sessionStorage.company_id;
    payLoad.user_id = sessionStorage.UserId,
    // payLoad.submission_date = this.CommonService.setDtFrmt(new Date(payLoad.submission_date), this.dtF.ymd)
    payLoad.incubatorDetails = incubatorDetails;
    if (this.fileName) {
      payLoad.plan_document = this.fileName;
    }

    if (this.pitchPath)
      payLoad.pitch_deck = this.pitchPath;
    if (this.gobusinessvtPath)
      payLoad.plan_document = this.gobusinessvtPath;
   
    // delete payLoad.date_birth = this.CommonService.setDtFrmt( new Date(payLoad.date_birth), this.dtF.ymd)
    delete payLoad.submission_date;
    payLoad.program = (+payLoad.program),
    payLoad.sector_id = (+payLoad.sector_id),
    payLoad.support_type = (+payLoad.support_type),
    payLoad.stage_of_idea = (+payLoad.stage_of_idea),

    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/SaveOrUpdateInternshipStartup', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.toastr.success(res.message);
          this.router.navigate(['/HOME/startsupList']);
          // window.history.back()  
        } else {
          this.toastr.info(res.message);
          this.deactivateSpinner();
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Starts-up not Registered');
        // window.history.back()
      })
  }

  close() {
    this.router.navigate(['/HOME/startsupList'])
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
          <p>We've received your incubator registration successfully.</p>
        </div>
      `;
    }
  }
}
