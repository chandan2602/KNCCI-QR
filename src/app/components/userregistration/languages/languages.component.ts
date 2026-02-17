import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  index: number;
  languages: Array<any> = [];
  levels: Array<any> = [];
  lanuageData: any;
  btnTitle: string = 'Add Details';
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.formInit();
    this.getAll()
    this.parent.childs['LanguagesList'] = this
  }

  formInit() {
    this.myForm = this.fb.group({
      LanguageID: [0],
      Language: ['', Validators.required],
      ProficiencyLevel: ['Advanced'],
      ReadL: [false],
      WriteL: [false],
      SpeakL: [false],
    });
  }

  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.dataTransform(this.editData['Languages'].slice(0));
    }
  }

  dataTransform(data: Array<any>) {

    data.map(item => {
      let obj = {
        LanguageID: item['LanguageID'],
        type: item['type'],
        Language: item['Language'],
        // LanguageName: item['Language'],
        // ProficiencyLevelName: item['ProficiencyLevel'],
        ProficiencyLevel: item['ProficiencyLevel'],
        ReadL: item['ReadL'],
        WriteL: item['WriteL'],
        SpeakL: item['SpeakL'],
      }
      this.table.push(obj)
    });
    this.addIds()
  }

  getAll() {
    let language = this.parent.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Language });//GetLanguage
    let level = this.parent.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.ProficiencyLevel });//GetProficiencyLevel
    forkJoin([language, level,]).subscribe((res) => {
      [this.languages, this.levels,] = [...res];
      this.addIds()
    })

  }

  add() {
    this.isEdit = false;
  }

  edit(data, i) {
    this.index = i;
    this.isEdit = true;
    this.editData = data;
    this.myForm.patchValue(data);
    // this.assignDataForm(i);
    this.btnTitle = 'Update Details';
  }

  close() {
    this.myForm.reset()
  }

  clearForm() {
    this.formInit();
    this.btnTitle = 'Add Details';
    [this.isEdit, this.index] = [false, -1];
  }

  onSubmit(form: UntypedFormGroup) {
    if (form.invalid) {
      this.parent.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }
    // let value = form.value;
    let data = Object.assign({}, form.value);
    if (this.isEdit) {
      data.type = ['edit', 'update'].includes(this.editData.type) ? 'update' : 'insert';
      // if (this.editData.type == 'edit') {
      //   value.type = 'update'
      // } else {
      //   value.type = 'insert'
      // }
      //let data = Object.assign({}, value);
      // this.table[this.index] = data;
      //data['LanguageID'] = this.editData['LanguageID']
      this.createAndUpdate(data, false);
    } else {
      data.type = 'insert'
      //  let data = Object.assign({}, value);
      // this.table.push(data);
      this.createAndUpdate(data, true)
    }
    // this.formInit();
    // [this.isEdit, this.index] = [false, -1];
    // document.getElementById('md_close_lan').click();
    this.clearForm();
  }

  languageFormatData(data: Array<any>) {
    this.lanuageData = data.slice(0);
  }

  addIds() {

    this.languageFormatData(this.table.slice(0));
  }

  createAndUpdate(data, type) {
    let i = this.index;
    if (type) {
      this.table.push(data);
      //let obj = Object.assign({}, data);
      this.lanuageData.push(data);
      this.parent.toastr.success('Added successfully')
    } else {
      this.table[i] = data;
      //  let obj = Object.assign({}, data);
      this.lanuageData[i] = data
      this.parent.toastr.success('Updated successfully')
    }
  }

  assignDataForm(i) {
    let data = this.lanuageData[i];
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map((formControlName: string) => {
      let control: AbstractControl = ctrls[formControlName];
      control.setValue(data[formControlName]);
    });
  }

  check(item) {
    if (item.type == 'delete') {
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
}