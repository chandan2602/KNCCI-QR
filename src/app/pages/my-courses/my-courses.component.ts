import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../base.component';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { FileuploadService } from '../../services/fileupload.service';
@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  myCourseList: Array<any> = [];
  showModel: boolean = false;
  UserId = sessionStorage.UserId;
  company_id = sessionStorage.company_id
  certificateInfo: any;
  starRating = 0;
  review: any;
  isSubmitted: Boolean = false;
  recordingList: Array<any> = [];
  showAdPopup: boolean = false;
  private readonly onDestroy = new Subscription();
  courseValue: any='';
  studentid: any = '';
  companyid: any = '';
  coursesheduleid: any;
  documentId: any = 0;
  
  // Pagination properties
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  
tooltipContent = `
					View all your approved and certified internships here. After completion, use the <strong>Download Certificate</strong> option under the <strong>Actions</strong> dropdown. Once certified, you’ll also see an <strong>Upload Resume</strong> button to submit your resume directly to the respective company.
					`;

  constructor(private route: Router, CommonService: CommonService, toastr: ToastrService, private fb: UntypedFormBuilder, private FileuploadService: FileuploadService) {
    super(CommonService, toastr);
    this.getCourses();
  }

  ngOnInit(): void {
    this.initialControls();
    this.ShowOrHideAdverstements();
  }

  initialControls() {
    this.myForm = this.fb.group({
      RATING: ['', Validators.required],
      DESCRIPTION: ['', Validators.required],
      USER_ID: sessionStorage.UserId,
      REVIEW_DATE: [''],
      COURSE_ID: 0,
      COURSESHD_ID: 0,
      REVIEW_ID: 0
    });
  }
  typesOfFile: object = {
    'Uploaded Resume': {
      types: ['doc', 'docx', 'pdf', 'jpg', 'gif', 'png', 'xlsx', 'xlr', 'ppt', 'pptx', 'jpeg'],
      message: 'Please upload the',
    },
    'Webinar Info': {
      types: ['m4v', 'avi', 'mpg', 'mp4'],
      message: "Please upload the "
    },
    'Resume': {
      types: ['pdf', 'xlsx', 'doc'],
      message: "Please upload the Flash file Like"
    },
    'Audio': {
      types: ['mp3', 'wav'],
      message: "please upload the"
    }
  };
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getCourses() {
    this.myCourseList = [];
    this.enableOrDisabledSpinner();
    // const ob1$ = this.CommonService.getCall('CourseSchedule/GetMyCourses/', `${this.UserId}/${this.company_id}/${sessionStorage.getItem('RoleId') == '3' ? true : false}`).subscribe((res: any) => {
    const ob1$ = this.CommonService.getCall('CourseSchedule/GetMyCoursesList/', `${this.UserId}/${this.company_id}/${sessionStorage.getItem('RoleId') == '3' ? true : false}`).subscribe((res: any) => {
      this.myCourseList = res.dtCourseScehdule;
      this.renderDataTable();
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
    this.onDestroy.add(ob1$);
  }

  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

  downloadCertificate(courseInfo: any) {
    this.certificateInfo = { ...courseInfo, userId: this.userId, FullName: sessionStorage.FullName };
    setTimeout(() => (<HTMLInputElement>document.getElementById('btnShowModel')).click(), 10);
  }

  closeCertificateEvent(data: any) {
    this.showModel = false;
  }
  validateDownloadCertivicate(REVIEW_ID: number, date: any): boolean {
    if (REVIEW_ID == 0)
      return false;
    return new Date().getTime() > new Date(date).getTime();
  }

  setReviewForm(data: any) {
    this.initialControls();
    if (data.REVIEWS)
      this.myForm.setValue(data.REVIEWS);
    else
      this.myForm.patchValue({ COURSE_ID: data.COURSE_ID, COURSESHD_ID: data.COURSESHD_ID });
    setTimeout(() => { document.getElementById('btnShowReviewModel')?.click(); }, 100);
  }

  close() {
    setTimeout(() => { this.initialControls(); }, 100);
  }

  onSubmitForm(myForm: any) {
    const payload = JSON.parse(JSON.stringify(this.myForm.getRawValue()));
    console.log(payload);
    // return;
    this.CommonService.postCall("Courses/SaveOrUpdate", payload).subscribe((res: any) => {
      this.review = res;
      this.toastr.success("Review Submitted successfully !!");
      //Close the modal
      document.getElementById('md_close')?.click();
      this.getCourses();
    }, e => { });
  }
  joinMeeting(url: string) {
    super.getMeetingDetails(url);
  }

  changeStatus(URL: any) {
    if (URL) {
      this.CommonService.getCall(`nojwt/recording/getRecordingById/`, URL.split('-')[1], true).subscribe((res: any) => {
        this.recordingList = res.dtCourseScehdule;
        setTimeout(() => { this.isSubmitted = true; }, 10);
      }, e => { });

    }
  }

  closeModel(data: any) {
    this.isSubmitted = false;

  }

  ShowOrHideAdverstements() {
    const { RoleId = 0, USERTYPE = 0, isLoggedIn = false, adsShown = true } = sessionStorage;
    if (RoleId === '3' && USERTYPE === '26') {
      const LoggedIn = isLoggedIn === "true";
      const isAdsShown = adsShown === "false";
      if (LoggedIn && isAdsShown) {
        this.showAdPopup = true;
        sessionStorage.adsShown = true;
      };
    }
  }

  closePopup() {
    this.showAdPopup = false;
  }

  adEventChanged(adEvent: any) {
    this.showAdPopup = false
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let materialType: object = this.typesOfFile['Resume']

      let check = materialType['types'].includes(filetype?.toLowerCase());
      if (check) {
        this.file = file;
        this.upload()
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.toastr.warning(materialType['message'] + JSON.stringify(materialType['types']))
        event.target.value = ''
      }
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/UploadMaterial');
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
      } catch (e) { console.log(e); }

    }, err => { })
  }

  onCourseData(item){
    this.courseValue=item.COURSE_ID
    this.studentid= item.REVIEWS.USER_ID;
    this.companyid= item.COMPANY_ID;
    this.coursesheduleid= item.REVIEWS.COURSESHD_ID;
    this.documentId = item.document_id
  }

  onSubmitResume() {
    const payload = {
      "document_id": this.documentId,
      "student_id": this.studentid,
      "company_id": this.companyid,
      "course_id": this.courseValue,
      "course_shedule_id": this.coursesheduleid,
      "resume": this.fileName
    };
    this.CommonService.postCall("InternshipJobs/SaveOrUpdateStudentDocuments", payload).subscribe((res: any) => {
      // this.review = res;
      this.toastr.success(res.message);
      this.route.navigate(['/HOME/my-courses']);
         $('#cls').click();
    }, e => { });
  }

  // Pagination methods
  get filteredInternships() {
    if (!this.searchTerm) {
      return this.myCourseList;
    }
    const search = this.searchTerm.toLowerCase();
    return this.myCourseList.filter(item =>
      item.COURSE_NAME?.toLowerCase().includes(search) ||
      item.TNT_NAME?.toLowerCase().includes(search) ||
      item.COURSESHD_STARTDATE?.toLowerCase().includes(search) ||
      item.COURSESHD_ENDDATE?.toLowerCase().includes(search)
    );
  }

  get paginatedInternships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredInternships.slice(start, end);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredInternships.length / this.entriesPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
