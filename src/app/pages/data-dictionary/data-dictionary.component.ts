import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-data-dictionary',
  templateUrl: './data-dictionary.component.html',
  styleUrls: ['./data-dictionary.component.css']
})
export class DataDictionaryComponent extends BaseComponent implements OnInit {
  group: Array<any> = [];
  parents: Array<any> = [];


  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    this.loadGrid();
    this.loadDropdowns();
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.myForm = this.fb.group({
      DictionaryName: ['', Validators.required],
      Description: ['', Validators.required],
      ParentDictionaryId: ['', Validators.required],
      GroupId: [''],
      PARENT: ['',],
      Status: ['', Validators.required],

    })
  }

  loadGrid() {
    this.table = [];
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE: this.TenantCode
    }
    this.CommonService.postCall("LoadDataDictionary", payLoad).subscribe((res: any) => {
      this.table = res;
      this.renderDataTable();
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }
  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.editData = {};
  }

  onSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload.TENANT_CODE = sessionStorage.getItem('TenantCode');
    this.activeSpinner();
    if (this.isEdit) {
      payload.DictionaryID = this.editData.DictionaryID;
      // payload.ParentDictionaryId = this.editData.ParentDictionaryId;
      payload.GroupId = this.editData.GroupId;
      payload.LASTMDFBY = sessionStorage.getItem('UserId');
      payload.ContentId = this.editData.ContentId
      this.CommonService.postCall('UpdateDataDictionary', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success(" DataDictionary Updated Successfully");
        document.getElementById('md_close').click()
        this.loadGrid();
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Create Display DataDictionary not updated ") })
    } else {
      payload.CREATEDBY = sessionStorage.getItem('UserId');
      // ContentType=100
      this.CommonService.postCall('CreateDataDictionary', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success("DataDictionary Created Successfully");
        document.getElementById('md_close').click()
        this.loadGrid()
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Create Display DataDictionary not created ") })
    }


  }
  edit(data) {
    this.editData.DictionaryID = data.DICTIONARYID;
    this.isEdit = true;
    this.CommonService.postCall('EditDataDictionary', this.editData).subscribe((res) => {
      this.editData = res[0];
      this.setData()
    })
  }

  setData() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value = this.editData[key];
      if (value != undefined) control.setValue(value);
    });
  }

  loadDropdowns() {
    this.activeSpinner();
    this.CommonService.postCall('GetParentDictionary', {}).subscribe((res) => {
      this.deactivateSpinner();
      this.parents = res;
    }, err => { this.deactivateSpinner })
    this.CommonService.postCall('GetGroupDictionary', {}).subscribe((res) => {
      this.deactivateSpinner();
      this.group = res;
    }, err => { this.deactivateSpinner })
  }
}
