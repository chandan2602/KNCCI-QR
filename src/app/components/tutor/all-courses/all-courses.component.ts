import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICourse } from './../../shared/models/course';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare const TestMonials_owlCarousel: any;
declare const MainSlider_owlCarousel: any;
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
// import { dataDictionary } from '../../../app/dataDictionary';
import { CommonService, DateFrmts } from '../../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';
import { constants } from '../../../constants';
@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.css']
})
export class AllCoursesComponent extends BaseComponent implements OnInit {

  @Input() achivementsList: Array<{ count: number, usertype: string }> = [];
  googleURL: SafeResourceUrl; jobSearchType = 'job'; intrmcompany_id: any = 0;

  @Input() courseList: Array<ICourse> = [];
  @Input() isShowCourseSch: boolean = false;
  @Input() categoryList: Array<ICourse> = [];
  @Input() isShowAll: boolean = false;
  @Output() categoryEvent = new EventEmitter<number>();
  @Output() iscourseSche = new EventEmitter<boolean>();
  isShowCourseSche: boolean = false;  
  fileUrl: any = environment.urlFiles;
  @Output() toggleEvent = new EventEmitter<boolean>();
  testMonialsList: Array<TMonials> = [];
  mainSliderList: Array<MSlider> = []

  allDropDwns: any = ''; listGrid: any[] = []; job_title: any = ''; job_category_id: any = 0; county_id: any = 0; 
  job_type_ids: any = ''; jobTypeLst: any[] = []; companyList: any[] = []; company_id: any = 0; isSalary = 0;
  job_salary_from: number = 0; job_salary_to: number = 0;

  constructor(private route: Router,
    private sanitizer: DomSanitizer, CommonService: CommonService, public fb: FormBuilder, 
    public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.getTestMonials();
    this.getMainSlider();
   }

  ngOnInit(): void {
    TestMonials_owlCarousel();
    MainSlider_owlCarousel()
    console.log('isShowAll:=', this.isShowAll);

    let url: string = "";
    if (location.origin.includes("localhost"))
      url = "https://shiksion.com/tutormaps/";
    else
      url = `${location.origin}/tutormaps/`;
    this.googleURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.AllDropDowns(), this.getCompanyList(), this.LoadGrid();
  }

  // Web Functionality
  AllDropDowns() { // http://localhost:56608/api/Registration/GetJobMasterList/KENYA
    this.jobTypeLst = [];
    this.CommonService.getCall(`Registration/GetJobMasterList/KENYA`, '', false).subscribe(
      (res: any) => {
        this.allDropDwns = res?.data;

        this.jobTypeLst = this.allDropDwns?.jobtype.map( e => ({ ...e, isSts: false}))
   })
  }

  LoadGrid(ctrl='') { // InternshipJobs/HomePageGetList
    // let job_salary_from: number = 0, job_salary_to: number = 0;
    this.CommonService.activateSpinner();
    let job_Type = this.jobTypeLst.filter(item => item.isSts == true).map(item => item.id).join(',');
    ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
    let payLoad: any = { job_title: this.job_title, job_category_id: this.job_category_id, 
      county_id: this.county_id, job_type_ids: job_Type, shift_id: 0, company_id: this.company_id, 
      job_salary_from: this.job_salary_from, job_salary_to: this.job_salary_to }
    this.CommonService.postCall('InternshipJobs/HomePageGetList', payLoad).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data, ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job relatd record not getting');
        // window.history.back()
      })
  }

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
      // console.log(this.companyList);
    })
  }

  getAllCourseCategory(ctrl = '') {
    ctrl == '' ? this.isShowCourseSche = false : this.isShowCourseSche = true;
    this.CommonService.getCall(`${constants.GetAllCoursesByCategoryId}`, `/0/${+this.intrmcompany_id}`).subscribe((res: any) => {
      let allCourseList: any = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
          count: 120,
          discount: 500
        }));
        this.courseList = allCourseList;

        if(this.courseList.length == 0) {
          this.toastr.info('No records Found');
        }
      this.isShowCourseSche = true;
    })
  }

  // Web Functionality


  // Start UI Related

  getCount(usertype: string): number {
    const count: number = this.achivementsList.find(e => e.usertype == usertype)?.count || 0;
    return count;
  }

  //[routerLink] ="['/view-course-details']"
  gotoCourseDetail(evnt: any) {
      let params = {rowData: evnt}
    if (sessionStorage.UserId)
        this.route.navigate(['view-course-details'], { state: evnt });
      else
      this.route.navigate(['eRP/view-course-details'], { state: evnt });
    
  }
  
  jobDetails(evnt: any) {
    let params = evnt
    this.router.navigate(['jobSummery'], { queryParams: params })
  }

  onCategoryChanged(categoryId: number) {
    this.toggleEvent.emit(true);
    sessionStorage.setItem('isShowCourseSche', `true`)
    this.categoryEvent.emit(categoryId);
    this.isShowCourseSche = true;
  }

  backToCompanies() {
    this.categoryEvent.emit(0);
    this.iscourseSche.emit(false);
    this.isShowCourseSche = false;
    this.toggleEvent.emit(false);
    sessionStorage.setItem('isShowCourseSche', `false`)

  }

  calculateDuration(startDate: string, endDate: string): number {
    if (!startDate || !endDate) {
      return 0; // Return 0 if dates are invalid or null
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0; // Return 0 if date conversion fails
    }

    const diffInMs = end.getTime() - start.getTime(); // Difference in milliseconds
    const weeks = Math.ceil(diffInMs / (1000 * 60 * 60 * 24 * 7)); // Convert to weeks

    return weeks;
  }

  getTestMonials() {
    const monials: Array<TMonials> = [
      {
        id: 1,
        name: 'What did they say',
        image: '../../../../assets/img/aboutus-img.png',
        description: 'Higher education in the era of the industrial revolution 4.0 requires break through learning using digital platforms that answer the challenges of millennial students to study anywhere, anytime and with leading-edge ICT technology. From student recruitment to teaching and learning administration processes,',
        name1: 'Brain Patton',
        designation: '',
      },
      {
        id: 2,
        name: 'What did they say',
        image: '../../../../assets/img/about-img.png',
        description: 'Learning is all about how far your imagination can go and that can only happen when there is variety in learning. OUK helps in providing learning in all domains for students, teachers and professionals for self growth and development',
        name1: 'Aravind Manjrekar',
        designation: 'Designer at Saleforce',
      },
      // {
      //   id: 3,
      //   name: 'What did they say',
      //   image: '../../../../assets/img/aboutus-img.png',
      //   description: 'Higher education in the era of the industrial revolution 4.0 requires break through learning using digital platforms that answer the challenges of millennial students to study anywhere, anytime and with leading-edge ICT technology. From student recruitment to teaching and learning administration processes,',
      //   name1: 'Brain Patton',
      // },
      // {
      //   id: 4,
      //   name: 'What did they say',
      //   image: '../../../../assets/img/about-img.png',
      //   description: 'Higher education in the era of the industrial revolution 4.0 requires break through learning using digital platforms that answer the challenges of millennial students to study anywhere, anytime and with leading-edge ICT technology. From student recruitment to teaching and learning administration processes,',
      //   name1: 'Brain Patton',
      // },
    ];
    this.testMonialsList = monials;
  }

  getMainSlider() {
    const sliders: Array<MSlider> = [
      {
        id: 1,
        image: 'assets/img/banner_img/banner1.png',
        name: 'Want to discover your <br>inherent passion for<br> teaching?',
        description: 'Enroll as a trainer now, it costs just a click.',
        name1: 'Explore Path',
      },
      {
        id: 2,
        image: 'assets/img/banner_img/banner2.png',
        name: 'Your desire to learn? <br>Consider it fulfilled!',
        description: 'Bulid yourself for a better tomorrow',
        name1: 'Explore Path',
      },
      {
        id: 3,
        image: 'assets/img/banner_img/banner3.png',
        name: 'Bulid yourself for a<br> better tomorrow',
        description: 'Tailored tutoring for all your learning needs.',
        name1: 'Explore Path',
      },
      {
        id: 4,
        image: 'assets/img/banner_img/banner4.png',
        name: 'Learn continually,<br>there&apos;s always<br>&ldquo;One more thing&rdquo;<br>to learn -Steve Jobs',
        description: 'Start now, register and explore for free',
        name1: 'Explore Path',
      },
    ];
    this.mainSliderList = sliders
  }

  // UI Related End

}
interface TMonials {
  id: number;
  name: string;
  image: string;
  description: string;
  name1: string;
  designation: string;
}
interface MSlider {
  id: number;
  image: string;
  name: string;
  description: string;
  name1: string;
}