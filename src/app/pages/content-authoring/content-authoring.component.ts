import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { constants } from 'src/app/constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-content-authoring',
  templateUrl: './content-authoring.component.html',
  styleUrls: ['./content-authoring.component.css']
})
export class ContentAuthoringComponent implements OnInit {

  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  editData: any;
  tId: string = ''
  tenants: Array<any> = [];
  courses: Array<any> = [];
  courceId: string = '';
  chapters: Array<any> = [];
  constructor(private fb: UntypedFormBuilder, private CommonService: CommonService, private toastr: ToastrService,) {
    this.loadContentAuthoring();
    this.loadTenats()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      CourseId: ['', Validators.required],
      ChapterId: ['', Validators.required],
      Content: ['', Validators.required]
    })


  }
  loadTenats() {
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
  loadContentAuthoring() {
    this.activeSpinner();
    let payLoad = { TENANT_CODE: this.tId || 0 };
    this.CommonService.postCall('LoadContentAuthoring', payLoad).subscribe(
      (res: any) => {
        this.table = [];
        setTimeout(() => { this.table = res }, 10)
        this.deactivateSpinner();
      }, err => {
        this.deactivateSpinner();
      }
    )
  }

  setDefault() {
    this.myForm.reset();
    this.courses = [];
    this.courceId = '';
    this.chapters = [];
    this.isEdit = false;
    let ctrl = this.myForm.controls;
    ctrl['ChapterId'].setValue('')

  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  change() { this.loadContentAuthoring() }
  add() {
    this.getCourses()
  }
  edit(item) {
    this.isEdit = true;
    this.activeSpinner();
    this.CommonService.postCall('EditContentAuthoring', { ContentId: item['ContentId'] }).subscribe(
      (res: any) => {
        this.deactivateSpinner()
        if (res.length) {
          this.editData = res[0];
          this.dataTransfer();
        }else{
          this.editData = res||{}
          this.dataTransfer();
        }
      }, e => {
        this.deactivateSpinner()
      }
    )


  }
  dataTransfer() {
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map(formControlname => {
      let control: AbstractControl = ctrls[formControlname];
      control.setValue(this.editData[formControlname])
    })
    ctrls['Content'].setValue(this.editData['CourseContents'])
    this.getCourses();
    this.courseChange();
  }
  delete(item) {
    let r = confirm('Are you sure, you want to delete record?');
    if (r) {
      this.activeSpinner();
      this.CommonService.postCall('RemoveContentAuthoring', { ContentId: item.ContentId }).subscribe(
        (res) => {
          this.toastr.success('Information deleted successfully');
          this.deactivateSpinner();
          this.loadContentAuthoring();
        },
        err => {
          this.toastr.error(err.error ? err.error : 'error occured ');
          this.deactivateSpinner()
        }
      )
    }
  }
  close() {
   this.setDefault()
  }
  onSubmit(form: UntypedFormGroup) {
    let payLoad = Object.assign({}, form.value);
    payLoad['TENANT_CODE'] = this.tId;
    payLoad['CREATEDBY'] = sessionStorage.getItem('UserId')
    this.activeSpinner();
    if (this.isEdit) {
      payLoad['ContentId'] = this.editData['ContentId']
      this.CommonService.postCall('ModifyContentAuthoring', payLoad).subscribe(
        (res: any) => {
          this.loadContentAuthoring();
          document.getElementById('md_close').click();
          this.deactivateSpinner();
          this.toastr.success('Information Updated Successfully ')
        }, err => {
          this.deactivateSpinner();
          this.toastr.error(err.error ? err.error : 'Not updated')
        }

      )
    } else {
      this.CommonService.postCall('AddContentAuthoring', payLoad).subscribe(
        (res: any) => {
          console.log(res)
          this.loadContentAuthoring();
          document.getElementById('md_close').click();
          this.deactivateSpinner();
          this.toastr.success('Information saved successfully')
        }, err => {
          this.deactivateSpinner();
          this.toastr.error(err.error ? err.error : 'Not Created')
        }
      )
    }

  }
  courseChange() {
    let payload = {
      "CHAPTER_COURSE_ID": this.courceId,
    }
    this.CommonService.postCall('GetChaptersByCourseId', payload).subscribe((res: any) => {
      this.chapters = res;

    }, err => { this.chapters = []; })

  }
  getCourses() {
    this.activeSpinner();
    let apiUrl=constants['GetAdminCourses']||'GetAdminCourses'
    let uri = apiUrl+'/' + sessionStorage.getItem('UserId');
    // let uri = 'GetAdminCourses/' + sessionStorage.getItem('UserId');
    let id = sessionStorage.RoleId
    let code = this.tId
    let url = uri + '/' + id + '/' + code;
    this.CommonService.getCall(url).subscribe(
      (res: any) => {
        this.courses = res;
        this.deactivateSpinner()
      }, e => {
        console.log(e);
        this.deactivateSpinner()
      }
    )
  }

}
