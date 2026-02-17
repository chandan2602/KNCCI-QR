import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-enrolled-students',
  templateUrl: './enrolled-students.component.html',
  styleUrls: ['./enrolled-students.component.css']
})
export class EnrolledStudentsComponent extends BaseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  myEnrolledList: Array<any> = [];
  private readonly onDestroy = new Subscription();
  constructor(CommonService: CommonService, toastr: ToastrService,) {
    super(CommonService, toastr);
    this.getEnrolledList();
  }

  ngOnInit(): void {
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getEnrolledList() {
    const { TenantCode,UserId,company_id } = sessionStorage;

    this.myEnrolledList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall(`CourseSchedule/GetMyStudents/${TenantCode}/${UserId}/${company_id}`).subscribe((res: any) => {
      this.myEnrolledList = res.dtCourseScehdule;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

}
