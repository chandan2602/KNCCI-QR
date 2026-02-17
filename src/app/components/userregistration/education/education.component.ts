import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, AbstractControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { CommonService } from 'src/app/services/common.service';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  educationTypes: Array<any> = [];
  educationModes: Array<any> = [];
  educationNames: Array<any> = [];
  EducationName: Array<any> = [];
  // Specialization: Array<any> = [];
  // Institutes: Array<any> = [];
  index: number = -1;
  educationData: Array<any> = [];
  yearList: Array<{ id: number, name: number }> = [];

  btnTitle: string = 'Add Details';
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService) {
    //this.getAll()
    const currentYear = (new Date()).getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.yearList.push({ id: year, name: year });
    }
  }

  ngOnInit(): void {
    this.ngMyform();
    this.getEducationGroup();
    this.parent.childs['EducationData'] = this;
    // this.parent.childs['EducationTypeList'] = this;
    // console.log(this.parent.childs['EducationTypeList'] = this);

  }
  ngMyform() {
    this.myForm = this.fb.group({
      USEREDUCATIONID: [0],
      EDUCATIONTYPE: ['', Validators.required],
      EDUCATIONMODE: ['Online'],
      EDUCATIONNAME: ['', Validators.required],
      SPECIALIZATION: ['', Validators.required],
      UNIVERSITYINSTITUTE: ['', Validators.required],
      YEAROFPASSING: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.educationData = this.editData['Education'].slice(0);
      this.dataTransform(this.editData['Education'].slice(0));
    }
  }
  getAll() {
    let educationType = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.EducationType });//Eduction Type
    let educationNames = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.EducationName });//Eduction Name

    forkJoin([educationType, educationNames]).subscribe((res) => {
      [this.educationTypes, this.EducationName] = [...res];
    });
  }
  dataTransform(data: Array<any>) {
    // data.map(item => {
    //   this.table.push(item)
    // });
    data.length > 0 && this.myForm.patchValue(data[0]);
  }
  getEducationGroup() {
    this.parent.CommonService.postCall('GetEducationGroup', {}).subscribe(
      (res: any) => {
        if (Object.keys(res).length) {
          [this.educationTypes, this.educationModes, this.EducationName] = [res.EducationType, res.EducationMode, res.EducationName]
        }
      }
    )
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
    let data = this.educationData[i];
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map((formControlName: string) => {
      let control: AbstractControl = ctrls[formControlName];
      control.setValue(data[formControlName]);
    })
    console.log('edit form value', this.myForm.value);
  }
  close() {

    this.ngMyform();
  }
  onSubmit(form: UntypedFormGroup) {
    if (form.invalid) {
      this.parent.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }

    let data = Object.assign({}, form.value);
    if (this.isEdit) {
      data.TYPE = ['edit', 'update'].includes(this.editData.TYPE) ? 'update' : 'insert';
      // if (this.editData.TYPE == 'edit')
      //   value.TYPE = 'update'
      // else
      //   value.TYPE = 'insert'

      // let data = Object.assign({}, value);
      this.table[this.index] = data;
      this.educationData[this.index] = data;
      console.log(this.educationData);
    } else {
      data.TYPE = 'insert';
      // let data = Object.assign({}, value);
      this.table.push(data);
      this.educationData.push(data);
    }
    this.ngMyform();
    // document.getElementById('md_close_education').click();
    this.parent.toastr.success('Updated successfully');
    this.btnTitle = 'Add Details';
    // this.myForm.reset();
    [this.isEdit, this.index] = [false, -1];
  }

  modeChange(value) {
    this.parent.activeSpinner();
    this.parent.CommonService.postCall('GetEducationName', { EducationModeId: value }).subscribe(
      (res: any) => {
        this.educationNames = res;
        this.parent.deactivateSpinner()
      }, err => {
        this.parent.deactivateSpinner()
      }
    )
  }

  save() {
    this.parent.save();
  }
  close1() {

  }

}
