import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-student-cgpa',
  templateUrl: './student-cgpa.component.html',
  styleUrls: ['./student-cgpa.component.css']
})
export class StudentCgpaComponent extends BaseComponent implements OnInit {
  studentId: string = '';
  user: Array<any> = []
  users: any;
  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    if (this.isStudent) {
      this.loadData();
    } else {
      this.getCourses();

    }
  }
  get isStudent(): boolean {
    return this.userId == '3' ? true : false;
  }


  ngOnInit(): void {
    this.loadReportDtOptions();
  }
  loadData() {
    const payload = {
      TENANT_CODE: this.TenantCode,
      USER_ID: this.studentId || this.userId
    }

    let callback: Function = () => {
      let total = 0;
      let totalcredits = 0;
      if (!this.table.length) return
      this.table.map((item) => {
        total = total + item.TOTAL_SCORE;
        totalcredits = totalcredits + item.CREDITS
      });
      let obj = {
        SGPA_TOTAL: total / totalcredits,
        CREDITS: totalcredits
      }
      this.table.push(obj)
    }
    this.getGridData('Reports/CGPA_StudentReport', payload, callback)
  }
  schedulChange() {
    let data = { COURSESHD_ID: this.scheduleId };
    let c = (res) => { this.users = res }
    this.post('usersbycourseShedule', data, c)

  }
  studentChange() {
    this.studentId?this.loadData():this.table=[];
  }
  courseChangein() {
    this.user = [];
    this.studentId = '';
    this.courseChange();
  }
}
