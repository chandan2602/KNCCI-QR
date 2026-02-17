import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-student-sgpa-report',
  templateUrl: './student-sgpa-report.component.html',
  styleUrls: ['./student-sgpa-report.component.css']
})
export class StudentSGPAReportComponent extends BaseComponent implements OnInit {
  courceYears: Array<any> = [];
  semesters: Array<any> = [];
  semId: string = '';
  yearId: string = '';

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    // this.loadData();
    this.studentCourses();
    this.loadDropdowns()
  }

  ngOnInit(): void {
    this.loadReportDtOptions();
  }
  loadData() {


  }
  loadDropdowns() {
    //  let acadamic = this.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.AcademicYear});
    let year = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.CourseYear });
    let sem = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Semester });
    let dropdowns = ['courceYears', 'semesters',]
    forkJoin([year, sem,]).subscribe((res) => {
      dropdowns.map((key, index) => {
        this[key] = res[index]
      })
      this.deactivateSpinner()

    }, err => { this.deactivateSpinner() })
  }
  submit() {
    let payload = {
      YEAR: this.yearId,
      SEMESTER: this.semId,
      TENANT_CODE: this.TenantCode,
      USER_ID: this.userId,
      COURSE_ID:this.courseId
    }
    let c = (): void => {
      if(!this.table.length) return
      let Total_Credits=this.table.reduce((a,b)=>a+b.CREDITS,0);
      let Total_Score=this.table.reduce((a,b)=>a+b.POINTS,0);
       this.table.push({CREDITS:Total_Credits,POINTS:Total_Score,SUBJECT_NAME:'TOTAL'})

     }
    this.getGridData('Reports/SGPA_StudentReport', payload, c);

  }

 
}
