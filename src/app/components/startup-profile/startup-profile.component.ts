import {Component, ElementRef, ViewChildren, QueryList, AfterViewInit, OnInit, Input} from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { FileuploadService } from '../../services/fileupload.service';
import { BaseComponent } from 'src/app/pages/base.component';
import { environment } from 'src/environments/environment';
 
declare let $: any;
interface Step {
  label: string;
  status: 'Registered' | 'Pending' | 'Approved' | 'Rejected';
}
@Component({
  selector: 'app-startup-profile',
  templateUrl: './startup-profile.component.html',
  styleUrls: ['./startup-profile.component.css']
})
export class StartupProfileComponent extends BaseComponent implements OnInit{

    steps: Step[] = [
    { label: 'Founder', status: 'Approved' },
    { label: 'Incubator', status: 'Rejected' },
    { label: 'Investor', status: 'Pending' },
  ];
  @Input() childData: any = ''; @Input() parentUser: any = 0; isAddEdt = false;
  dtF = DateFrmts; params: any = ''; userDetails: any = ''; editData: any = '';
  cmpny_id: any = sessionStorage.getItem('company_id');
  allDropDwns: any = ''; // subCountyList: any[] = []; subCounty: any = '';
  dt2Day: any = new Date(); defluDF: string = 'DD-MM-YYYY';
  dtPkrCnfg: any = {bsInlineValue:true, isAnimated: true, adaptivePosition: true, dateInputFormat: 'DD-MM-YYYY', showWeekNumbers: false };
  screenType: string = 'add'; valdIdea: any = 'no'; isSubmt: boolean = false;
  pitchPath: any = ''; incubatersLst: any[] = [];
  gobusinessvtPath: any = '';

  startsUpForm = this.fb.group({
    startup_id: [0], 
    name: ['', Validators.required],
    email_id: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    mobile_no: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
    institution: [''],
    program: [''], 
    year_of_study: [''],
    team_members: [''], 
    project_name: [''],
    statement: [''],
    solution: [''],
    tagline: [''],
    target_audience: [''],
    idea_unique: [''],
    stage_of_idea: [''],
    validated_idea: [''],
    explanation: [''],
    pitch_deck: [''],
    plan_document: [''],
    demo_link: [''],
    video_link: [''],
    support_type: [''],
    declared: [false],
    agree: [false],
    submission_date: [new Date()],
    sector_id: [0],
    user_id: [0],
    incubatorDetails: ['']
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
            this.steps = [
              { label: 'Founder', status: 'Registered' as const },
              {
                label: 'Incubator', // 'Pending' | 'Approved' | 'Rejected'
                status: this.mapStatus(this.editData.application_status == 2 ? 'Approved' : (this.editData.application_status == 3 ? 'Rejected': 'Pending')),
              },
              {
                label: 'Investor',
                status: this.mapStatus(this.editData.investor_status == 2 ? 'Approved' : (this.editData.investor_status == 3 ? 'Rejected': 'Pending')),
              },
            ];
          // this.BindData()
        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
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
    delete payLoad.submission_date
    this.activeSpinner();
    this.CommonService.postCall('InternshipJobs/SaveOrUpdateInternshipStartup', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.toastr.success(res.message);
          // window.history.back()  
        } else {
          this.toastr.success(res.message);
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

  downloadForm() {
    this.activeSpinner();
    let payload = {
      user_id: this.editData?.user_id,
      startup_id: this.editData?.startup_id,
      file_name: "StartupRegistration.jrxml",
      file_type: "pdf",
      // token: localStorage.getItem("tkn"),
      // COURSE_ID: this.courseId,
    };
 
    this.CommonService.reportAPi(payload).subscribe(
      (res: any) => {
        const urlSegments = res.data.viewPath.split("/");
        const fileName = urlSegments[urlSegments.length - 1];
        const a = document.createElement("a");
        a.href = environment.downloadReportUrl + fileName;
        a.download = "Application Form.pdf"; // Specify the desired file name
        a.style.display = "none"; // Hide the anchor element
        document.body.appendChild(a); // Append to the DOM
        a.click(); // Trigger the download
        document.body.removeChild(a);
        document.getElementById("Closemodal")?.click(); // Remove the anchor element from the DOM
        this.deactivateSpinner();
      },
      (err: any) => {
        this.deactivateSpinner();
      }
    );
  }

  
  get lastDecidedIndex(): number {
    return (
      this.steps
        .map((s, i) => (s.status !== 'Pending' ? i : -1))
        .reduce((a, b) => (b > a ? b : a), -1)
    );
  }

  get progressPercentage(): number {
    return (this.lastDecidedIndex / (this.steps.length - 1)) * 100;
  }

  get progressColor(): string {
    const lastStep = this.steps[this.lastDecidedIndex];
    return lastStep?.status === 'Rejected' ? 'red' : lastStep?.status === 'Approved' ? 'green' : 'orange';
  }

  mapStatus(status: string | null): 'Registered' | 'Pending' | 'Approved' | 'Rejected' {
    if (!status) return 'Pending';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
}
 
}
