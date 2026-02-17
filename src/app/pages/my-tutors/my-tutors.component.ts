import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
//import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-tutors',
  templateUrl: './my-tutors.component.html',
  styleUrls: ['./my-tutors.component.css']
})
export class MyTutorsComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  myCourseList: Array<any> = [];
  private readonly onDestroy = new Subscription();

  constructor(CommonService: CommonService, toastr: ToastrService, private router: Router,) {
    super(CommonService, toastr);
    this.getCourses();
  }

  ngOnInit(): void {
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    const { UserId, company_id } = sessionStorage;

    this.myCourseList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('CourseSchedule/GetMyCourses/', `${UserId}/${company_id}`).subscribe((res: any) => {
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

  tutorsProfile(item: any) {
    if (item) {
      const newURL: string = `${location.origin}/eRP/view-profile?userId=${item.TNT_USERID}&tenantId=${item.TNT_CODE}`;
      const el: HTMLAnchorElement = document.getElementById("openProfile") as HTMLAnchorElement;
      el.href = newURL;
      //this.router.navigate([`/eRP/view-profile?userId=${item.TNT_USERID}&tenantId=${item.TNT_CODE}`]);
      el.click();
    }
  }


}
