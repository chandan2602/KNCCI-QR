import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-assign-materials',
  templateUrl: './assign-materials.component.html',
  styleUrls: ['./assign-materials.component.css']
})
export class AssignMaterialsComponent implements OnInit {
  courses: Array<any> = [];
  courceId: string = '';
  shedules: Array<any> = []
  sheduleId: string = '';
  chapters: Array<any> = [];
  chapterId: string = '';
  table: Array<any> = [];
  table1: Array<any> = [];
  dataObj: any = {};
  private readonly onDestroy = new Subscription();
  constructor(private CommonService: CommonService, private toastr: ToastrService) {
    this.getCourses();
  }

  ngOnInit(): void {
  }

  get enableRight() {
    let filter = this.table.filter((item) => { return item.class });
    let check = filter.length || false;
    return !check
  }
  get enableLeft() {
    let filter = this.table1.filter((item) => { return item.class });
    let check = filter.length || false;
    return !check
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }

  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
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
      // this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    // this.dtTrigger.unsubscribe();
  }

  courseChange() {
    this.chapters = [];
    this.clear();
    this.sheduleId = '';
    let data = {
      "CourseId": this.courceId
    }
    this.activeSpinner()
    this.CommonService.getAdminCourseSchedule(data).subscribe((res: any) => {
      this.deactivateSpinner()
      this.shedules = res;
    }, e => { this.deactivateSpinner() })
  }

  sheduleChange() {
    this.clear()
    this.activeSpinner();
    let payLoad = {
      CHAPTER_CS_ID: this.sheduleId
    }
    this.CommonService.postCall('LoadChaptersByCourseSchedule', payLoad).subscribe((res: any) => {
      this.chapters = res;
      this.deactivateSpinner();
    }, err => { this.chapters = []; this.deactivateSpinner() })
  }

  chapterChange() {
    this.activeSpinner();
    let payLoad = {
      CHAPTER_COURSE_ID: this.courceId,
      CHAPTER_ID: this.chapterId,
      CourseScheduleId: this.sheduleId
    }
    this.CommonService.postCall('LoadMaterialsByChapter', payLoad).subscribe((res: any) => {
      // this.chapters=res;
      this.table = res.Table || [];
      this.table1 = res.Table1 || [];
      let check = res.Table2 && res.Table2.length;
      this.dataObj = check ? res.Table2[0] : { Type: 1 };
      if (this.dataObj.Type) {
        // this.dataObj.Type = this.dataObj.Type.toString()
      }
      this.deactivateSpinner();
    }, err => {
      this.clear()
      this.deactivateSpinner()
    })
  }
  clearAll() {
    this.chapterId = ''
    this.table1 = [];
    this.table = [];
    this.dataObj = { Type: 1 };
    // this.courses=[];
    this.shedules = [];
    this.chapters = [];
    this.courceId = '';
    this.sheduleId = ''
  }

  clear() {
    this.chapterId = ''
    this.table1 = [];
    this.table = [];
    this.dataObj = { Type: 1 }
  }

  checkRight(event: any, item: any, array: Array<any>) {
    if (event.ctrlKey) {
      item.class = item.class ? '' : 'item_checked'
    }
    else {
      array.map(item => {
        item.class = ''
      });
      item.class = 'item_checked'
    }
  }
  shiftLeft() {
    let filter = this.table1.filter((item) => { return item.class });
    this.table = this.table.concat(filter);
    filter.map(item => {
      let index = this.table1.findIndex(x => x.MATERIAL_ID == item.MATERIAL_ID);
      this.table1.splice(index, 1)
    })

    this.table.map(item => {
      item.class = ''
    });
  }
  shiftRight() {
    let filter = this.table.filter((item) => { return item.class });
    this.table1 = this.table1.concat(filter);
    filter.map(item => {
      let index = this.table.findIndex(x => x.MATERIAL_ID == item.MATERIAL_ID);
      this.table.splice(index, 1)
    })

    this.table1.map(item => {
      item.class = ''
    });
  }
  shiftAllLeft() {
    this.table = this.table.concat(this.table1);
    this.table1 = []
  }
  shiftAllRight() {
    this.table1 = this.table1.concat(this.table);
    this.table = []
  }

  submit() {
    if (this.courceId && this.sheduleId && this.chapterId) {
      // if (!this.dataObj.Type) { this.toastr.warning(" Please select Eligible Criteria"); return }
      // else {
      //   if (this.dataObj.Type == "1" && !this.dataObj.Value) { this.toastr.warning("Please provide time duration"); return }
      // }

      if (!this.table1.length) { this.toastr.warning("Please assign at least one material to chapter."); return }
      let material = this.table1.map(e => e.MATERIAL_ID).join(',')
      this.activeSpinner();
      let payload = {
        "CourseId": this.courceId,
        "CourseScheduleId": this.sheduleId,
        "ChapterId": this.chapterId,
        // "EligibleCriteriaId": parseInt(this.dataObj.Type),
        // "Duration": this.dataObj.Value,
        "CREATEDBY": sessionStorage.getItem('UserId'),
        "MaterialIds": material
      }
      this.CommonService.postCall('SaveConfigureMaterial', payload).subscribe((res) => {
        this.toastr.success("Information saved successfully.");
        this.deactivateSpinner()
        this.clearAll()
      }, err => { this.toastr.error('error'), this.deactivateSpinner() })
    }
    else {
      this.toastr.warning("Please Enter mandatory fields")
    }
  }

  postAssessmentCheck() {
    if (!this.chapterId) { this.toastr.warning('Please Enter the mandatory fileds'); return }
    let payLoad = {
      CHAPTER_ID: this.chapterId,
      // EligibleCriteriaId:parseInt(this.dataObj.Type)
    }
    this.CommonService.postCall('PostAssessmentCheck', payLoad).subscribe((res) => {
      if (!res.length) {
        this.toastr.warning('Assessment not available for this chapter. First create Post assessment for this chapter.')
      }
    })
  }
}
