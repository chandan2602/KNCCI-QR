import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  myCourseList: Array<any> = [];
  UserId = sessionStorage.UserId;
  company_id = sessionStorage.company_id;
  InstallmentList: Array<any> = [];
  showInstallmentModel: boolean = false;
  // COURSESHD_ID:any;
  private readonly onDestroy = new Subscription();

  constructor(CommonService: CommonService, toastr: ToastrService, private route: Router,) {
    super(CommonService, toastr);
    this.getCourses();
  }

  ngOnInit(): void {
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {

    this.myCourseList = [];
    this.enableOrDisabledSpinner();
    // const ob1$ = this.CommonService.getCall('CourseSchedule/GetMyCourses/', `${this.UserId}/${this.company_id}/${sessionStorage.getItem('RoleId') == '3' ? true : false}`).subscribe((res: any) => {
    const ob1$ = this.CommonService.getCall('CourseSchedule/GetMyCoursesList/', `${this.UserId}/${this.company_id}/${sessionStorage.getItem('RoleId') == '3' ? true : false}`).subscribe((res: any) => {
      this.myCourseList = res.dtCourseScehdule;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

  isCheck(COURSESHD_STARTDATE: any): boolean {
    var time = (new Date().getTime()) - (new Date(COURSESHD_STARTDATE.split('T')[0]).getTime());
    var Difference_In_Days = Math.floor(time / (1000 * 3600 * 24));
    if (Difference_In_Days < 7) {
      return false;
    } else {
      return true;
    }
  }


  refund(COURSESHD_STARTDATE: string) {
    var time = (new Date().getTime()) - (new Date(COURSESHD_STARTDATE.split('T')[0]).getTime());
    var Difference_In_Days = Math.floor(time / (1000 * 3600 * 24));
    if (Difference_In_Days < 7) {
      if (confirm(`Are you sure do you want to refund the amount ? `)) {
        this.toastr.success('Refund request sent successfully');
      }
    }
  }

  close() {
    document.getElementById('md_close').click();
  }

  displayModel() {
    setTimeout(() => (<HTMLInputElement>document.getElementById('btnShowModel')).click(), 10);
  }

  showInvoice(COURSESHD_ID: any) {
    const { UserId, TenantCode } = sessionStorage;
    const queryString = btoa(`${UserId}/${TenantCode}/${COURSESHD_ID}`);
    // this.myCourseList = [];

    // this.CommonService.getCall(`CourseSchedule/Invoice/${UserId}/${TenantCode}/${item.COURSESHD_ID}`).subscribe((res: any) => {

    // })

    // this.route.navigate([`/invoice?data=${queryString}`]);
    this.route.navigate(['/invoice'], { queryParams: { invoiceId: queryString } });
  





  }

}
