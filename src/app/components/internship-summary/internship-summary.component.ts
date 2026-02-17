import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { WindowRefService } from '../../../app/services/window-ref.service';
import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';


@Component({
  selector: 'app-internship-summary',
  templateUrl: './internship-summary.component.html',
  styleUrls: ['./internship-summary.component.css']
})
export class InternshipSummaryComponent extends BaseComponent implements OnInit {

  params: any = ''; isLogin: boolean = true; subscribeDetails: any = '';

  constructor(CommonService: CommonService, private winRef: WindowRefService, public fb: FormBuilder, public router: Router, private active: ActivatedRoute, toastr: ToastrService) {
    super(CommonService, toastr)
    // this.isLogin = +(sessionStorage.RoleId || 0) > 0;
    this.active.queryParams.subscribe((res) => {
      if (Object.keys(res).length) {
        // this.params = res?.jobDtls;
        this.GetById(res.course_id, res.inst_company_id)
      }
      if (sessionStorage.getItem('subscribeData') != null && sessionStorage.getItem('subscribeData') != 'undefined' && sessionStorage.getItem('subscribeData') != undefined ) {
        this.subscribeDetails = '',
        this.subscribeDetails = JSON.parse(<string>sessionStorage.getItem('subscribeData'));
      };
    })
  }
  ngOnInit(): void {

  }
  // https://oukinternship.dhanushinfotech.com/api/CourseSchedule/GetAllCoursesByCategoryId/0/0
  GetById(course_iD: any, inst_company_id: any) { // CourseSchedule/GetAllCoursesByCategoryId/{CATEGORY_ID}/{COMPANY_ID}
    this.CommonService.activateSpinner();
        this.CommonService.getCall(`CourseSchedule/GetAllCoursesByCategoryId/${course_iD}/${inst_company_id}`).subscribe((res: any) => {
      let xy: any = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: `${this.fileUrl}${e.COURSE_IMAGE}`,
          count: 120,
          discount: 500
        }));

        this.params = xy[0];
        this.deactivateSpinner()
    })
    // this.CommonService.getCall(`CourseSchedule/GetAllCoursesByCategoryId/${course_iD}/${inst_company_id}`, '', false).subscribe(
    //       (res: any) => {
    //     if(res?.status == true) {
    //       this.deactivateSpinner();
    //       this.params = res.data[0];
    //       // this.BindData()
    //     } else {
    //       this.toastr.warning(res.message);
    //     }
    //   },
    //   err => {
    //     this.deactivateSpinner();
    //     this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
    //     // window.history.back()
    //   })
  }

  GoToIntrnship() {
    this.router.navigate(['/HOME/sIntrnShpMnu'])
  }

}
