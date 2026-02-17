import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { dataDictionary } from './../../dataDictionary';
import { BaseComponent } from '../base.component';
@Component({
  selector: 'app-course-report',
  templateUrl: './course-report.component.html',
  styleUrls: ['./course-report.component.css']
})
export class CourseReportComponent extends BaseComponent implements OnInit {

  courcesList: Array<any> = [];
  course_id: number = 0;
  studentLevel_id: number = 0;
  student_level_List: Array<any> = [];
  courseReportList: Array<any> = [];

  private readonly onDestroy = new Subscription();

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);

  }
  ngOnInit(): void {
    this.getCourses();
    this.getStudentLevels();
    this.getReport();
    this.loadReportDtOptions();
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    let payLoad = { TENANT_CODE: sessionStorage.TenantCode, USER_ID: sessionStorage.UserId };

    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', payLoad).subscribe((res: any) => {
      this.courcesList = res;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  getStudentLevels() {
    const ob2$ = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.ProficiencyLevel }).subscribe((res: any) => {
      this.student_level_List = res;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob2$);

  }

  getReport() {
    const { TenantCode, company_id } = sessionStorage;
    // this.courseReportList = [];
    this.loadDataTable('courseReport');
    const ob3$ = this.CommonService.getCall('Courses/CourseReport/', `${TenantCode}/${this.course_id}/${company_id}`).subscribe((res: any) => {
      let tempArr: Array<any> = res;
      if (this.studentLevel_id > 0)
        tempArr = tempArr.filter(e => e.courseshd_student_level == this.studentLevel_id);

      this.courseReportList = tempArr.map(e => ({ ...e, studentLevelName: this.student_level_List.find(s => s.DICTIONARYID == e.courseshd_student_level)?.DICTIONARYNAME || '' }));
      setTimeout(() => { this.dtTrigger.next(); }, 100);
      console.log(this.courseReportList);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob3$);
  }

  courseReportChange() {
    //   if (this.course_id == 0)
    //   this.toastr.warning("Please select a course");
    // else
    this.getReport();
  }

  loadReportDtOptions() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "excel",
          filename: 'Course Report',
        }
      ],
      order: []
    }
  }
}
