import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent extends BaseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  courses: Array<any> = [];
  shedules: Array<any> = [];
  assignData: any = {};
  points: Array<any> = []
  constructor(private fb: UntypedFormBuilder, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    this.loadChapter();
    // this.dtOptions={
    //   dom: 'Bfrtip',
    //   buttons:['excel']
    // }
  }

  ngOnInit(): void {
    this.formInIt();
    this.loadChapterCourse();
  }

  formInIt() {
    this.myForm = this.fb.group({
      CHAPTER_COURSE_ID: ['', Validators.required,],
      CHAPTER_CS_ID: ['', Validators.required],
      CHAPTER_CODE: ['', Validators.required,],
      CHAPTER_NAME: ['', Validators.required],
      CHAPTER_DESCRIPTION: ['', Validators.required],
      CHAPTER_STATUS: [true, Validators.required]
    });
  }

  loadChapter() {
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall("LoadchapterGrid", payLoad).subscribe((res: any) => {
      this.table = [];
      this.table = res;
      this.renderDataTable()
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(), console.log(e) })
  }

  loadChapterCourse() {
    this.activeSpinner()
    let payLoad = {
      TENANT_CODE: sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall("LoadChapterCourse", payLoad).subscribe((res: any) => {
      this.courses = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() });
  }

  loadChapterShedule(id) {
    this.activeSpinner()
    let payLoad = {
      COURSESHD_COURSE_ID: id
    }
    this.CommonService.postCall("LoadchapterCourseSchedule", payLoad).subscribe((res: any) => {
      this.shedules = res;
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() });
  }

  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.formInIt();
    this.editData = {};
  }
  edit(data) {
    this.editData.CHAPTER_ID = data.CHAPTER_ID;
    this.isEdit = true;
    this.CommonService.postCall("EditChapters", this.editData).subscribe((res: any) => {
      if (res instanceof Array) {
        if (res.length) {
          this.editData = res[0];
          this.loadChapterShedule(this.editData.CHAPTER_COURSE_ID);
          this.dataTransFor();
        }
      }
      else {
        this.editData = res;
        this.loadChapterShedule(this.editData.CHAPTER_COURSE_ID);
        this.dataTransFor();
      }
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner() });
  }
  dataTransFor() {
    let ctrls = this.myForm.controls
    Object.keys(ctrls).map((key) => {
      let ctrl = ctrls[key];
      ctrl.setValue(this.editData[key]);
    });
  }
  onSubmit(form: UntypedFormGroup) {
    let payload = form.value;
    payload.TENANT_CODE = sessionStorage.getItem('TenantCode');
    payload.CHAPTER_CREATEDBY = this.editData.CHAPTER_CREATEDBY || sessionStorage.getItem('UserId');
    payload.CHAPTER_CREATEDDATE = this.editData.CHAPTER_CREATEDDATE || moment();
    payload.CHAPTER_MODIFIEDBY = sessionStorage.getItem('UserId');
    payload.CHAPTER_MODIFIEDDATE = moment();
    this.activeSpinner();
    if (this.isEdit) {
      payload.CHAPTER_ID = this.editData.CHAPTER_ID;
      this.CommonService.postCall("updateChapters", payload).subscribe((res: any) => {
        this.toastr.success("Chapter updated Successfully")
        this.loadChapter();
        this.deactivateSpinner();
        document.getElementById('md_close')?.click()
      }, e => { this.deactivateSpinner(); this.toastr.error('Chapter not updated') });
    } else {
      payload.CHAPTER_ID = this.editData.CHAPTER_ID;
      this.CommonService.postCall("CreateChapters", payload).subscribe((res: any) => {
        this.toastr.success("Chapter  Created Successfully")
        this.loadChapter();
        this.deactivateSpinner();
        document.getElementById('md_close')?.click()
      }, e => { this.deactivateSpinner(); this.toastr.error('Chapter not Created') });
    }


  }

  assign(data) {
    this.activeSpinner();
    this.points = [];
    this.assignData = {};
    let payload = {
      CHAPTER_ID: data.CHAPTER_ID
    }
    this.CommonService.postCall("assignPO_COViewChapters", payload).subscribe((res: any) => {

      if (res.dtab) {
        this.assignData = res.dtab
      }
      if (res.grid) {
        this.points = res.grid
      }
      this.deactivateSpinner();
    }, e => { this.deactivateSpinner(); });
  }

  createPoCo() {
    let payLoad = [];
    this.activeSpinner();
    this.points.map(item => {
      let obj: any = {
        TENANT_CODE: sessionStorage.getItem('TenantCode'),
        CHAPTER_ID: this.assignData['CHAPTER_ID'],
        CO_PO_COURSE_OBJ_ID: item['COURSE_OBJECTIVE_ID'],
        CO_PO_ID: item['CO_PO_ID'],
        CO_PO_POINTS: item['CO_PO_POINTS'],
        CO_PO_CREATED_BY: sessionStorage.getItem('UserId'),
        CO_PO_CREATED_DATE: moment(),
        CO_PO_MODIFIED_BY: sessionStorage.getItem('UserId'),
        CO_PO_MODIFIED_DATE: moment(),
        CO_PO_COURSE_ID: this.assignData.CHAPTER_COURSE_ID,
        CO_PO_COURSE_SCHEDULE_ID: this.assignData.CHAPTER_CS_ID
      }
      payLoad.push(obj)
    })
    this.CommonService.postCall('CreateCOPO', { COPOList: payLoad }).subscribe(
      (res: any) => {
        this.toastr.success('Information Saved Successfully');
        this.deactivateSpinner();
        document.getElementById('md_close1')?.click();
        this.loadChapter()
      },
      err => {
        this.toastr.error(err.Message ? err.Message : 'error occured! Please try later');
        this.deactivateSpinner();
      }
    )
  }
  changeTname() {
    this.loadChapter()
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
