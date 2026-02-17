import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
   this.loadDepartment();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      DEPARTMENT_NAME: ['', Validators.required,],
      DEPARTMENT_DESCRIPTION:[''],
      DEPARTMENT_STATUS: [1, Validators.required]
    })
    this.setDefault()
  }
  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['DEPARTMENT_STATUS'].setValue(1)
  }
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }

  loadDepartment(){
    this.activeSpinner();
    let payLoad: any = {
      TNT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('Department/GetList', payLoad).subscribe((res: any) => {
      this.table=[];
      setTimeout(()=>{
        this.table = res;
      },10)
      this.deactivateSpinner();
    },e=>{this.deactivateSpinner()})
  }
  add() {
    this.editData = {};
    this.isEdit = false;
  }
  close() {
    this.myForm.reset();
    this.setDefault()
  }

  onSubmit(form: UntypedFormGroup) {
    let value:any=form.value;
    value.TNT_CODE = 60268037;
    let status: Boolean
    if (value.DEPARTMENT_STATUS == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {
    
      "DEPARTMENT_NAME": value.DEPARTMENT_NAME,
      "DEPARTMENT_DESCRIPTION": value.DEPARTMENT_DESCRIPTION,
      "DEPARTMENT_STATUS":status,
      "TNT_CODE":sessionStorage.getItem('TenantCode'),
      "DEPARTMENT_CREATED_BY": sessionStorage.getItem('UserId'),
      "DEPARTMENT_CREATED_DATE": moment(new Date()),
      "DEPARTMENT_MODIFIED_DATE":  moment(new Date()),
      "DEPARTMENT_MODIFIED_BY":  sessionStorage.getItem('UserId'),
  }
  if (this.isEdit) {
    payload['DEPARTMENT_CREATED_DATE']= this.editData.DEPARTMENT_CREATED_DATE;
    payload['DEPARTMENT_ID'] = this.editData.DEPARTMENT_ID;
    this.CommonService.postCall('Department/update', payload).subscribe((res: any) => {
      this.loadDepartment();
      this.toastr.success("Department Updated Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Department Not Updated')
    })
  }else {

    this.CommonService.postCall('Department/Create', payload).subscribe((res: any) => {
      this.loadDepartment();
      this.toastr.success("Department Created Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'Department Not created')

    })
  }


}
edit(departmentId) {
  this.editData=departmentId;
  this.isEdit=true;
  this.myForm.reset();
  let payLoad={
    "DEPARTMENT_ID":departmentId
  }
  this.CommonService.getCall('Department/Get/'+departmentId).subscribe((res: any) => {
    if (res instanceof Array && res.length) {
      this.editData = res[0];
      this.dataTransForm()
    } else {
      this.editData = res;
      this.dataTransForm()
    }
    this.dataTransForm();
  }), err => { }
 

 }
 
 dataTransForm(){
  let ctrls=this.myForm.controls
  Object.keys(ctrls).map((key)=>{
    let ctrl: AbstractControl = ctrls[key];
    ctrl.setValue(this.editData[key])

  });

  ctrls['DEPARTMENT_NAME'].setValue(this.editData['DEPARTMENT_NAME'])
  ctrls['DEPARTMENT_DESCRIPTION'].setValue(this.editData['DEPARTMENT_DESCRIPTION'])
  ctrls['DEPARTMENT_STATUS'].setValue(this.editData.DEPARTMENT_STATUS ? 1 : 0);
 
 
}
}





