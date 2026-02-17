import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';

@Component({
  selector: 'app-create-tenant-registration',
  templateUrl: './create-tenant-registration.component.html',
  styleUrls: ['./create-tenant-registration.component.css']
})
export class CreateTenantRegistrationComponent implements OnInit {
  myform: UntypedFormGroup;
  isEdit: boolean = false;
  tnt_code: string;
  editData: any = {}
  tenants: Array<any> = [];
  file: File;
  fileName: string;
  constructor(private CommonService: CommonService, private fb: UntypedFormBuilder, private active: ActivatedRoute, private toastr: ToastrService, private FileuploadService: FileuploadService) {
    active.queryParams.subscribe((res) => {
      this.tnt_code = res.tntCode
    })
    this.getTenantData();
  }

  ngOnInit(): void {
    this.myform = this.fb.group({
      TNT_NAME: ['', Validators.required],
      TNT_STATUS: ['', Validators.required],
      TNT_PARENT_CODE: ['', Validators.required],
      TNT_DESCRIPTION: ['', Validators.required],
      TNT_KEY: ['', Validators.required],
      TNT_CONCURRENT_AVSESSIONS: ['', Validators.required],
      TNT_USERSPERSESSION: ['', Validators.required],
      TenantLogoUrl: [''],
      SHOWLOGO: [false],
      allow_proctoring:[false],
      allow_exampad:[false]
    });

    if (this.tnt_code) {
      this.isEdit = true;
      this.getData();
    }
  }

  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner();
  }
  getData() {
    this.activeSpinner();
    this.CommonService.postCall('EditTenant', { TNT_CODE: this.tnt_code }).subscribe(
      (res: any) => {
        this.deactivateSpinner()
        if(res instanceof Array ){
        this.editData = res[0];
        this.dataTransfer(res[0])
      }else{
        this.editData = res;
        this.dataTransfer(res);
      }
      }
    )
  }
  dataTransfer(data) {
    let ctrls = this.myform.controls;
    Object.keys(ctrls).map(key => {
      let ctrl = ctrls[key];
      ctrl.setValue(data[key])
    })
    ctrls['TNT_KEY'].setValue(moment(data['TNT_KEY']).format('yyyy-MM-DD'))
  }
  onSubmit(form: UntypedFormGroup) {
    let value = Object.assign({}, form.value);
    value['TNT_CREATEDBY'] = sessionStorage.getItem('UserId');
    this.activeSpinner();
   
    if (this.isEdit) {
      value['TNT_CODE'] = this.tnt_code;
      this.CommonService.postCall('UpdateTenant', value).subscribe(
        (res: any) => {
          this.toastr.success('Tenant Updated Successfully');
          this.deactivateSpinner();
          this.close();
        }, err => {
          this.deactivateSpinner();
          this.toastr.error(err.error ? err.error : 'Tenant not Updated')
        }
      )
    } else {
      this.CommonService.postCall('SaveTenant', value).subscribe(
        (res: any) => {
          this.toastr.success('Tenant Created  Successfully');
          this.deactivateSpinner();
          this.close();
        }, err => {
          this.deactivateSpinner();
          this.toastr.error(err.error ? err.error : 'Tenant not Created')
        }
      )
    }

  }
  close() {
    window.history.back()
  }
  getTenantData() {
    let payLoad = {
      RoleId: sessionStorage.getItem('RoleId'),
      TNT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.activeSpinner();
    this.CommonService.postCall('LoadTenantByRoleId', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner()
        this.tenants = res;
      }, err => {
        this.deactivateSpinner()
      }
    )
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', "JPEG"]
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload()
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning('Please upload image file formats only.')
        event.target.value = ''
      }
    }
  }

  upload() {
    if (!this.file) return
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('ClientDocs', 'ClientDocs');

    this.activeSpinner();
    this.FileuploadService.upload(formData, 'UploadTenant').subscribe((res: any) => {
      this.fileName = res.FilePath;
      if (this.fileName && res.FilePath) {
        // this.file = null;
        this.deactivateSpinner();
        this.myform.controls['TenantLogoUrl'].setValue(this.fileName)
      }
    }, err => {
      this.toastr.warning(err.error ? err.error : 'file not uploaded')
      this.deactivateSpinner();
    })
  }
}
