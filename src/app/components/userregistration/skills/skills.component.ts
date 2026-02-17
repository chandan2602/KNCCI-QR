import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { BaseComponent } from './../base.component'
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent extends BaseComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  index: number = -1;
  skillData: Array<any> = [];
  keys: object = {
    TYPE: 'type', SKILLID: 'SkillID', SKILLNAME: 'SkillName', VERSION: 'Version', EXPERIANCE: 'Experience', MONTHS: 'Months'
  }
  btnTitle: string = 'Add Details';
  constructor(private fb: UntypedFormBuilder) {
    super()
  }

  ngOnInit(): void {
    this.myFormInit();
    this.parent.childs['SkillsList'] = this
  }

  myFormInit() {
    this.myForm = this.fb.group({
      SkillName: ['', Validators.required],
      Version: ['', Validators.required],
      LastUsed: ['2022'],
      Experience: ['', Validators.required],
      Months: ['', Validators.required],
    });
  }

  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.skillDataFromat(this.editData['Skills'].slice(0));
      this.dataTransform(this.editData['Skills'].slice(0));
    }
  }
  skillDataFromat(skills: Array<any>) {

    skills.map(item => {
      let data: any = {}
      Object.keys(this.keys).map(k => {
        let key = this.keys[k];
        data[key] = item[k];
      })
      this.skillData.push(data)
    })
  }
  dataTransform(data) {
    this.table = data;
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
    let data = this.skillData[i];
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map((formControlName: string) => {
      let control: AbstractControl = ctrls[formControlName];
      control.setValue(data[formControlName]);
    })
  }
  close() {
    this.myForm.reset()
  }
  onSubmit(form: UntypedFormGroup) {
    if (form.invalid) {
      this.parent.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }

    let data = Object.assign({}, form.value);
    if (this.isEdit) {
      data.TYPE = ['edit', 'update'].includes(this.editData.TYPE) ? 'update' : 'insert';
      data['SkillID'] = this.editData['SKILLID']
      // this.skillData[this.index] = data;
      this.changeTableFormat(data, false);
    } else {
      data.type = 'insert'
      // this.skillData.push(data);
      this.changeTableFormat(data, true);
    }
    this.clearForm();
  }

  clearForm() {
    this.myFormInit();
    this.btnTitle = 'Add Details';
    [this.isEdit, this.index] = [false, -1];
  }

  changeTableFormat(dataOld: object, type) {
    let data = {}
    Object.keys(this.keys).map(k => {
      let key = this.keys[k];
      data[k] = dataOld[key];
    });
    // if (type) {
    //   this.table.push(data);
    //   this.parent.toastr.success('Added successfully')
    // } else if (this.index > -1) {
    //   this.table[this.index] = data;
    //   this.parent.toastr.success('Updated successfully')
    // }

    if (type) {
      this.table.push(data);
      // let obj = Object.assign({}, data);
      this.skillData.push(dataOld);
      this.parent.toastr.success('Added successfully');
    } else if (this.index > -1) {
      let i = this.index;
      this.table[i] = data;
      // let obj = Object.assign({}, data);
      this.skillData[i] = dataOld;
      this.parent.toastr.success('Updated successfully');
    }

  }
  check(item) {
    if (item.TYPE == 'delete') {
      return true
    }
    else {
      return false
    }
  }
  success() {
    this.parent.save();
  }
  close1() {

  }

  restrictZero(event: any) {
    if (event.target.value.length == 0 && event.key == '0')
      event.preventDefault();
  }
}
