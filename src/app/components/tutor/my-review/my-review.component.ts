import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from 'src/app/pages/base.component';


@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.css']
})
export class MyReviewComponent extends BaseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  // myCourseList: Array<any> = [];
  private readonly onDestroy = new Subscription();
  my_review: any;
  
  constructor(CommonService: CommonService, toastr: ToastrService,) {
    super(CommonService, toastr);
    this.getCourses();
  }

  ngOnInit(): void {
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    const { TenantCode } = sessionStorage;

    // this.myCourseList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('Courses/GetCourseReviewByTutorId/', `${TenantCode}`).subscribe((res: any) => {
      this.my_review = res;
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
