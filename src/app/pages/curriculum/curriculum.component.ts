import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = null;
  editData: any;
  courses: Array<any> = [];
  termList: Array<any> = [];
  courceId: any;
  shedules: any;
  courseObjectives: any;
  academics: any;
  payments: any;
  tempArray = [];
  flag: boolean;
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.load();
  }

  ngOnInit(): void {
    this.getCourses();

    this.myForm = this.fb.group({
      CURRICULUM_NAME: ['', Validators.required,],
      CURRICULUM_COURSE_ID: ['', Validators.required],
      CURRICULUM_NO_OF_PAYMENTS: ['', Validators.required,],
      CURRICULUM_ACADEMIC_ID: ['', Validators.required],
      CURRICULUM_STATUS: [1, Validators.required,],
      CURRICULUM_DESCRIPTION: ['',],

    });
    this.getAcademic();

  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  load() {
    this.activeSpinner()
    let payLoad = {

     "TNT_CODE": sessionStorage.getItem('TenantCode'),
      //"TNT_CODE": 71258324

    }
    this.CommonService.postCall('Curriculum/GetList', payLoad).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(), console.log(e) })
  }

  getAcademic() {
    this.activeSpinner()
    this.CommonService.getCall('Academic/GetAcademicDropDownList/'+sessionStorage.getItem('TenantCode')).subscribe((res: any) => {
      this.academics = res;
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
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
    let payload = {
      COURSE_OBJECTIVE_COURSE_ID: this.courceId
    };
    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner()
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.shedules = res;
    }, e => { this.deactivateSpinner() });
    this.CommonService.postCall('CourseObjectiveByCourseId', payload).subscribe((res: any) => {
      this.courseObjectives = res;
    }, err => {

    });
    this.load()

  }
  close() {
    this.isEdit = null;
    this.myForm.reset();
    this.editData = {};
  }
  edit(curriculumId) {
    //this.editData = curriculumId;
    this.tempArray = [];
    this.termList = [];
    this.isEdit = true;
    this.myForm.reset();
    // let payLoad = {
    //   "CURRICULUM_ID": curriculumId
    // }
    this.CommonService.getCall('Curriculum/Get/' + curriculumId).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
        this.dataTransForm()
      } else {
        this.editData = res;
        this.dataTransForm()
      }
      // this.termList = this.editData?.TERM_FEE_DATE;
      if (this.editData['TERM_FEE_DATE'].length == 0) {
        this.payments = this.editData['CURRICULUM_NO_OF_PAYMENTS'];
        for (let index = 0; index < this.payments; index++) {
          let obj = { TERMFEE_ID: 0, TERMFEE_FEEDATE: 0 }
          this.termList.push(obj)
        }
      } else {
        this.editData['TERM_FEE_DATE'].forEach(element => {
          let obj = {
            TERMFEE_CREATED_BY: 0,
            TERMFEE_CREATED_DATE: "2022-01-27T16:06:14.321535",
            TERMFEE_CURRICULUM_ID: 15,
            TERMFEE_FEEDATE: moment(element['TERMFEE_FEEDATE']).format('YYYY-MM-DD'),
            TERMFEE_ID: 123,
            TERMFEE_MODIFIED_BY: 0,
            TERMFEE_MODIFIED_DATE: "2022-01-27T16:06:14.321536",
            TERMFEE_STATUS: true,
          }
          this.termList.push(obj);
        });
        }
      this.dataTransForm();
    }), err => { }


  }
  dataTransForm() {
    let ctrls = this.myForm.controls
    Object.keys(ctrls).map((key) => {
      let ctrl = ctrls[key];
      if (key == 'CURRICULUM_STATUS') {
        ctrl.setValue(this.editData['CURRICULUM_STATUS'] ? 1 : 0)
      } else {
        ctrl.setValue(this.editData[key]);
      }
    });
  }


  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;
    //value.TNT_CODE = 25412940;sessionStorage.getItem('TenantCode'),.
    value.TNT_CODE = sessionStorage.getItem('TenantCode');
    let status: Boolean
    if (value.CURRICULUM_STATUS == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {

      "CURRICULUM_NAME": value.CURRICULUM_NAME,
      "CURRICULUM_DESCRIPTION": value.CURRICULUM_DESCRIPTION,
      "CURRICULUM_ACADEMIC_ID": (value.CURRICULUM_ACADEMIC_ID),
      "CURRICULUM_COURSE_ID": value.CURRICULUM_COURSE_ID,
      //"CURRICULUM_STATUS": status,
      "TNT_CODE": sessionStorage.getItem('TenantCode'),
      //"TERMFEE_TNTCODE": sessionStorage.getItem('TenantCode'),
      //"TNT_CODE": 71258324,
      //"TERMFEE_TNTCODE": 71258324,
      "CURRICULUM_NO_OF_PAYMENTS": value.CURRICULUM_NO_OF_PAYMENTS,
      "CURRICULUM_CREATED_BY": sessionStorage.getItem('UserId'),
      "CURRICULUM_MODIFIED_DATE": moment(new Date()),
      "CURRICULUM_MODIFIED_BY": sessionStorage.getItem('UserId'),
      "TERMFEE_CURRICULUM_ID": value.TERMFEE_CURRICULUM_ID,
      //  "TERMFEE_CREATED_BY": sessionStorage.getItem('UserId'),
      //  "TERMFEE_MODIFIED_BY": sessionStorage.getItem('UserId'),


    }
    if (this.isEdit) {
      let termArray = []
      this.termList.forEach(element => {
        let obj = { TERMFEE_ID: element.TERMFEE_ID, TERMFEE_FEEDATE: element.TERMFEE_FEEDATE }
        termArray.push(obj);
      });
      payload['CURRICULUM_CREATED_DATE'] = this.editData['CURRICULUM_CREATED_DATE'];
      payload['CURRICULUM_ID'] = this.editData['CURRICULUM_ID'];
      payload['TERM_FEE_DATE'] = termArray;

      this.CommonService.postCall('Curriculum/Update', payload).subscribe((res: any) => {
        this.load();
        this.toastr.success("Curriculum Updated Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Curriculum Not Updated')
      })
    } else {
      payload['CURRICULUM_CREATED_DATE'] = moment(new Date());
      this.CommonService.postCall('Curriculum/Create', payload).subscribe((res: any) => {
        this.load();
        this.toastr.success("Curriculum Created Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Curriculum Not created')

      })
    }
  }

  onChangePayments(event: number) {
    let termArray = []
    termArray = this.termList;
    if(event==termArray.length){
      termArray = this.termList;
    }else if(event>termArray.length){
      let n = event-termArray.length;
      for (let index = 0; index < n; index++) {
        termArray.push({ TERMFEE_ID: 0, TERMFEE_FEEDATE: 0 });
      }
    }
    this.termList = termArray
    // else if(event<termArray.length){
    //   let n = termArray.length-event;
    //   termArray.splice(-1)
    // }
   
  }


  handlePayment(event){
    if(event>12){
      this.flag=true;
    }else{
      this.flag=false;
    }
  }
}
