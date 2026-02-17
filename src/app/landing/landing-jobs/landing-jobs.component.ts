import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { constants } from 'src/app/constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-jobs',
  templateUrl: './landing-jobs.component.html',
  styleUrls: ['./landing-jobs.component.css']
})

export class LandingJobsComponent extends BaseComponent implements OnInit {

  allDropDwns: any = ''; listGrid: any[] = []; job_title: any = ''; job_category_id: any = 0; county_id: any = 0; categoryList: any[] = [];
  job_type_ids: any = ''; jobTypeLst: any[] = []; companyList: any[] = []; company_id: any = 0; isSalary = 0; trending_courseList: any[] = [];
  jobSearchType = ''; job_salary_from: number = 0; job_salary_to: number = 0; isShowCourseSche: boolean = false; allCourseList: any[] = [];
  courseList: any[] = []; isLogin: boolean = false; isShowhide: boolean =  location.href.includes('job?type=job');
  jobPL: any = ''; startUpList: any[] = [];

  private readonly onDstry = new Subscription();

  constructor(public rtr: Router,
    private rte: ActivatedRoute,
    CommonService: CommonService,
    toastr: ToastrService) {
    super(CommonService, toastr);
    this.AllDropDowns(), this.getCompanyList(), this.getCompanyDetails();
    if (sessionStorage.getItem('jobPL') != null) {
      this.jobPL = '',
      this.jobPL = JSON.parse(<string>sessionStorage.getItem('jobPL')), sessionStorage.removeItem('jobPL')
      this.job_title = this.jobPL?.job_title,
      this.county_id = this.jobPL?.county_id, this.company_id = this.jobPL?.company_id;
      this.LoadGrid();
    } else {
      this.LoadGrid();
    }
  }

  ngOnInit(): void {
    // this.onDstry.add(this.rte.data.subscribe(response => this.getAll(response.courseData))); 
    this.LoadGridStart();   
  }

  LoadGridStart() { // api/Registration/GetMyApprovedStartUpList
    this.CommonService.activateSpinner();
    this.startUpList = [];
    this.CommonService.getCall('Registration/GetMyApprovedStartUpList', '').subscribe((res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.startUpList = res.data;
        } else {
          this.deactivateSpinner();
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Record not getting');
        // window.history.back()
      })
  }

  isShw(): boolean {
    return !location.href.includes('/default');
  }

  LoadGrid(ctrl = '') {
    this.CommonService.activateSpinner();
    let job_Type = this.jobTypeLst.filter(item => item.isSts == true).map(item => item.id).join(',');
    ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
    let payLoad: any = { job_title: this.job_title, job_category_id: this.job_category_id, 
      county_id: this.county_id, job_type_ids: job_Type, shift_id: 0, company_id: this.company_id, 
      job_salary_from: this.job_salary_from, job_salary_to: this.job_salary_to }
    this.CommonService.postCall('InternshipJobs/GetActiveJobList', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data, ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
        } else {
          this.toastr.warning(res.message);
          this.deactivateSpinner();
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
  }

  getAll(resultList: any) {

    resultList.forEach((result: any, ind: number) => {
      console.log(result);
      const assignList = {
        '0': () => {
          this.categoryList = result.data.map((e: any) => ({ id: e.COMPANY_ID, name: e.COMPANY_NAME, cmp_logo: e.cmp_logo }));
          // this.categoryList = result.map((e: any) => ({ id: e.COURSE_CATEGORY_ID, name: e.COURSE_CATEGORY_NAME }));
          this.categoryList.splice(0, 0, { id: 0, name: 'All Company Programs' });
          sessionStorage.categoryList = JSON.stringify(this.categoryList);
        },
        '1': () => {
          this.trending_courseList = result.dtCourseScehdule.map((e: any) => (
            {
              ...e,
              IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
              count: 120,
              discount: 500
            }));
        },
        '2': () => {
          this.allCourseList = result.dtCourseScehdule.map((e: any) => (
            {
              ...e,
              IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
              count: 120,
              discount: 500
            }));
          this.courseList = this.allCourseList.slice(0, 9);
          // this.courseList = this.allCourseList;
        },
      }
      assignList[ind]();
    });
  }

  getCompanyDetails() {
      sessionStorage.isDomain = false;
      const { fileUrl } = environment;
      let { hostname } = location;
      // hostname = "rfrf.shiksion.com";
      if (["localhost", "shiksion.com"].includes(hostname)) {
        this.loadCourses();
        return;
      }
  
      this.CommonService.getCall(`account/IsSubDomainExists/${hostname}`).subscribe((res: any) => {
        if (res.data == true) {
          this.CommonService.getCall(`account/GetCompanyDetails/${hostname}`).subscribe((res: any) => {
            if (res.data.length > 0) {
              sessionStorage.isDomain = true;
              sessionStorage.company_id = res.data[0].company_id;
              if (res.data[0].cerficateimage_path)
                sessionStorage.cerficateimage_path = res.data[0].cerficateimage_path;
              if (res.data[0].favicon_path)
                sessionStorage.favicon_path = res.data[0].favicon_path;
              if (res.data[0].homepageimage_path)
                sessionStorage.homepageimage_path = res.data[0].homepageimage_path;
              if (res.data[0].landingpageimage_path)
                sessionStorage.landingpageimage_path = res.data[0].landingpageimage_path;
              if (sessionStorage.favicon_path) {
                document.getElementById("appFavcon")?.setAttribute("href", `${fileUrl}${res.data[0].favicon_path}`);
              }
  
              if (sessionStorage.landingpageimage_path) {
                document.getElementById("landingpageimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.landingpageimage_path} `);
              }
              // document.getElementById("homepageimage_path")
              console.log("constructor");
              this.loadCourses();
            }
          });
        }
        else {
          this.loadCourses();
        }
  
      });
  
    }
  
    loadCourses() {
      const { company_id = 0 } = sessionStorage;
      const GetAllCoursesByTrending = this.CommonService.getCall(`${constants.GetAllCoursesByTrending}`, `/true/${+company_id}`);
      const GetAllActiveCoursesByCategoryId = this.CommonService.getCall(`${constants.GetAllActiveCoursesByCategoryId}`, `/0/${+company_id}`);
      forkJoin([GetAllCoursesByTrending, GetAllActiveCoursesByCategoryId]).subscribe(resultList => {
        resultList.forEach((result: any, ind: number) => {
          console.log(result);
          const assignList = {
  
            '0': () => {
              this.trending_courseList = result.dtCourseScehdule.map((e: any) => (
                {
                  ...e,
                  IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
                  count: 120,
                  discount: 500
                }));
            },
            '1': () => {
              this.allCourseList = result.dtCourseScehdule.map((e: any) => (
                {
                  ...e,
                  IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
                  count: 120,
                  discount: 500
                }));
              this.courseList = this.allCourseList.slice(0, 9);
              // this.courseList = this.allCourseList;
            },
          }
          assignList[ind]();
        });
      });
    }

  AllDropDowns() {
    this.jobTypeLst = [];
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;

        this.jobTypeLst = this.allDropDwns?.jobtype.map( e => ({ ...e, isSts: false}))
    })
  }

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
    })
  }

  SrchType(evnt: any) {
      sessionStorage.setItem('intrenshipPL', `${evnt?.COMPANY_ID}`)
      this.rtr.navigate(['/internship'], { queryParams: {type : 'internship'} });
  }
  
  jobDetails(evnt: any) {
    let params = evnt
    // let params = this.params
    if (this.isLogin) {
      this.rtr.navigate(['HOME/applyJob'], {  queryParams: {jobId: params.job_id} })
    } else 
      this.rtr.navigate(['/login'], { queryParams: {job_id: params.job_id} });
    // this.rtr.navigate(['jobSummery'], { queryParams: params });
  }

  ApplyNow() {
      this.rtr.navigate(['/signup'], { queryParams: {type : 'jobSeeker'}});
  }

}