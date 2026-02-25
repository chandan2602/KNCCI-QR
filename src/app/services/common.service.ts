import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { environment } from './../../environments/environment'
import { constants } from '../constants'
import { BehaviorSubject } from "rxjs";
import { DatePipe } from '@angular/common';
const url = environment.serviceUrl
const internUrl = environment.internUrl;
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  assessment: any = {}
  userId = sessionStorage.getItem('UserId');
  appComponent: AppComponent;
  spinnerCount: number = 0;
  fileUrl: string = environment.fileUrl;
  public fileObs: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  public userImage: BehaviorSubject<any> = new BehaviorSubject<any>(['', 'data:,', 'null', null].includes(sessionStorage.profileImage) ? "https://i.pinimg.com/736x/89/90/48/899048ab0cc455154006fdb9676964b3.jpg" : sessionStorage.profileImage);
  samvaadUrl: string = environment.SamvaadUrl;
  paystatus: boolean;
  totalAmount: any;
  constructor(public http: HttpClient, public dtPipe: DatePipe,) { }


  /////////////////////////////////////spinner/////////////////////////////////////////
  activateSpinner() {
    this.spinnerCount++;
    if (this.spinnerCount == 1) {
      this.appComponent.activateSpinner()

    }
  }

  deactivateSpinner() {
    if (!this.spinnerCount) return
    this.spinnerCount--
    if (!this.spinnerCount) this.appComponent.deactivateSpinner();
    if (this.spinnerCount < 0) {
      this.spinnerCount = 0;
      this.appComponent.deactivateSpinner()
    }

  }

  /////////////////////////////////////spinner///////////////////////////////////////

  ///////////////////////////////////post,put and get //////////////////////////////////
  postCall(route, data, isSamvaadURL: boolean = false): Observable<any> {
    let apiUrl = constants[route] || route
    let uri = isSamvaadURL ? this.samvaadUrl + apiUrl : url + apiUrl;
    return this.http.post<any>(uri, data)
  }

  postCallIntern(route, data): Observable<any> {
    let apiUrl = constants[route] || route
    let uri = internUrl + apiUrl;
    return this.http.post<any>(uri, data)
  }



  getEditorData(arg0: string, payload: { TENANT_CODE: number; }) {
    let apiUrl = constants[arg0] || arg0
    let finalUrl = url + apiUrl;
    console.log(apiUrl)
    return this.http.post(finalUrl, payload);
  }

  reportAPi(data): Observable<any> {
    // let apiUrl = constants[route] || route
    let url = environment.reportUrl;
    return this.http.post<any>(url, data)
  }

  getCall(route, params: string = '', isSamvaadURL: boolean = false): Observable<any> {
    let apiUrl = constants[route] || route
    let uri = isSamvaadURL ? this.samvaadUrl + apiUrl + params : url + apiUrl + params;
    return this.http.get(uri)
  }
  getCallWithId(route, id): Observable<any> {
    let apiUrl = constants[route] || route
    let uri = url + apiUrl;
    return this.http.get(uri + '/' + id)
  }
  putCall(route, data): Observable<any> {
    let apiUrl = constants[route] || route
    let uri = url + apiUrl;
    return this.http.put<any>(uri, data)
  }

  getCallWithParams(route, data) {
    let apiUrl = constants[route] || route
    let uri = url + apiUrl;
    return this.http.get(uri, { params: data })
  }
  deleteCall(route, data): Observable<any> {
    let apiUrl = constants[route] || route
    let uri = url + apiUrl;
    return this.http.delete<any>(uri, { params: data })
  }

  samvaadPost(url, payLoad) {
    let uri = this.samvaadUrl + url;
    return this.http.post(uri, payLoad, { headers: this.getSamvaadHeaders() })
  }
  samvaadGet(url) {
    let uri = this.samvaadUrl + url;
    return this.http.get(uri, { headers: this.getSamvaadHeaders() })
  }
  ///////////////////////////////////post,put and get //////////////////////////////////


  getCourseSchedule(data) {
    data.UserId = this.userId;
    data.RoleId = sessionStorage.RoleId
    let apiUrl = constants['GetCourseSchedule'] || 'GetCourseSchedule'
    let uri = url + apiUrl
    return this.http.post(uri, data)

  }

  getCourses() {
    let apiUrl = constants['GetCourses'] || 'GetCourses'
    let uri = url + apiUrl + '/' + this.userId;
    let id = sessionStorage.RoleId
    return this.http.get(uri + '/' + id)
  }

  // Get all courses list from API
  getCoursesList() {
    // For localhost testing - uncomment the line below and comment the server line
    let coursesApiUrl = 'http://127.0.0.1:8000/api/courses/list';
    
    // For server - uncomment the line below and comment the localhost line
    // let coursesApiUrl = url + 'courses/list';
    
    return this.http.get(coursesApiUrl)
  }

  // Add new course (Admin) - POST /api/courses/create
  addCourse(data: any) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/courses/create';
    
    // For server
    // let uri = url + 'courses/create';
    
    return this.http.post(uri, data)
  }

  // Update course (Admin)
  updateCourse(data: any) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/courses/update';
    
    // For server
    // let uri = url + 'courses/update';
    
    return this.http.put(uri, data)
  }

  // Get course applications for approval (Super Admin)
  getCourseApplications() {
    // Use the existing /api/courses/list endpoint
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/courses/list';
    
    // For server
    // let uri = url + 'courses/list';
    
    return this.http.get(uri)
  }

  // Approve/Reject course (Super Admin)
  approveCourse(courseId: number, data: any) {
    // Use the existing /api/courses/update/{course_id} endpoint
    // For localhost testing
    let uri = `http://127.0.0.1:8000/api/courses/update/${courseId}`;
    
    // For server
    // let uri = url + `courses/update/${courseId}`;
    
    return this.http.put(uri, data)
  }

  // ==================== APPRENTICESHIPS API METHODS ====================

  // Get all apprenticeships list from API
  getApprenticeshipsList() {
    // For localhost testing - uncomment the line below and comment the server line
    let apprenticeshipsApiUrl = 'http://127.0.0.1:8000/api/apprenticeships/list';
    
    // For server - uncomment the line below and comment the localhost line
    // let apprenticeshipsApiUrl = url + 'apprenticeships/list';
    
    return this.http.get(apprenticeshipsApiUrl).pipe(
      map((res: any) => {
        if (res?.status === true && res?.data) {
          // Keep the original API response structure
          return res;
        }
        return res;
      })
    );
  }

  getStudentApprenticeships(studentName: string) {
    // For localhost testing - uncomment the line below and comment the server line
    let studentApprenticeshipsApiUrl = `http://127.0.0.1:8000/api/apprenticeships/student/${studentName}`;
    
    // For server - uncomment the line below and comment the localhost line
    // let studentApprenticeshipsApiUrl = url + `apprenticeships/student/${studentName}`;
    
    return this.http.get(studentApprenticeshipsApiUrl).pipe(
      map((res: any) => {
        if (res?.status === true && res?.data) {
          // Keep the original API response structure
          return res;
        }
        return res;
      })
    );
  }

  createApprenticeshipSchedule(payload: any) {
    // For localhost testing - uncomment the line below and comment the server line
    let createScheduleApiUrl = 'http://127.0.0.1:8000/api/apprenticeship-schedule/create';
    
    // For server - uncomment the line below and comment the localhost line
    // let createScheduleApiUrl = url + 'apprenticeship-schedule/create';
    
    return this.http.post(createScheduleApiUrl, payload).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Add new apprenticeship (Admin) - POST /api/apprenticeships/create
  addApprenticeship(data: any) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeships/create';
    
    // For server
    // let uri = url + 'apprenticeships/create';
    
    return this.http.post(uri, data)
  }

  // Update apprenticeship (Admin)
  updateApprenticeship(data: any) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeships/update';
    
    // For server
    // let uri = url + 'apprenticeships/update';
    
    return this.http.put(uri, data)
  }

  // Get single apprenticeship by ID
  getApprenticeshipById(id: number) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeships/' + id;
    
    // For server
    // let uri = url + 'apprenticeships/' + id;
    
    return this.http.get(uri)
  }

  // Delete apprenticeship
  deleteApprenticeship(id: number) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeships/delete/' + id;
    
    // For server
    // let uri = url + 'apprenticeships/delete/' + id;
    
    return this.http.delete(uri)
  }

  // Update apprenticeship status
  updateApprenticeshipStatus(id: number, status: string) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeships/status/' + id + '?new_status=' + status;
    
    // For server
    // let uri = url + 'apprenticeships/status/' + id + '?new_status=' + status;
    
    return this.http.put(uri, {})
  }

  // Search apprenticeships
  searchApprenticeships(query: string) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeships/search/query?q=' + query;
    
    // For server
    // let uri = url + 'apprenticeships/search/query?q=' + query;
    
    return this.http.get(uri)
  }

  // ==================== APPRENTICESHIP SCHEDULE API METHODS ====================

  // Get all apprenticeship schedules
  getApprenticeshipSchedules() {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeship-schedule/list';
    
    // For server
    // let uri = url + 'apprenticeship-schedule/list';
    
    return this.http.get(uri)
  }

  // Update apprenticeship schedule
  updateApprenticeshipSchedule(id: number, data: any) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeship-schedule/update/' + id;
    
    // For server
    // let uri = url + 'apprenticeship-schedule/update/' + id;
    
    return this.http.put(uri, data)
  }

  // Delete apprenticeship schedule
  deleteApprenticeshipSchedule(id: number) {
    // For localhost testing
    let uri = 'http://127.0.0.1:8000/api/apprenticeship-schedule/delete/' + id;
    
    // For server
    // let uri = url + 'apprenticeship-schedule/delete/' + id;
    
    return this.http.delete(uri)
  }

  ///////get cources by admin//////////// http://localhost:50905/GetAdminCourses/68664158/2/51964213/////////////

  getAdminCourses(tnt_code?) {
    let apiUrl = constants['GetAdminCourses'] || 'GetAdminCourses'
    let uri = url + apiUrl + '/' + this.userId;
    let id = sessionStorage.RoleId
    let code = tnt_code ?? sessionStorage.getItem('TenantCode');
    return this.http.get(uri + '/' + id + '/' + code)
  }
  ///////get cources by admin////////////


  /////////////////GetAdminCourseSchedule///////////////////////////////////////////
  getAdminCourseSchedule(data) {
    // data.UserId = this.userId;
    let apiUrl = constants['GetAdminCourseSchedule'] || 'GetAdminCourseSchedule'
    data.RoleId = sessionStorage.RoleId
    let uri = url + apiUrl
    return this.http.post(uri, data)

  }

  /////////////////////my results///////////////

  getResults() {
    let apiUrl = constants['StudentAssessementResult'] || 'StudentAssessementResult'
    let uri = url + apiUrl + '/' + this.userId;
    return this.http.get(uri)
  }

  /////////////////////my results///////////////

  //////////////////////////get Post Assessments/////////////////////
  getAssessments(data) {
    data.UserId = this.userId;
    let uri = url + 'Assessment/ListOfAssessments'
    return this.http.post(uri, data)
  }
  //////////////////////////get Post Assessments/////////////////////

  //////////////////////////Assignments/////////////////////
  getAssignments(data) {
    let apiUrl = constants['StudentAssingments'] || 'StudentAssingments'
    data.UserId = this.userId;
    let uri = url + apiUrl
    return this.http.post(uri, data)
  }
  //////////////////////////Assignments/////////////////////

  joinConference(data) {
    data.UserId = this.userId;
    let apiUrl = constants['VCDetails'] || 'VCDetails'
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }

  /////////////////////////////////takeExam//////////////////////     
  takeExam(data) {
    // let uri = url + 'GetAssessment'
    let apiUrl = constants['GetAssessment'] || 'GetAssessment'
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }

  /////////////////////////////////takeExam//////////////////////     

  ///////////////////////////time tracker////////////////////////
  getTimeTracker() {
    let uri = constants['TimeTracker'] ? constants['TimeTracker'] + '/' + this.userId : ['TimeTracker'] + '/' + this.userId;
    return this.http.get(url + uri)
  }
  ///////////////////////////time tracker////////////////////////

  ////////////////////////////get learning material///////////////////////
  getLearningMeterial(data) {
    data.UserId = this.userId;
    let uri = url + constants['LearningMeterials'] || 'LearningMeterials'
    return this.http.post(uri, data)
  }

  trackMaterialTime(data) {
    data.UserId = parseInt(this.userId);
    let uri = url + constants['TrackMaterialTime'] || 'TrackMaterialTime'
    return this.http.post(uri, data)
  }
  ////////////////////////////get learning material///////////////////////

  /////////////////////////// SetAssessments/////////////////////////////
  setAssessments(data) {
    data.UserId = this.userId;
    // let uri = url + 'SetAssessments'
    let uri = url + constants['SetAssessments'] || 'SetAssessments'
    return this.http.post(uri, data)
  }
  /////////////////////////// SetAssessments/////////////////////////////

  ////////////////////////// check answers//////////////////////////////
  checkAnswers(id, saId) {
    let apiUrl = constants['CheckAnswers'] || 'CheckAnswers'
    let uri = url + apiUrl + '/' + id + '/' + this.userId + '/' + saId
    return this.http.get(uri)
  }

  ////////////////////////// check answers//////////////////////////////

  //////////////////////////get load assignments///////////////////////
  loadAssignments() {
    let apiUrl = constants['LoadAssignments'] || 'LoadAssignments'
    let uri = url + apiUrl;
    let data = {
      TenantCode: sessionStorage.getItem('TenantCode'),
      UserId: this.userId,
      RoleId: sessionStorage.getItem('RoleId')
    }///sessionStorage.getItem('RoleId') ||
    return this.http.post(uri, data)

  }
  //////////////////////////get load assignments///////////////////////

  //////////////////////////  GetAssignmentsById////////////////////////
  getAssignmentsById(id) {
    let apiUrl = constants['GetAssignmentsById'] || 'GetAssignmentsById'
    let uri = url + apiUrl + '/' + id
    return this.http.get(uri);
  }

  //////////////////////////  GetAssignmentsById////////////////////////

  ///////////////////////////LoadAssessmentDropdown//////////////////////

  loadAssessmentDropdown(id, s_id) {
    let apiUrl = constants['LoadAssessmentDropdown'] || 'LoadAssessmentDropdown'
    let uri = url + apiUrl + '/' + id + '/' + s_id;
    return this.http.get(uri)
  }

  ///////////////////////////LoadAssessmentDropdown//////////////////////

  //////////////////////////LoadEvaluateAssignments/////////////////////////
  loadEvaluateAssignments(data) {
    let apiUrl = constants['LoadEvaluateAssignments'] || 'LoadEvaluateAssignments'
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }
  //////////////////////////LoadEvaluateAssignments/////////////////////////


  ////////////////////////SetEvaluateAssignments///////////////////////////////

  setEvaluateAssignments(data) {
    let apiUrl = constants['SetEvaluateAssignments'] || 'SetEvaluateAssignments';
    let uri = url + apiUrl;
    data.TenantCode = sessionStorage.getItem('TenantCode');
    data.UserId = this.userId;
    return this.http.post(uri, data)
  }
  ////////////////////////SetEvaluateAssignments///////////////////////////////

  ////////////////////////GetAssignments drop down/////////////////////////////
  getAssignmentsDropDown(id) {
    let apiUrl = constants['GetAssignments'] || 'GetAssignments';
    let uri = url + apiUrl + '/' + id;
    return this.http.get(uri)
  }

  ////////////////////////GetAssignments drop down/////////////////////////////

  ///////////////////////SetAssignments/////////////////////////////////////////
  setAssignments(data) {
    let apiUrl = constants['SetAssignments'] || 'SetAssignments'
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }
  ///////////////////////SetAssignments/////////////////////////////////////////

  //////////////////////////////////assessment/////////////////////////////////

  ///////////////////////////////GetAssessmentTime////////////////////////////
  getAssessmentTime(data) {
    let apiUrl = constants['GetAssessmentTime'] || 'GetAssessmentTime'
    data.TrainerId = this.userId;
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }

  //////////////////////////////GetAssessmentUsers/////////////////////////////

  getAssessmentUsers(data) {
    let apiUrl = constants['GetAssessmentUsers'] || 'GetAssessmentUsers'
    data.TrainerId = this.userId;
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }

  /////////////////////////////////GetAssessmentAnswers//////////////////////

  getAssessmentAnswers(data) {
    let apiUrl = constants['GetAssessmentAnswers'] || 'GetAssessmentAnswers'
    let uri = url + apiUrl;
    return this.http.post(uri, data)
  }
  /////////////////////////////////SetEvaluateAssessments//////////////////////

  setEvaluateAssessments(data) {
    let uri = url + constants['SetEvaluateAssessments'] || 'SetEvaluateAssessments';
    return this.http.post(uri, data)
  }

  ///////////////////////////GetStudentResult/////////////////////////////////

  getStudentResult(s_id, a_id) {
    let apiUrl = constants['GetStudentResult'] || 'GetStudentResult'
    let uri = url + apiUrl + '/' + s_id + '/' + a_id;
    return this.http.get(uri);
  }

  /////////////////////////SetStudentResult/////////////////////////////////
  setStudentResult(data) {
    data.UserId = this.userId;
    data.TenantCode = sessionStorage.getItem('TenantCode')
    let uri = url + constants['SetStudentResult'] || 'SetStudentResult';
    return this.http.post(uri, data)
  }


  //////////////////////////////////assessment/////////////////////////////////

  ///////////////////////////////// cource sessions///////////////////////////
  getCourseScheduleSession(id) {
    let apiUrl = constants['GetCourseScheduleSession'] || 'GetCourseScheduleSession'
    let uri = url + apiUrl + '/' + id;
    return this.http.get(uri)
  }

  setCourseScheduleSessions(data) {
    let apiUrl = constants['SetCourseScheduleSessions'] || 'SetCourseScheduleSessions'

    let uri = url + apiUrl;
    return this.http.post(uri, data);
  }

  ///////////////////////////////// cource sessions///////////////////////////
  getSamvaadHeaders() {
    const headers = new HttpHeaders()
    headers.append('Authorization', sessionStorage.getItem('stoken'));
    return headers;
  }


  setDtFrmt(dtVal: any, frtDt: DateFrmts, frtTm: TimeFrmts = TimeFrmts.noTM, noSpace: boolean = true, isApiTF: boolean = false): string {
    let resDate: any = '';
    if (dtVal != null && dtVal != undefined) {
      if (`${dtVal}`.includes('-') && !isApiTF) {
        let dt = `${dtVal}`.split('-');
        resDate = frtDt == DateFrmts.dmy2 ? `${dt[2]}/${dt[1]}/${dt[0]}` : `${dt[2]}-${dt[1]}-${dt[0]}`;
      }
      else {
        if (dtVal) {
          resDate = this.dtPipe.transform(dtVal, frtDt);
          if (frtTm)
            resDate += `${noSpace ? ' ' : ''}${this.dtPipe.transform(dtVal, frtTm)}`;
        }
      }
    }
    return resDate;
  }
}

export enum DateFrmts {
  dmy = 'dd-MM-yyyy',
  dmy2 = 'dd/MM/yyyy',
  dym = 'dd-yyyy-MM',
  mdy = 'MM-dd-yyyy',
  myd = 'MM-yyyy-dd',
  ymd = 'yyyy-MM-dd',
  ydm = 'yyyy-dd-MM',
  _ymd = 'yyyyMMdd',
  ym_ = 'yyyy-MM-',
  ymd_ = 'yyyy-MM',
  MY = 'MMM yyyy',
  MY_ = 'MMM-yyyy',
  MY2_ = 'MMM-YYYY',
  DMY_ = 'MMM dd, yyyy',
  _DMY = 'dd-MMM-yyyy',
  _DMY2 = 'DD-MMM-YYYY',
  yyyy = 'yyyy',
  yy = 'YY',
}

export enum TimeFrmts {
  noTM = '',
  hm = 'hh:mm',
  hms = 'hh:mm:ss',
  _hms = 'hhmmss',
  hma = 'hh:mm aa',
  hmsa = 'hh:mm:ss aa',
  zeroTM = '00:00:00',
  lastTM = '23:59:59',
  hm24 = 'HH:mm:ss'
}
//--skipTests=true