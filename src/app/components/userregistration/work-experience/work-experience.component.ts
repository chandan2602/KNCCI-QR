import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.component.html',
  styleUrls: ['./work-experience.component.css']
})
export class WorkExperienceComponent extends BaseComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  index: number = -1;
  empStatus: Array<any> = [];
  WorkExperienceData: Array<any> = [];
  btnTitle: string = 'Add Details';
  constructor(private fb: UntypedFormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.formInit();
    this.getAll();
    this.parent.childs['WorkExperienceList'] = this;
  }

  formInit() {
    this.myForm = this.fb.group({
      UserWorkExpID: [0],
      EmployerName: ['', Validators.required],
      EmployementStatus: ['Current'],
      DurationFrom: ['', Validators.required],
      DurationTo: ['', Validators.required],
      Designation: ['',],
      JobProfile: ['',],
      NoticePeriod: [2],

    });
  }

  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.WorkExperienceData = this.editData['WorkExperience'].slice(0);
      this.dataTransform(this.editData['WorkExperience'].slice(0));
    }
  }
  dataTransform(data: Array<any>) {
    data.map(item => {
      let obj = {
        TYPE: item['type'],
        UserWorkExpID: item['UserWorkExpID'],
        EmployerName: item['EmployerName'],
        EmployementStatusName: item['EmployementStatus'],
        EmployementStatus: item['EmployementStatus'],
        DurationFrom: item['DurationFrom'] ? moment(item['DurationFrom']).format('yyyy-MM-DD') : '',
        DurationTo: item['DurationTo'] ? moment(item['DurationTo']).format('yyyy-MM-DD') : '',
        Designation: item['Designation'],
        JobProfile: item['JobProfile'],
        NoticePeriod: item['NoticePeriod']
      };

      this.table.push(obj);
    });
    // this.addIds()
  }
  getAll() {
    //GetEmployementStatus
    this.parent.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.EmployementStatus }).subscribe(
      (res: any) => {
        this.empStatus = res;
        // this.addIds();
      }
    );

  }
  add() {
    this.isEdit = false;
  }
  edit(data, i) {
    this.index = i;
    this.isEdit = true;
    this.editData = data;
    this.assignDataForm(i);
    this.btnTitle = 'Update Details';
  }
  assignDataForm(i) {
    let data = this.WorkExperienceData[i];
    data = { ...this.WorkExperienceData[i], DurationFrom: moment(data.DurationFrom).format('yyyy-MM-DD'), DurationTo: moment(data.DurationTo).format('yyyy-MM-DD') };

    // let ctrls = this.myForm.controls;
    // Object.keys(ctrls).map((formControlName: string) => {
    //   let control: AbstractControl = ctrls[formControlName];
    //   control.setValue(data[formControlName]);
    // })
    this.myForm.patchValue(data);
  }
  close() {
    this.myForm.reset();
  }

  onSubmit(form: UntypedFormGroup) {
    if (form.invalid) {
      this.parent.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }
    //let value = form.value;
    let data = Object.assign({}, form.value);
    if (this.isEdit) {
      data.TYPE = ['edit', 'update'].includes(this.editData.TYPE) ? 'update' : 'insert';
      //let data = Object.assign({}, value);
      this.createAndUpdate(data, false);
    } else {
      data.TYPE = 'insert';
      //let data = Object.assign({}, value);
      this.createAndUpdate(data, true);
    }
    // this.myForm.reset();
    // [this.isEdit, this.index] = [false, -1];
    this.clearForm();
  }

  clearForm() {
    this.formInit();
    this.btnTitle = 'Add Details';
    [this.isEdit, this.index] = [false, -1];
  }

  createAndUpdate(data, type) {
    if (type) {
      this.table.push(data);
      // let obj = Object.assign({}, data);
      this.WorkExperienceData.push(data);
      this.parent.toastr.success('Added successfully');
    } else if (this.index > -1) {
      let i = this.index;
      this.table[i] = data;
      // let obj = Object.assign({}, data);
      this.WorkExperienceData[i] = data;
      this.parent.toastr.success('Updated successfully');
    }
  }
  success() {
    this.parent.save();
  }
  close1() {

  }
}
