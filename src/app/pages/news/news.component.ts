import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent extends BaseComponent implements OnInit { 
  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService,  toastr: ToastrService,private FileuploadService: FileuploadService) {
    super(CommonService, toastr); 
    this.LoadCreateNews()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      EVENT_TYPE: ['', Validators.required],
      EVENT_NAME: ['', Validators.required],
      EVENT_DESCRIPTION: ['', Validators.required],
      EVENT_STATUS: [true, Validators.required],
      EVENT_IMAGE_NAME:['']
    })
    this.setDefault()
  }

  setDefault() {
    let ctrls = this.myForm.controls;
    ctrls['EVENT_TYPE'].setValue('0');
    ctrls['EVENT_STATUS'].setValue(true)
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }

  LoadCreateNews() {
    this.activeSpinner();
    this.CommonService.postCall('LoadCreateNews', { TENANT_CODE:this.tId|| this.TenantCode }).subscribe((res: any) => {
      this.table = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() })
  }

  add() {
    this.setDefault();
    this.isEdit = false;

  }
  edit(data) {
    this.setDefault();
    this.isEdit = true;

    let payaLoad = this.editData = {
      EVENT_ID: data.EVENT_ID,
      TENANT_CODE: this.TenantCode
    }
    this.CommonService.postCall('editcreatenews', payaLoad).subscribe((res: any) => {
      if (res instanceof Array) {
        this.editData = res[0]
      } else if (res instanceof Object) {
        this.editData = res;
      }
      this.setValues();
    }, err => { })

  }
  setValues() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      control.setValue(this.editData[key])
    });
    ctrls['EVENT_TYPE'].setValue(this.editData['EVENT_TYPE']?"1":"0")
  }

  delete(data) {
    let payaLoad  = {
      EVENT_ID: data.EVENT_ID,
      TENANT_CODE: this.TenantCode
    }
    let c=confirm('Are you sure, you want to delete record?');
    if(c){
      this.CommonService.postCall('deletecreatenews',payaLoad).subscribe((res:any)=>{
        this.LoadCreateNews();
        this.toastr.success('News deleted  Successfully')
      },e=>{

      })
    }
  }
  close() {
    this.myForm.reset();
    this.isEdit = false;;
    this.editData={}
  }

  onSubmit(form: UntypedFormGroup) {
    let payaLoad = form.value;
    payaLoad.TENANT_CODE = this.TenantCode;
    payaLoad.EVENT_CREATEDBY = this.editData.EVENT_CREATEDBY || sessionStorage.getItem('UserId');
    payaLoad.CREATEDDATE = this.editData.CREATEDDATE || moment(new Date());
    if (this.isEdit) {
      payaLoad.EVENT_ID = this.editData.EVENT_ID;
      this.CommonService.postCall('CreateNewsUpdate', payaLoad).subscribe((res: any) => {
        this.LoadCreateNews();
        this.toastr.success('News Updated Successfully')
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error?err.error:'News  not Updated')
      })
    } else {
      this.CommonService.postCall('CreateNewssave', payaLoad).subscribe((res: any) => {
        this.LoadCreateNews();
        this.toastr.success('News created Successfully')
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error?err.error:'News  not created ')
      })
    }
  }
  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
    
      // if (check) {
        this.file = file;
        this.upload()
      // }
      // else {
      //   // alert(' Please upload pdf and doc file formats only.')
      //   this.toastr.warning('Please upload Xls,xlsx file formats only.')
      //   event.target.value = ''
      // }
    }
    }
    upload() {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('ClientDocs', 'ClientDocs');
     
      this.activeSpinner();
      this.FileuploadService.upload(formData, 'UploadNews').subscribe((res: any) => {
        try {
          this.fileName = res.path;
          if(res.ValidationMessage){this.deactivateSpinner();this.toastr.warning(res.ValidationMessage)}
          if (this.fileName) {
            this.deactivateSpinner()
            this.myForm.controls['EVENT_IMAGE_NAME'].setValue(this.fileName)
          }
        } catch (e) {
          console.log(e)
        }
  
      }, err => { this.deactivateSpinner(); })
    }
    changeTname(){
      this.LoadCreateNews();
    }
    ngOnDestroy(){
      this.dtTrigger.unsubscribe();
    }
}
