import { forkJoin, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../../app/services/common.service';
import { IObject, ICourse } from './../../shared/models/course';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from './../../../../app/pages/base.component';
import { environment } from './../../../../environments/environment';
import { constants } from '../../../constants';


declare const sliderCoursal: any;

@Component({
  selector: 'app-tutor-home',
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.css']
})
export class TutorHomeComponent extends BaseComponent implements OnInit, OnDestroy {

  categoryList: Array<IObject> = [];
  courseList: Array<ICourse> = [];
  allCourseList: Array<ICourse> = [];
  achivementsList: Array<{ count: number, usertype: string }> = [];
  trending_courseList: Array<ICourse> = [];
  imageList: Array<{ name: string, path: string }> = [];
  private readonly onDestroy = new Subscription();
  categoryName: string = 'All Companies';
  isShowCourseSche: any = false;
  showDetails = true;
  isDetails = true;

  constructor(private route: ActivatedRoute, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    this.getCompanyDetails();
    if (sessionStorage.getItem('isShowCourseSche') != null) {
      this.isShowCourseSche = JSON.parse(<string>sessionStorage.getItem('isShowCourseSche')), sessionStorage.removeItem('isShowCourseSche')    
    };
  }


  ngOnInit(): void {
    sliderCoursal();
    this.onDestroy.add(this.route.data.subscribe(response => this.getAll(response.courseData)));
    this.getAchivements(); 
  }

  onToggleChanged(state: boolean) {
    // this.
    console.log('Child sent:', this.isDetails);
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
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

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  categoryChanged(categoryId: number) {
    this.categoryName = (categoryId > 0) ? this.categoryList.find(e => e.id == categoryId)?.name ?? 'Corporates' : 'Corporates';
    this.getCategoryWiseCourses(categoryId);
  }

  getCategoryWiseCourses(categoryId: number) {
    const { company_id = 0 } = sessionStorage;
    [this.courseList, this.allCourseList] = [[], []];
    this.enableOrDisabledSpinner();
    // const ob1$ = this.CommonService.getCall(`${constants.GetAllCoursesByCategoryId}/${categoryId}/${company_id}`).subscribe((res: any) => {
    const ob1$ = this.CommonService.getCall(`${constants.GetAllCoursesByCategoryId}/${0}/${categoryId}`).subscribe((res: any) => {
      this.allCourseList = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
          COURSE_IMAGE: this.getImagePath(e.COURSE_IMAGE, e.COURSE_NAME),
          count: 120,
          discount: 500
        }));
      // sessionStorage.courseList = JSON.stringify(this.allCourseList);//This is required to pass data to click on Show All button.
      this.courseList = this.allCourseList.slice(0, 9);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  getAchivements() {
    this.achivementsList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('Courses/Achivements').subscribe((res: any) => {
      this.achivementsList = res;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
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
    const GetAllCoursesByCategoryId = this.CommonService.getCall(`${constants.GetAllCoursesByCategoryId}`, `/0/${+company_id}`);
    forkJoin([GetAllCoursesByTrending, GetAllCoursesByCategoryId]).subscribe(resultList => {
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

}