import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-interns',
  templateUrl: './landing-interns.component.html',
  styleUrls: ['./landing-interns.component.css']
})

export class LandingInternsComponent extends BaseComponent implements OnInit {

  companyList: any[] = []; courseList: any[] = []; intrenshipPL: any = 0; isShowhide: boolean =  location.href.includes('internship?type=internship');
  isLogin: boolean = false;fileUrl: string = environment.fileUrl;

  constructor(public rtr: Router,
    private rte: ActivatedRoute,
    CommonService: CommonService,
    toastr: ToastrService) {
    super(CommonService, toastr);
    if (sessionStorage.getItem('intrenshipPL') != null) {
      this.intrenshipPL = '',
      this.intrenshipPL = sessionStorage.getItem('intrenshipPL'), sessionStorage.removeItem('intrenshipPL')
      this.getCourseList();
    } else {
      this.getCourseList();
    }
  }

  ngOnInit(): void {
    this.getCompanyList(); //, this.getCourseList()    
  }

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
    })
  }
  getCourseList() { // CourseSchedule/GetAllCoursesByCategoryId/0/companyId
    this.courseList = []
    this.CommonService.getCall(`CourseSchedule/GetAllActiveCoursesByCategoryId/0/${this.intrenshipPL}`).subscribe((res: any) => {
      this.courseList = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL:`${this.fileUrl}${e.COURSE_IMAGE}`,
          count: 120,
          discount: 500
        }));
    })
  }

  isShw(): boolean {
    return !location.href.includes('/default');
  }

  intrenshipDetails(evnt: any) {
    let params = evnt
    // let params = this.params
    if (this.isLogin) {
      this.rtr.navigate(['HOME/applyJob'], {  queryParams: {jobId: params.job_id} })
    } else 
      this.rtr.navigate(['/login']);
    // this.rtr.navigate(['jobSummery'], { queryParams: params });
  }

}