import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../base.component';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-cource-category',
  templateUrl: './cource-category.component.html',
  styleUrls: ['./cource-category.component.css']
})
export class CourceCategoryComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  private readonly onDestroy = new Subscription();
  // RoleId:number;
  file: File;
  fileName: string = null;
  document_name: string = '';
  data: any;
  imageURL: any;
  serverPath: string;
  
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService, private fileuploadService: FileuploadService) {
    super(CommonService, toastr);
    this.loadCourseCategory();
    this.serverPath = environment.fileUrl;
  }



  ngOnInit(): void {
    this.myForm = this.fb.group({
      MNAME: ['', Validators.required],
      MDESCRIPTION: ['ABC'],
      MSTATUS: [true],
      IMAGE_URL: ['']
    })
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['MSTATUS'].setValue(true)
  }

  loadCourseCategory() {
    this.activeSpinner()
    // let payLoad = {
    //   TENANT_CODE: this.tId||this.TenantCode
    // }
    this.CommonService.getCall("GetAllCategories").subscribe((res: any) => {
      this.table = [];
      this.table = res;
      this.renderDataTable();
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });

  }


  changeFile(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = [['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPEG', 'image']];
      let check = types.includes(filetype);
      if (check == false) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (_event) => {
          this.imageURL = reader.result;
        }
        this.uploadImage();
        return;
      }
      else
        event.target.value = '';
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/category_images');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        this.imageURL = `${this.serverPath}${this.fileName}`;
        // if (this.fileName) {
        //   this.myForm.controls['IMAGE_URL'].setValue(this.fileName);
        // }
      } catch (e) {
      }

    }, err => { })

  }
  onCategoryImage() {
    document.getElementById('materialFile1').click();
  }


  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.setDefault();
    this.imageURL = '';
  }

  add() { }

  edit(data) {
    let payLoad = this.editData = {
      MID: data.COURSE_CATEGORY_ID,
      TENANT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.isEdit = true;
    this.CommonService.postCall('EditCourseCategory', payLoad).subscribe((res: any) => {
      if (res.length) {
        this.editData = res[0];
      } else {
        this.editData = res;
      }
      this.editData['COURSE_CATEGORY_ID'] = data.COURSE_CATEGORY_ID
      this.setData(this.editData);

    }, err => { })
  }

  setData(data: any) {
    let ctrls: any = this.myForm.controls;
    this.imageURL = `${this.serverPath}${data['IMAGE_URL']}`;
    ctrls['MSTATUS'].setValue(data['COURSE_CATEGORY_STATUS'] ? true : false)
    ctrls['MNAME'].setValue(data['COURSE_CATEGORY_NAME'])
    // ctrls['MDESCRIPTION'].setValue(this.editData['COURSE_CATEGORY_DESCRIPTION']);
    ctrls['IMAGE_URL'].setValue(data['IMAGE_URL']);
  }

  onSubmit(form: UntypedFormGroup) {
   
    let payLoad = form.value;
    if (form.invalid) return
    payLoad["CREATEDBY"] = this.editData.CREATEDBY || sessionStorage.getItem('UserId');
    payLoad.TENANT_CODE = sessionStorage.getItem('TenantCode');
    payLoad.IMAGE_URL = this.fileName;

    if (this.isEdit) {
      payLoad.LASTMDFDATE = moment(new Date())
      payLoad.MID = this.editData.MID || this.editData.COURSE_CATEGORY_ID;
      //payLoad.IMAGE_URL = this.fileName;

      this.CommonService.postCall('UpdateCourseCategory', payLoad).subscribe((res: any) => {
        this.loadCourseCategory();
        this.toastr.success('Course Category Updated Successfully');
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error ? err.error : 'Course Category  not Updated');
      })
    } else {
      payLoad.CREATEDDATE = moment(new Date())
      this.CommonService.postCall('CreateCourseCategory', payLoad).subscribe((res: any) => {
        this.loadCourseCategory();
        this.toastr.success('Course Category created Successfully');
        document.getElementById('md_close').click()
      }, err => {
        this.toastr.error(err.error ? err.error : 'Course Category not created');
      })
    }
  }

  changeTname() {
    this.loadCourseCategory()
  }
  // ngOnDestroy() {
  //   this.dtTrigger.unsubscribe();
  // }
  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

}