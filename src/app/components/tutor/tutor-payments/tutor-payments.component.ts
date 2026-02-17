import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-tutor-payments',
  templateUrl: './tutor-payments.component.html',
  styleUrls: ['./tutor-payments.component.css']
})
export class TutorPaymentsComponent extends BaseComponent implements OnInit,OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  tutorPaymentList: Array<any> = [];
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
    const { TenantCode ,UserId ,company_id } = sessionStorage;
   

    this.tutorPaymentList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall(`CourseSchedule/GetMyStudents/${TenantCode}/${UserId}/${company_id}`).subscribe((res: any) => {
      this.tutorPaymentList = res.dtCourseScehdule;
      this.renderDataTable();
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);

  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }


}
