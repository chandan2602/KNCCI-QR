import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControlName, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { valHooks } from 'jquery';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-schedule-assessment',
  templateUrl: './schedule-assessment.component.html',
  styleUrls: ['./schedule-assessment.component.css']
})
export class ScheduleAssessmentComponent implements OnInit {
  table: Array<any> = [];
  item: any;
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  courceId: string = "";
  courses: Array<any> = []
  scheduls: Array<any> = [];
  scheduleId: string = '';
  chapters: Array<any> = [];
  proctorings: Array<any> = [];
  dropdownSettings: any = {}
  selectedItems: { item_id: number; item_text: string; }[];
  selectedProctoring: { item_id: number; item_text: string; }[];
  dropdownList: { item_id: number; item_text: string; }[] = [];
  isData: boolean = true;
  isDataProctoring: boolean = true;
  startTime: string = null;
  assessments: Array<any> = []
  isChecked: boolean = false;
  dropdownListProctoring: any[] = [];
  //allow_proctoring: boolean = JSON.parse(sessionStorage.getItem('Proctoring'));
  isProctoring: boolean = false;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.load();
    this.isProctoring = JSON.parse(sessionStorage.getItem('Proctoring'));
  }

  ngOnInit(): void {
    this.getCourses();
    this.myForm = this.fb.group({
      SA_COURSE_ID: ['', Validators.required],
      SA_COURSE_SCHEDULE_ID: ['', Validators.required],
      SA_CHAPTERS: [{ value: [] }, Validators.required],
      SA_ASSESSMENT_ID: ['', Validators.required],
      SA_DATE: ['', Validators.required],
      SA_START_TIME: ['', Validators.required],
      SA_END_TIME: [{ value: '', }, [Validators.required]],
      SA_ASSESSMENT_MODE: ['1'],
      SA_TRAINING_MODE: ['', Validators.required],
      ALLOW_PROCTORING: [false,],
      PROCTORING_TYPE: [''],
      REMINDER_COUNT: [0],
    })
    this.setDefault()
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  getCourses() {
    this.activeSpinner()
    this.CommonService.getAdminCourses().subscribe((res: any) => {
      this.courses = res;
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
  }

  courseChange() {
    let data = {
      "CourseId": this.courceId
    }
    this.clearAll()
    this.activeSpinner()
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.scheduls = res;
    }, e => { this.deactivateSpinner() })
  }

  sheduleChange() {

    this.activeSpinner();
    this.getAssesment();
    let payLoad = {
      CHAPTER_CS_ID: this.scheduleId
    }
    this.CommonService.postCall('LoadChaptersByCourseSchedule', payLoad).subscribe((res: any) => {
      this.chapters = res;
      this.isData = false;
      res.map(item => {
        let obj = {
          item_id: item.CHAPTER_ID,
          item_text: item.CHAPTER_NAME
        }
        this.dropdownList.push(obj);


      })
      setTimeout(() => { this.isData = true }, 10)
      if (this.isEdit) this.setSelectedlist()
      this.deactivateSpinner();
    }, err => { this.chapters = []; this.deactivateSpinner() })
  }

  setSelectedlist() {
    let value: string = this.editData['SA_CHAPTERS'];
    let list = []
    value.split(',').map((id: any) => {
      let index = this.dropdownList.findIndex(data => data.item_id == id);

      if (index > -1) {
        list.push(this.dropdownList[index])
      }
    })
    this.selectedItems = list;
  }
  setDefault() {
    let ctrl = this.myForm.controls;

  }
  getAssesment() {
    let data = {
      "SA_ASSESSMENT_MODE": '1',
      'TNT_CODE': sessionStorage.getItem('TenantCode'),
      SA_COURSE_SCHEDULE_ID: this.scheduleId,
    }
    this.activeSpinner()
    this.CommonService.postCall('GetAssessmentByCourseSchedule', data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.assessments = res;
    }, e => { this.deactivateSpinner() })
  }
  onItemSelect(e) { }
  onSelectAll(e) { }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  load() {
    this.activeSpinner();
    let payLoad: any = {
      TNT_CODE: sessionStorage.getItem('TenantCode'),
      SA_ASSESSMENT_MODE: '1'
    }
    this.CommonService.postCall('LoadScheduleAssessment', payLoad).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  add() {
    this.editData = {};
    this.isEdit = false;
    this.isChecked = false;
  }
  close() {
    this.myForm.reset();
    this.isChecked = false;
    // this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;
    let payLoad: any = {}
    Object.keys(value).map((key) => {
      payLoad[key] = value[key];
    })
    let chapters: string | number;
    this.selectedItems?.map((item) => {
      let id = item.item_id;
      if (chapters) {
        chapters = chapters + ',' + id
      } else {
        chapters = id
      }
    });
    let proctorings: string | any;
    this.selectedProctoring?.map((item: { item_id: any; }) => {
      let id = item.item_id;
      if (proctorings
      ) {
        proctorings = proctorings + ',' + id
      } else {
        proctorings = id
      }
    });
    payLoad['SA_CHAPTERS'] = chapters;
    payLoad['PROCTORING_TYPE'] = proctorings;
    payLoad['REMINDER_COUNT'] = value.REMINDER_COUNT
    payLoad['SA_STATUS'] = true;
    payLoad['SA_ASSESSMENT_MODE'] = '1';
    payLoad['TNT_CODE'] = sessionStorage.getItem('TenantCode');
    console.log(payLoad)
    // return
    if (this.isEdit) {
      payLoad['SA_ID'] = this.editData['SA_ID'];
      payLoad['SA_MODIFIED_BY'] = sessionStorage.getItem('UserId')
      this.CommonService.postCall('UpdateScheduleAssessment', payLoad).subscribe((res) => {
        this.toastr.success('Information updated successfully');
        this.deactivateSpinner();
        document.getElementById('md_close').click();
        this.load()
      }, err => {
        this.toastr.error(err.error ? err.error : 'error occured')
        this.deactivateSpinner();
      })
    } else {
      payLoad['SA_CREATED_BY'] = sessionStorage.getItem('UserId')
      this.CommonService.postCall('CreateScheduleAssessment', payLoad).subscribe((res) => {
        this.toastr.success('Information Created successfully');
        this.deactivateSpinner();
        document.getElementById('md_close').click();
        this.load();
      }, err => {
        this.toastr.error(err.error ? err.error : 'error occured')
        this.deactivateSpinner();
      })
    }

  }

  edit(data) {
    this.isEdit = true;
    this.isChecked = false;
    this.isProctoring
    this.activeSpinner()
    let payLoad = this.editData = {
      SA_ID: data.SA_ID
    }
    this.editData = payLoad;
    this.CommonService.postCall('EditScheduleAssessment', payLoad).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
      } else {
        this.editData = res;
      }
      this.deactivateSpinner();
      this.dataTransfer();
    }, err => { this.deactivateSpinner(); }
    )
  }

  dataTransfer() {
    let controls = this.myForm.controls;
    Object.keys(controls).map((key: string) => {
      let ctrl: AbstractControl = controls[key];
      if (key != 'SA_CHAPTERS' && key != 'PROCTORING_TYPE') {
        ctrl.setValue(this.editData[key]);
      }
    });
    this.courseChange();
    setTimeout(() => { this.scheduleId = this.editData['SA_COURSE_SCHEDULE_ID']; this.sheduleChange(); controls['SA_ASSESSMENT_ID'].setValue(this.editData['SA_ASSESSMENT_ID']) });
    controls['SA_DATE'].setValue(moment(this.editData['SA_DATE']).format('yyyy-MM-DD'));

  }

  timeChange(endTime) {
    let controls = this.myForm.controls;
    let stime: any = controls['SA_START_TIME'].value;
    let econtrol = controls['SA_END_TIME'];

    if (!stime) {
      this.toastr.warning('Please selece start time')
      econtrol.setValue(null)
      return
    }
    var start = moment.utc(stime, "HH:mm");
    var end = moment.utc(endTime, "HH:mm");

    var d = moment.duration(end.diff(start));
    if (d['_milliseconds'] > 0) {

    } else {
      this.toastr.warning("End Time should be more than start time")
      econtrol.setValue(null)
    }

  }
  clearAll() {
    this.isData = false;
    this.scheduleId = '';
    this.scheduls = [];
    this.assessments = [];
    this.selectedItems = [];
    this.dropdownList = [];
    setTimeout(() => { this.isData = true }, 10)
  }

  proctoring(event: any) {
    this.isChecked = event.target.checked;
    this.dropdownListProctoring = [];
    if (event.target.checked) {
      this.proctorings = [];
      let payload = {
        tnt_code: sessionStorage.getItem('TenantCode')
      }
      this.CommonService.postCall('FaceRec/ProctoringDropdown', payload).subscribe((res: any) => {
        this.proctorings = res;
        this.isDataProctoring = false;
        res.map(item => {
          let obj = {
            item_id: item.proctoringtype_id,
            item_text: item.proctoring_name
          }
          this.dropdownListProctoring.push(obj);


        })
        setTimeout(() => { this.isDataProctoring = true }, 10)
        if (this.isEdit) this.setSelectedlist1()
        this.deactivateSpinner();
      }, err => { this.proctorings = []; this.deactivateSpinner() })
    }
    else {
      this.isChecked = false;
       this.dropdownListProctoring = [];
      this.selectedProctoring = [];
    }
  }


  setSelectedlist1() {
    let value: string = this.editData['PROCTORING_TYPE'];
    let list = []
    value.split(',').map((id: any) => {
      let index = this.dropdownListProctoring.findIndex(data => data.item_id == id);

      if (index > -1) {
        list.push(this.dropdownListProctoring[index])
      }
    })
    this.selectedProctoring = list;
  }

}
//  if(isChecked=true){
// let payLoad={

// }
//  }

// const  timeValidation: ValidatorFn = (fg: FormGroup) => {
//   const stime = fg.get('SA_START_TIME').value;
//   const endTime = fg.get('SA_END_TIME').value;
//   if(!stime ||!endTime) return  { range: true };
//   const start = moment.utc(stime, "HH:mm");
//   const end = moment.utc(endTime, "HH:mm");
//   const d = moment.duration(end.diff(start));
//  return d['_milliseconds']()>0
//    ? null
//    : { range: true };
// };