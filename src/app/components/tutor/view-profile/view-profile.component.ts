import { IUserDetails } from './../../shared/models/userDetails';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../app/services/common.service';
import { ICourse } from '../../shared/models/course';
import * as moment from 'moment';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  userId: number;
  tenantId: number;
  private readonly onDestroy = new Subscription();
  profileCounts = { COURSES: 0, ONLINE: 0, STUDENTS: 0, REVIEWS: 0 };
  courseList: Array<ICourse> = [];
  userDetails: IUserDetails = { userfrimages: '', rating: 0, name: '' };
  aboutMe: any = {};
  TableColumns: Array<string> = [];
  TableHeadings: Array<string> = [];
  TableData: Array<any> = [];
  EducationHeadings: Array<string> = [];
  EducationColumns: Array<string> = [];
  EducationData: Array<any> = [];
  skillHeadings: Array<string> = [];
  skillColumns: Array<string> = [];
  skillData: Array<any> = [];
  certifiHeadings: Array<string> = [];
  certifiColumns: Array<string> = [];
  certifiData: Array<any> = [];

  responseData: any = { data: '', error: '' };

  constructor(private route: ActivatedRoute, private CommonService: CommonService) { }

  ngOnInit(): void {
    this.getTutor();
    this.TableHeadings = ['Name', 'Designation', 'Duration From', 'Duration To'];
    this.TableColumns = ['EmployerName', 'Designation', 'DurationFrom', 'DurationTo'];
    this.EducationHeadings = ['Education Type', 'Education Name', 'Specialization', 'University Institute', 'Year Of Passing'];
    this.EducationColumns = ['EDUCATIONTYPE', 'EDUCATIONNAME', 'SPECIALIZATION', 'UNIVERSITYINSTITUTE', 'YEAROFPASSING'];
    this.skillHeadings = ['Skill Name', 'Software version', 'Experience(Yrs.)', 'Months'];
    this.skillColumns = ['SKILLNAME', 'VERSION', 'EXPERIANCE', 'MONTHS'];
    this.certifiHeadings = ['Course Name', 'Is Certified'];
    this.certifiColumns = ['COURSE_NAME', 'ISCERTIFIED'];
  }

  getTutor() {
    this.route.queryParamMap.subscribe(params => {
      [this.userId, this.tenantId] = [+params.get('userId') || 0, +params.get('tenantId') || 0];
      console.log(params, this.userId);
      if (this.userId > 0 && this.tenantId > 0)
        Promise.all([this.getProfileCounts(), this.GetUserProfileDetails(), this.GetAllCourses(), this.getProfileInfo(), this.getCertificate()]);
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
  }

  async GetUserProfileDetails() {
    this.enableOrDisabledSpinner();
    const ob1$ = await this.CommonService.getCall('Account/GetUserProfileDetails', `/${this.userId}`).subscribe((res: any) => {
      this.userDetails = res[0];
      console.log(this.userDetails);
      if (this.userDetails.userfrimages) {
        let { origin } = location;
        if (origin.includes("localhost"))
          origin = "http://shiksion.com/";
        else
          origin += "/";
        this.userDetails.userfrimages = `${origin}${this.userDetails.userfrimages}`;
      }
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  async getProfileInfo() {
    [this.TableData, this.EducationData, this.skillData] = [[], [], [], []];
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.getCall('Registration/GetUserProfileDetails', `/${this.userId}`).subscribe((res: any) => {
      [this.aboutMe, this.EducationData, this.skillData] = [res.Personal[0], res.Education, res.Skills];
      this.TableData = res.WorkExperience.map(data => ({ ...data, DurationFrom: this.changeDateTime(data.DurationFrom), DurationTo: this.changeDateTime(data.DurationTo) }));

      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  async GetAllCourses() {
    const { company_id = 0 } = sessionStorage;
    this.courseList = [];
    this.enableOrDisabledSpinner();
    const ob1$ = await this.CommonService.getCall(`CourseSchedule/GetAllCoursesByUserId/${this.userId}/${+company_id}`).subscribe((res: any) => {
      this.courseList = res.dtCourseScehdule;
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  async getProfileCounts() {
    this.enableOrDisabledSpinner();
    const ob1$ = await this.CommonService.getCall('Courses/TutorProfileCounts', `/${this.tenantId}`).subscribe((res: any) => {
      this.profileCounts.COURSES = res.find(e => e.heading == 'COURSES')?.counts || 0;
      this.profileCounts.ONLINE = res.find(e => e.heading == 'ONLINE')?.counts || 0;
      this.profileCounts.STUDENTS = res.find(e => e.heading == 'STUDENTS')?.counts || 0;
      this.profileCounts.REVIEWS = res.find(e => e.heading == 'REVIEWS')?.counts || 0;
      //Object.keys(newObj).forEach(key => key in oldObj? result[key] = newObj[key] : null);
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  assignCount(arr: Array<any>) {
    let obj = {};
    arr.forEach(e => {
      obj = { ...obj, [e.heading]: e.counts };
    });
    return obj;
  }
  changeDateTime(propertyVal: string, isDateFormat: boolean = true): string {
    return moment(propertyVal).format(isDateFormat ? 'DD-MM-yyyy' : 'HH:mm:ss');
  }

  getCertificate() {
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', { TENANT_CODE: this.tenantId, USER_ID: sessionStorage.UserId }).subscribe((res: any) => {
      this.certifiData = res.map(e => ({ ...e, ISCERTIFIED: e.ISCERTIFIED ? 'Certified Trainer' : 'Uncertified Trainer' }));
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  GetAPI(url: string, payload: any, isPost: boolean = false) {
    this.enableOrDisabledSpinner();
    const ob1$ = this.CommonService.postCall('Courses/GetList', { TENANT_CODE: this.tenantId });
    this.onDestroy.add(ob1$.subscribe((res: any) => {
      this.certifiData = res.map(e => ({ ...e, ISCERTIFIED: e.ISCERTIFIED ? 'Certified Trainer' : 'Uncertified Trainer' }));
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); }));
  }
}