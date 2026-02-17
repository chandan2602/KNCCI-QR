import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-cource-type',
  templateUrl: './cource-type.component.html',
  styleUrls: ['./cource-type.component.css']
})
export class CourceTypeComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService,  toastr: ToastrService) {
    super(CommonService,toastr);
    this.loadCourseType()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      MNAME: ['', Validators.required,],
      MDESCRIPTION: ['',],
      MSTATUS: [true]
    })
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['MSTATUS'].setValue(true)
  }

  loadCourseType() {
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE: this.tId||this.TenantCode
    }
    this.CommonService.postCall("LoadCourseType", payLoad).subscribe((res: any) => {
      this.table=[]
        this.table = res;
       this.renderDataTable();
     
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }


  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.setDefault();
  }
  add() { }
  edit(data) {
    let payLoad = this.editData = {
      MID: data.COURSE_TYPE_ID,
      TENANT_CODE:sessionStorage.getItem('TenantCode')

    }
    this.isEdit = true;
    this.CommonService.postCall('EditCourseType', payLoad).subscribe((res: any) => {
       if(res instanceof Array&& res.length){
        this.editData = res[0];
       }else{
         this.editData=res;
       }
     
      this.setData();
    }, err => { })
  }
  setData() {
    let ctrls: any = this.myForm.controls;
    // Object.keys(ctrls).map((key: string) => {
    //   let control: FormControl = ctrls[key];
    //   control.setValue(this.editData[key])
    // })
    ctrls['MSTATUS'].setValue(this.editData['COURSE_TYPE_STATUS'])
    ctrls['MNAME'].setValue(this.editData['COURSE_TYPE_NAME'])
    ctrls['MDESCRIPTION'].setValue(this.editData['COURSE_TYPE_DESCRIPTION']);

  }
  onSubmit(form: UntypedFormGroup) {
    let payLoad = form.value;
    payLoad["CREATEDBY"] = this.editData.CREATEDBY || sessionStorage.getItem('UserId');
    payLoad.TENANT_CODE = sessionStorage.getItem('TenantCode');
    payLoad.CREATEDDATE = moment(new Date());
    if (this.isEdit) {
      payLoad.MID = this.editData.COURSE_TYPE_ID;
      this.CommonService.postCall('UpdateCourseType', payLoad).subscribe((res: any) => {
        this.loadCourseType();
        this.toastr.success('Course Type Updated Succuessfully')
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error?err.error:'Course Type  not Updated')
      })
    } else {
     
      this.CommonService.postCall('CreateCourseType', payLoad).subscribe((res: any) => {
        this.loadCourseType();
        this.toastr.success('Course Type created Succuessfully')
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error?err.error:'Course Type  not created ')
      })
    }
  }
  changeTname() {
    this.loadCourseType()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}