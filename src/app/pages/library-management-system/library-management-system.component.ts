import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-library-management-system',
  templateUrl: './library-management-system.component.html',
  styleUrls: ['./library-management-system.component.css']
})
export class LibraryManagementSystemComponent implements OnInit {
  table: Array<any> = [];
  categories:Array<any>=[];
  myForm: UntypedFormGroup;
  isEdit: boolean = null;
  editData: any;
  BOOK_DEPARTMENT_ID:any;
 
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService) {
    this.load();
    this.categorydropdown();
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      BOOK_CODE: ['',Validators.required],
      BOOK_NAME:['',Validators.required],
      BOOK_AUTHOR: [''],
      BOOK_PUBLICATION: [''],
      BOOK_DEPARTMENT_ID: [''],
      BOOK_EDITION: [''],
      BOOK_DESCRIPTION: ['',Validators.required],
      BOOK_NO_OF_COPIES: ['',Validators.required],
      BOOK_PRICE: [''],
    })
    this.categorydropdown();
  }

  load() {
    this.activiceSpinner();
    let payLoad: any = {
      BOOK_TNT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall('LibraryManagement/GetList',payLoad).subscribe((res: any) => {
      this.table = [];
      setTimeout(() => {
        this.table = res;
      }, 10)
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(), console.log(e) })
  }

  activiceSpinner() {
    this.CommonService.activateSpinner();
  }
  deactivateSpinner() {
    this.CommonService.deactivateSpinner();
  }

  categorydropdown(){
    this.activiceSpinner()
    let payLoad= { 
      "TNT_CODE":sessionStorage.getItem('TenantCode')
  }
    this.CommonService.postCall('Department/dropdown',payLoad).subscribe((res: any) => {
      this.categories = res;
      this.deactivateSpinner()
    }, e => {
      this.deactivateSpinner()
    })
  }

  onSubmit(form: UntypedFormGroup) {
    let value: any = form.value;
    value.TNT_CODE = sessionStorage.getItem('TenantCode');
    let status: Boolean
    if (value.BOOK_STATUS == 1) {
      status = true
    } else {
      status = false
    }
    let payload = {
      "BOOK_CODE":value.BOOK_CODE,
      "BOOK_NAME":value.BOOK_NAME,
      "BOOK_DESCRIPTION":value.BOOK_DESCRIPTION,
      "BOOK_TITLE":value.BOOK_TITLE,
      "BOOK_AUTHOR":value.BOOK_AUTHOR,
      "BOOK_PUBLICATION":value.BOOK_PUBLICATION,
      "BOOK_EDITION":value.BOOK_EDITION,
      "BOOK_NO_OF_COPIES":value.BOOK_NO_OF_COPIES,
      "BOOK_PRICE":value.BOOK_PRICE,
      "BOOK_AVAILABILITY_STATUS":true,
      "BOOK_DEPARTMENT_ID":value.BOOK_DEPARTMENT_ID,
      "BOOK_CREATED_BY": sessionStorage.getItem('UserId'),
      "MODIFIED_BY":  sessionStorage.getItem('UserId'),    
      "BOOK_TNT_CODE":sessionStorage.getItem('TenantCode'),
     
  }
  if (this.isEdit){
    payload['BOOK_ID'] = this.editData.BOOK_ID;
    this.CommonService.postCall('LibraryManagement/Update', payload).subscribe((res: any) => {
      this.load();
      this.toastr.success("LibraryManagement Updated Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'LibraryManagement Not Updated')
    })
  }else {

    this.CommonService.postCall('LibraryManagement/Create', payload).subscribe((res: any) => {
      this.load();
      this.toastr.success("LibraryManagement Created Succuessfully");
      document.getElementById('md_close').click();
    }, err => {
      this.toastr.error(err.error ? err.error : 'LibraryManagement Not created')

    })
  }
  }

  edit(bookId) {
    this.editData=bookId;
    this.isEdit=true;
    this.myForm.reset();
    let payLoad={
      "BOOK_ID":bookId
    }
    this.CommonService.postCall('LibraryManagement/Get',payLoad).subscribe((res: any) => {
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
  
    ctrls['BOOK_CODE'].setValue(this.editData['BOOK_CODE']);
    ctrls['BOOK_NAME'].setValue(this.editData['BOOK_NAME']);
    ctrls['BOOK_DESCRIPTION'].setValue(this.editData['BOOK_DESCRIPTION']);
    // ctrls['BOOK_TITLE'].setValue(this.editData['BOOK_TITLE']);
    ctrls['BOOK_DEPARTMENT_ID'].setValue(this.editData['BOOK_DEPARTMENT_ID']);
    ctrls['BOOK_AUTHOR'].setValue(this.editData['BOOK_AUTHOR']);
    ctrls['BOOK_PUBLICATION'].setValue(this.editData['BOOK_PUBLICATION']);
    ctrls['BOOK_EDITION'].setValue(this.editData['BOOK_EDITION']);
    ctrls['BOOK_NO_OF_COPIES'].setValue(this.editData['BOOK_NO_OF_COPIES']);
    ctrls['BOOK_PRICE'].setValue(this.editData['BOOK_PRICE']);
    // ctrls['BOOK_STATUS'].setValue(this.editData.BOOK_STATUS ? 1 : 0);
     
    
   
  }
  close() {
    this.isEdit=null;
    this.myForm.reset();
    this.editData={};
  }
}
