import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-content-subject',
  templateUrl: './content-subject.component.html',
  styleUrls: ['./content-subject.component.css']
})
export class ContentSubjectComponent implements OnInit {
  
  subDropdown: Array<any> = [];
  isData: boolean;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  ClsDropdown: Array<any> = [];

  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.loadSubject();
    this.getClass();
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      cnt_class_name: ['', Validators.required,],
      CNT_SUB_NAME: ['', Validators.required,],
      CNT_SUB_DESCRIPTION: [''],
      CNT_STATUS: [1, Validators.required]
    })
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  loadSubject() {

    this.activeSpinner();
    let payLoad: any = {
      TENANT_CODE: sessionStorage.getItem('TenantCode'),
    }
    this.CommonService.getCall('ContentSubject/GetList/'+0).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })

  }


  handleClass(event) {
    this.activeSpinner()
    this.subDropdown = [];
    let id: any
    if (event.type == 'change') {
      id = event.target.value
    } else {
      id = event
    }

    this.CommonService.getCall('ContentSubject/GetDDList/' + id).subscribe((res: any) => {
      res.map(element => {
        let obj = {
          item_id: element.CNT_SUB_ID,
          item_text: element.CNT_SUB_NAME,
        }
        this.subDropdown.push(obj)
      })
      this.isData = true
      this.deactivateSpinner()
    })
  }


  getClass() {
    this.activeSpinner()
    this.CommonService.getCall('ContentClass/GetDDList').subscribe((res: any) => {

      res.map(item => {
        let obj = {
          item_id: item.cnt_class_id,
          item_text: item.cnt_class_name,
        }
        this.ClsDropdown.push(obj)
      })

      this.isData = true
      this.deactivateSpinner()
    }, e => {
      this.isData = true
      this.deactivateSpinner()
    })
  }
  add() {
    this.editData = {};
    this.isEdit = false;
    this.myForm.reset();
  }
  close() {

  }


  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;
    value.TENANT_CODE = sessionStorage.getItem('TenantCode');
    let status: Boolean
    if (value.CNT_STATUS == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {
      "CNT_SUB_NAME": value.CNT_SUB_NAME,
      "CNT_SUB_DESCRIPTION": value.CNT_SUB_DESCRIPTION,
      "CNT_CLASS_ID": value.cnt_class_name,
      // "CNT_CLASS_ID": 11,
      "CNT_STATUS": status,
      "CNT_CREATED_BY": sessionStorage.getItem('UserId'),
      "CNT_MODIFIED_DATE": moment(new Date()),
      "CNT_MODIFIED_BY": sessionStorage.getItem('UserId'),
    }
    if (this.isEdit) {
      payload['CNT_CREATED_DATE']= this.editData.CNT_CREATED_DATE;
      payload['CNT_SUB_ID'] = this.editData.CNT_SUB_ID;
      this.CommonService.postCall('ContentSubject/Update', payload).subscribe((res: any) => {
        this.loadSubject();
        this.toastr.success("Subject Updated Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Subject Not Updated')
      })
    } else {

      this.CommonService.postCall('ContentSubject/Create', payload).subscribe((res: any) => {
        this.loadSubject();
        this.toastr.success("Subject Created Succuessfully");
        document.getElementById('md_close').click();
      }, err => {
        this.toastr.error(err.error ? err.error : 'Subject Not created')

      })
    }
  }

  edit(subId) {
    this.isEdit = true;
    this.myForm.reset();
    let payLoad = {
      "CNT_SUB_ID":subId
    }
    this.CommonService.getCall('ContentSubject/GetById/'+subId).subscribe((res: any) => {
      if (res instanceof Array && res.length) {
        this.editData = res[0];
        this.datatransform()
      } else {
        this.editData = res;
        this.datatransform()
      }
    }, err => { }
    )
  }
  datatransform() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value = this.editData[key];
      if (value != undefined) control.setValue(value);
      if (key == "CNT_STATUS") {
        value = this.editData[key] ? 1 : 0
        control.setValue(value);
      }
      else if (key == 'cnt_class_name') {
        value = this.editData['cnt_class_id']
        control.setValue(value);
      }

    });
  }



}
