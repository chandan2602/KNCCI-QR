import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { valHooks } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { FileuploadService } from '../../services/fileupload.service';
import { BaseComponent } from '../base.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.css']
})
export class ContentManagerComponent extends BaseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  mId: string = ''
  materials: Array<any> = [];
  courses: Array<any> = [];
  courceId: string = '';
  shedules: Array<any> = []
  sheduleId: string = '';
  materialId: string | number;
  IsShowModel: boolean = false;


  typesOfFile: object = {
    'Uploaded Material': {
      types: ['doc', 'docx', 'pdf', 'jpg', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg'],
      message: 'Please upload the',
    },
    'Webinar Info': {
      types: ['m4v', 'avi', 'mpg', 'mp4'],
      message: "Please upload the "
    },
    'E-Learning Material': {
      types: ['pdf', 'xlsx', 'doc'],
      message: "Please upload the Flash file Like"
    },
    'Audio': {
      types: ['mp3', 'wav'],
      message: "please upload the"
    }
  };
  get e_learn(): boolean {
    return this.mId == 'E-Learning Material' ? true : false;
  }
  get isFile(): boolean {
    if (this.mId == "External Links") {
      return false;
    }
    return true;
  }

  private readonly onDestroy = new Subscription();

  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService, private FileuploadService: FileuploadService) {
    super(CommonService, toastr)
  }

  ngOnInit(): void {
    this.formInIt();
    this.setDefault();
    this.getCourses()
  }

  formInIt() {
    this.myForm = this.fb.group({
      MATERIAL_COURSE_ID: ['', Validators.required],
      MATERIAL_COURSE_SCHEDULE_ID: ['', Validators.required],
      MATERIAL_NAME: ['', Validators.required,],
      MATERIAL_DESCRIPTION: ['', [Validators.required]],
      MaterialStatus: [1, Validators.required],
      MATERIAL_PATH: ['']
    })
  }

  setDefault() {
    let ctrl = this.myForm.controls;
    ctrl['MaterialStatus'].setValue(1)
  }


  // getCourses() {
  //   this.activeSpinner()
  //   this.CommonService.getAdminCourses().subscribe((res: any) => {
  //     this.courses = res;
  //     this.deactivateSpinner()
  //   }, e => {
  //     this.deactivateSpinner()
  //   })
  // }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };
    // this.myCourseList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {
      // this.myCourseList = res.dtCourseScehdule;
      this.courses = res;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  // ngOnDestroy(): void {
  //   this.onDestroy.unsubscribe();
  //   this.dtTrigger.unsubscribe();
  // }
  courseChange() {

    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner()
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.shedules = res;
    }, e => { this.deactivateSpinner() })
  }

  change() {
    this.loadDataTable('contentReport');
    this.activeSpinner();
    let payload = {
      MaterialCode: this.mId,
      TenantCode: this.tId || this.TenantCode
    }
    const ob2$ = this.CommonService.postCall('LoadContentManager', payload).subscribe(res => {
      this.table = res;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob2$);
    this.enableOrDisabledSpinner(false);
  }

  add() {
    this.editData = {};
    this.isEdit = false;
    this.showOrHideModel();
  }

  showOrHideModel(isshow: boolean = true) {
    this.IsShowModel = isshow;
    if (isshow)
      setTimeout(() => document.getElementById('btnShowModel')?.click(), 100);
  }

  close() {
    this.fileName = '';
    this.myForm.reset();
    this.formInIt();
    this.setDefault();
    this.showOrHideModel(false);
  }
  onSubmit(form: UntypedFormGroup) {
    this.activeSpinner();
    let payLoad: any = form.value;
    if (this.fileName)
      payLoad.MATERIAL_PATH = this.fileName;
    payLoad.TENANT_CODE = this.TenantCode
    payLoad.MATERIAL_Type = this.mId
    if (this.isEdit) {
      payLoad.MATERIAL_PATH_MODIFIEDBY = this.userId
      payLoad.MATERIAL_PATH_MATERIALS_ID = this.materialId;
      this.CommonService.postCall('UpdateContentManager', payLoad).subscribe((res: any) => {
        this.deactivateSpinner();
        this.toastr.success("Content Manager updated Successfully");
        document.getElementById('md_close')?.click();
        this.change()
      }, err => {
        this.deactivateSpinner();
        this.toastr.error(err.error ? err.error : 'failure')
      })
    } else {
      payLoad.MATERIAL_PATH_CREATEDBY = this.userId

      this.CommonService.postCall('CreateContentManager', payLoad).subscribe((res: any) => {
        this.toastr.success("Content Manager created Successfully");
        document.getElementById('md_close')?.click();
        this.change();
        this.deactivateSpinner();
      }, err => {
        this.deactivateSpinner();
        this.toastr.error(err.error ? err.error : 'failure')
      })
    }

  }

  edit(data) {
    this.isEdit = true;
    this.showOrHideModel();
    this.materialId = data.MATERIAL_ID;
    this.activeSpinner();
    this.CommonService.postCall('EditContentManager', { MaterialId: this.materialId }).subscribe((res) => {
      this.deactivateSpinner();
      if (res.lenght) {
        this.dataTransfer(res[0]);
      } else {
        this.dataTransfer(res);
      }
    }, err => { this.deactivateSpinner() })
  }

  dataTransfer(data) {
    let controls = this.myForm.controls
    Object.keys(controls).map(key => {
      let control = controls[key];
      if (key == 'MaterialStatus') {
        let value = data['MATERIAL_STATUS'] ? 1 : 0;
        control.setValue(value)
      } else {
        control.setValue(data[key])
      }
    })
    this.fileName = data.MATERIAL_PATH;
    // this.fileName = data['MATERIAL_PATH'];
    if (this.courceId) {
      this.courseChange()
    }
  }

  delete(item) {
    var c = confirm("Do you want to delete this Material?");
    if (c) {
      this.CommonService.postCall('DeleteContentManager', { MaterialId: item.MATERIAL_ID }).subscribe((res) => {
        this.change()
        this.toastr.success('Information deleted successfully.')
      }, e => { this.toastr.error("Information not deleted ") })
    }
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let materialType: object = this.typesOfFile[this.mId || 'Uploaded Material']

      let check = materialType['types'].includes(filetype?.toLowerCase());
      if (check) {
        this.file = file;
        this.upload()
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning(materialType['message'] + JSON.stringify(materialType['types']))
        event.target.value = ''
      }
    }


  }
  // upload() {
  //   const formData = new FormData();
  //   formData.append('file', this.file);
  //   formData.append('ClientDocs', 'ClientDocs');
  //   formData.append('Course', this.courceId);
  //   formData.append('MaterialType', this.mId);
  //   this.activeSpinner();
  //   this.FileuploadService.upload(formData, 'UploadMaterial').subscribe((res: any) => {
  //     try {
  //       this.fileName = res.path;
  //       if (this.fileName) {
  //         this.deactivateSpinner()
  //         this.myForm.controls['MATERIAL_PATH'].setValue(this.fileName)
  //       }
  //     } catch (e) {
  //       console.log(e)
  //     }

  //   }, err => { this.deactivateSpinner(); })
  // }
  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/UploadMaterial');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
      } catch (e) { console.log(e); }

    }, err => { })
  }




  changeTname() {
    // this.()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
