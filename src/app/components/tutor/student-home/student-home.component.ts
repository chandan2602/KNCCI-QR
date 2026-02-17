import { forkJoin, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../app/services/common.service';
import { IObject, ICourse } from './../../shared/models/course';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../../app/pages/base.component';
import { constants } from '../../../constants';
declare const sliderCoursal: any;
@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent extends BaseComponent implements OnInit {
  categoryList: Array<IObject> = [];
  courseList: Array<ICourse> = [];
  allCourseList: Array<ICourse> = [];
  trending_courseList: Array<ICourse> = [];
  imageList: Array<{ name: string, path: string }> = [];
  private readonly onDestroy = new Subscription();
  isShowCourseSch: boolean = false;

  constructor(private route: ActivatedRoute, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    sliderCoursal();
    this.loadCourses();
    this.onDestroy.add(this.route.data.subscribe(response => this.getAll(response.courseData)));
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
  }

  getAll(resultList: any) {
    resultList.forEach((result: any, ind: number) => {
      const assignList = {
        '0': () => {
          this.categoryList = result.data.map((e: any) => ({ id: e.COMPANY_ID, name: e.COMPANY_NAME, cmp_logo: e.cmp_logo }));
          // this.categoryList = result.map((e: any) => ({ id: e.COURSE_CATEGORY_ID, name: e.COURSE_CATEGORY_NAME }));
          // this.categoryList.splice(0, 0, { id: 0, name: 'All Programs' });
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

  courseChanged(COURSE_ID: number) {
    // this.courseList = this.allCourseList.filter(e => e.COURSE_ID == COURSE_ID);
    this.getCategoryWiseCourses(COURSE_ID);
    this.isShowCourseSch = true;
  }

  iscourseSche(isBool: boolean) {
    this.isShowCourseSch = isBool;
  }

  getCategoryWiseCourses(categoryId: any) {
    const { company_id } = sessionStorage;
    [this.courseList, this.allCourseList] = [[], []];
    this.enableOrDisabledSpinner();
    // const ob1$ = this.CommonService.getCall(`GetAllCoursesByCategoryId/${categoryId}/${company_id}`).subscribe((res: any) => {
    const ob1$ = this.CommonService.getCall(`${constants.GetAllCoursesByCategoryId}/${0}/${categoryId}`).subscribe((res: any) => {
      this.allCourseList = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: this.getImagePath(e.IMAGE_URL, e.COURSE_NAME),
          count: 120,
          discount: 500
        }));
      // sessionStorage.courseList = JSON.stringify(this.allCourseList);//This is required to pass data to click on Show All button.
      this.courseList = this.allCourseList.slice(0, 9);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
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