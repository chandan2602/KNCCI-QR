import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-master-assessment',
  templateUrl: './add-master-assessment.component.html',
  styleUrls: ['./add-master-assessment.component.css']
})
export class AddMasterAssessmentComponent implements OnInit {
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  categorys: Array<any> = [];
  categoryId: string = '';
  courceId: string = '';
  courses: Array<any> = [];
  schedules: Array<any> = [];
  tenantCode: string = sessionStorage.getItem('TenantCode');
  userId: string = sessionStorage.getItem('UserId');
  mId: string;
  soData: any = {
    '11': [],
    '12': [],
    '13': [],
    '23': []
  };
  method: Object = {
    '2': { objective: 'disableControl', subjective: 'validControl' },
    '1': { objective: 'validControl', subjective: 'disableControl' },
    '3': { objective: 'validControl', subjective: 'validControl' }
  }
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService, private active: ActivatedRoute) {
    // this.load();
    this.active.queryParams.subscribe((res: any) => {
      if (res.mId) {
        this.mId = res.mId;
        this.isEdit = true;
        this.edit();
      }
    });

  }

  ngOnInit(): void {
    this.getCourseCategory()
    this.myForm = this.fb.group({
      ASSESSMENT_CATEGOREYID: [{ value: '', disabled: this.isEdit }, Validators.required],
      ASSESSMENT_COURSE_ID: [{ value: '', disabled: this.isEdit }, Validators.required],
      ASSESSMENT_COURSESECHD_ID: [{ value: '', disabled: this.isEdit }, Validators.required],
      ASSESSMENT_ASSESSMENT_NAME: ['', Validators.required],
      ASSESSMENT_NOOFATTEMPTS: ['', Validators.required],
      ASSESSMENT_ASSESSMENT_DESC: ['', Validators.required],
      ASSESSMENT_NO_OF_QUESTIONS: ['', Validators.required],
      ASSESSMENT_MINPERCENTAGE: ['', [Validators.required, Validators.maxLength(2)]],
      ASSESSMENT_TIMINGFORASSESSMENT: ['', Validators.required],
      COMPLEXITY_TYPE: ['', Validators.required],
      ASSESSMENT_QUESTIONTYPE: ['', Validators.required],
      ASSESSMENT_MARKS: [{ value: '', disabled: true },],
      formArray: this.fb.array([])
    })
    this.setDefault()
  }

  setDefault() { }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  getCourseCategory() {
    this.activeSpinner();
    let payLoad = {
      "RoleID": sessionStorage.getItem('RoleId'),
      "TENANT_CODE": this.tenantCode,
      "COURSETRAINERID": this.userId
    }
    this.CommonService.postCall('GetCourseCategory', payLoad).subscribe((res: any) => {
      this.categorys = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  getCource() {
    this.activeSpinner()
    this.courses = [];
    this.courceId = '';
    this.schedules = [];

    let payLoad = {
      RoleID: sessionStorage.RoleId,
      COURSE_CATEGORY_ID: this.categoryId,
      TENANT_CODE: this.tenantCode
    }

    this.CommonService.postCall('GetCourseByCourseCategoryId', payLoad).subscribe((res: any) => {
      this.courses = res;
      this.deactivateSpinner();
      if (this.isEdit) { this.courceId = this.editData['ASSESSMENT_COURSE_ID'] || ''; this.getCourceSchedule(); }
    }, e => { this.deactivateSpinner() })
  }

  getCourceSchedule() {
    this.schedules = [];
    this.activeSpinner()
    let data = {
      "CourseId": this.courceId
    }
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.schedules = res;
    }, e => { this.deactivateSpinner() })
  }
  close() {
    window.history.back();
  }
  edit() {
    this.isEdit = true;

    let payLoad = {
      ASSESSMENT_ID: this.mId,
      "TENANT_CODE": this.tenantCode,
      "ASSESSMENT_MODE": "1"
    }

    this.CommonService.postCall('EditMasterAssessment', payLoad).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];

      } else {
        this.editData = res;

      }
      this.dataTransfer()
    }, err => { }
    )
  }

  onSubmit(form: UntypedFormGroup) {
    let payLoad = form.getRawValue();
    let questions = payLoad.ASSESSMENT_NO_OF_QUESTIONS;
    let marks = payLoad.ASSESSMENT_MARKS;
    if (questions != marks) {
      this.toastr.warning('No of Questions should be equal to sum of objective and subjective questions ')
      return
    }
    this.activeSpinner();
    let cscheduleId = payLoad['ASSESSMENT_COURSESECHD_ID'];
    let complexity = payLoad['COMPLEXITY_TYPE'];
    let qType = payLoad['ASSESSMENT_QUESTIONTYPE'];
    let params = {
      "TENANT_CODE": this.tenantCode,
      "ASSESSMENT_MODE": "1",
      "ASSESSMENT_COURSE_ID": this.courceId,
      "ASSESSMENT_COURSESECHD_ID": cscheduleId,
      "COMPLEXITY_TYPE": complexity
    }
    if (qType != 3 && complexity == 2) {
      this.save(payLoad);
      this.deactivateSpinner();
    }
    let levels = payLoad['formArray'];
    this.CommonService.postCall('CheckComplexityData', params).subscribe((res: any) => {
      this.deactivateSpinner()
      if (!res.length) { this.save(payLoad); return }
      if (complexity == 2) {
        let oCount = res[0]['COUNT'];
        if (levels[0].objective > oCount) {
          this.toastr.warning('No of Objective Questions available are ' + oCount);
          return
        }
        let sCount = res[1]['COUNT'];
        if (levels[0].subjective > sCount) {
          this.toastr.warning('No of Subjective Questions available are ' + sCount);
          return
        }
        this.save(payLoad)
      } else {
        let array = []
        let check = true;
        for (let i in [0, 1, 2, 3, 4, 5]) {
          let val = parseInt(i) + 1
          let L = 'L' + val.toString()
          let fi: Array<any> = res.filter((x) => x.Levels == L)
          if (fi.length) {
            let obj = {
              subjective: fi.find(x => x.Type == 'Subjective'),
              objective: fi.find(x => x.Type == 'Objective')
            }
            array.push(obj)
          }
        }
        for (let i in array) {
          let obj = array[i]
          let oCount = obj['objective']['COUNT'];
          let sCount = obj['subjective']['COUNT'];
          let oValue = levels[i].objective;
          let sValue = levels[i].subjective;
          let l = parseInt(i) + 1
          if (oValue > oCount) {
            check = false;
            this.toastr.warning('Level ' + l + ' No of Objective Questions available are ' + oCount)
            break;
          }
          if (sValue > sCount) {
            check = false;
            this.toastr.warning('Level ' + l + ' No of Subjective Questions available are ' + sCount)
            break;
          }
        }
        if (check) {
          this.save(payLoad)
        }
      }
    }, e => {
      this.deactivateSpinner();
    })


  }
  save(payLoad) {
    let complexity = payLoad['COMPLEXITY_TYPE'];
    let qType = payLoad['ASSESSMENT_QUESTIONTYPE'];
    let params = {}
    Object.keys(payLoad).map(key => {
      if (key != 'formArray') {
        params[key] = payLoad[key]
      }
    })
    let formArray: Array<any> = payLoad['formArray'];
    if (complexity == 1) {

      formArray.map((data, index) => {
        let i = index + 1;
        let okey = 'L' + i + '_OBJECTIVE';
        let skey = 'L' + i + '_SUBJECTIVE';
        params[okey] = data['objective'] == '' ? '0' : data['objective'];
        params[skey] = data['subjective'] == '' ? '0' : data['subjective'];
      })
    } else if (qType == 3) {
      params['OBJECTIVE_Value'] = formArray[0]['objective'];
      params['SUBJECTIVE_Value'] = formArray[0]['subjective'];

    }
    params['ASSESSMENT_ASSESSMENT_TYPE'] = '1';
    params['ASSESSMENT_TRAINER_ID'] = this.userId;
    params['ASSESSMENT_REMARKS'] = '';
    params['ASSESSMENT_MODE'] = '1';
    params['ASSESSMENT_CREATEDBY'] = this.userId;
    params['ASSESSMENT_MODIFIEDBY'] = this.userId;
    params['ASSESSMENT_RESULT_STATUS'] = '';
    params['TENANT_CODE'] = this.tenantCode;
    //  ASSESSMENT_ID
    this.activeSpinner();
    if (this.isEdit) {
      params['ASSESSMENT_ID'] = this.mId;
      this.CommonService.postCall('UpdateMasterAssessment', params).subscribe(() => {
        this.deactivateSpinner();
        this.toastr.success('Information updated successfully')
        window.history.back()
      }, err => {
        this.toastr.error(err);
        this.deactivateSpinner();
      })
    } else {
      this.CommonService.postCall('CreateMasterAssessment', params).subscribe(() => {
        this.deactivateSpinner();
        this.toastr.success('Information saved successfully')
        window.history.back()
      }, err => {
        this.toastr.error(err);
        this.deactivateSpinner()
      })
    }

  }
  complexityChange(value) {
    let controls = this.myForm.controls;
    let qTypeCtrl = controls['ASSESSMENT_QUESTIONTYPE'];
    qTypeCtrl.setValue('');
    this.qTypeChange('');
  }
  qTypeChange(value) {
    let controls = this.myForm.controls;//ASSESSMENT_MARKS ASSESSMENT_NO_OF_QUESTIONS,COMPLEXITY_TYPE;
    let marksCtrl: AbstractControl = controls['ASSESSMENT_MARKS'];
    let noQCtrl: AbstractControl = controls['ASSESSMENT_NO_OF_QUESTIONS'];
    let cTypeCtrl: AbstractControl = controls['COMPLEXITY_TYPE'];
    let object = this.method
    this.myForm.controls['formArray'] = this.fb.array([]);
    marksCtrl.setValue(null);
    this.myForm.updateValueAndValidity()
    if (cTypeCtrl.value == '' || value == '') return
    if (cTypeCtrl.value == 2) {
      if (value == 3) {
        this.addObjAndSub([1], object[value])
      } else {
        marksCtrl.setValue(noQCtrl.value)
      }
    } else {
      this.addObjAndSub([1, 2, 3, 4, 5, 6], object[value])
    }

    this.myForm.updateValueAndValidity()
  }

  addObjAndSub(array: Array<any>, type) {
    let controls = this.myForm.controls
    const arrayControl = <UntypedFormArray>controls['formArray'];
    let check = false;
    let c;
    let q;
    if (this.isEdit && Object.keys(this.editData).length) {
      let cEdit = this.editData['COMPLEXITY_TYPE'];
      let cvalue = controls['COMPLEXITY_TYPE'].value;
      let qEdit = this.editData['ASSESSMENT_QUESTIONTYPE'];
      let qValue = controls['ASSESSMENT_QUESTIONTYPE'].value;
      if (cEdit == cvalue && qEdit == qValue) {
        check = true;
        c = cEdit;
        q = qEdit;
        controls['ASSESSMENT_MARKS'].setValue(this.editData['ASSESSMENT_MARKS'])
      }
    }
    for (let i in array) {
      let oValue = '';
      let sValue = '';

      if (check) {
        let key = c.toString() + q.toString()
        let data = this.soData[key]
        if (data.length) oValue = data[i] && data[i]['objective']; sValue = data[i] && data[i]['subjective']
      }
      let grp: UntypedFormGroup = this.fb.group({
        subjective: this[type.subjective](sValue),
        objective: this[type.objective](oValue)
      })
      arrayControl.push(grp)
    }
  }

  validControl(value = '') {
    return new UntypedFormControl(value, Validators.required);
  }
  disableControl(value = '') {
    return new UntypedFormControl({ value: '', disabled: true });
  }
  calcMarks(value) {
    let data = this.myForm.controls.formArray.value
    let controls = this.myForm.controls;
    let marksCtrl: AbstractControl = controls['ASSESSMENT_MARKS'];
    let total = 0;
    for (let i in data) {
      let s = data[i].subjective;
      let o = data[i].objective
      total = total + parseInt((s) ? s : "0") + parseInt((o) ? o : "0")
    }

    marksCtrl.setValue(total);

  }

  dataTransfer() {
    let controls = this.myForm.controls;
    Object.keys(controls).map((key) => {
      let control: AbstractControl = controls[key];
      if (key != 'formArray') {
        control.setValue(this.editData[key])
      }
    });
    try {
      this.getCource();


      let complexity: string = this.editData['COMPLEXITY_TYPE'].toString();
      let qType: string = this.editData['ASSESSMENT_QUESTIONTYPE'].toString();
      if (complexity == '2' && qType == '3') {
        this.soData['23'].push({
          subjective: this.editData['ASSESSMENT_SUBJECTIVE'],
          objective: this.editData['ASSESSMENT_OBJECTIVE']
        });
        this.addObjAndSub([1], this.method[qType])
      } else {
        if (complexity == '1') {
          let array = [];
          for (let i in [1, 2, 3, 4, 5, 6]) {
            let l = 'L' + (parseInt(i) + 1)
            let o = l + '_OBJECTIVE';
            let s = l + '_SUBJECTIVE';
            let oValue = this.editData[o] || null;
            let sValue = this.editData[s] || null;
            let obj = {
              subjective: sValue,
              objective: oValue
            }
            array.push(obj)
          }
          let key = complexity + qType
          this.soData[key] = array;
          this.addObjAndSub([1, 2, 3, 4, 5, 6], this.method[qType])
        }

      }
    } catch (e) {
      console.log(e)
    }


  }
  noQChange() {
    let controls = this.myForm.controls
    let marksCtrl: AbstractControl = controls['ASSESSMENT_MARKS'];
    let noQCtrl: AbstractControl = controls['ASSESSMENT_NO_OF_QUESTIONS'];
    let cTypeCtrl: AbstractControl = controls['COMPLEXITY_TYPE'];
    let qType: AbstractControl = controls['ASSESSMENT_QUESTIONTYPE'];
    if (cTypeCtrl.value == 2 && qType.value == 2) {
      marksCtrl.setValue(noQCtrl.value)
    }
  }

}


// for(var i in [0,1,2,3,4,5]){
//   var val=parseInt(i)+1
//     var L='L'+val.toString()
//    var fi=a.filter((x)=>x.Levels==L)
//    if(fi.length){
//     let obj={
//       subjective:fi[1]||{},
//       objective:fi[0]
// }
// array.push(obj)
//    }

// }