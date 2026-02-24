import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
// import { Tooltip } from 'bootstrap';

declare var $: any;
// declare var bootstrap: any;

@Component({
  selector: 'app-intrenship-lst',
  templateUrl: './intrenship-lst.component.html',
  styleUrls: ['./intrenship-lst.component.css']
})
export class IntrenshipLstComponent extends BaseComponent implements OnInit {
  
  companyList: any[] = []; 
  courseList: any[] = []; 
  intrenshipPL: any = 0;
  isLogin: boolean = false;
  fileUrl: string = environment.fileUrl;
  searchText: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  activeTab: string = 'list'; // 'list', 'schedule', 'applications' for admin; 'list' for student
  ROLEID: string = ''; // Get from sessionStorage

  internships: any[] = [];

  tooltipContent = `
    Browse and filter internships by company name using the dropdown. Click on any job card to view full details. To apply, use the <strong>Enroll</strong> button at the top right. Once approved by the company, your internship will appear under <strong>My Internships.</strong>
  `;

  constructor(public rtr: Router,
    private rte: ActivatedRoute,
    CommonService: CommonService,
    toastr: ToastrService) {
    super(CommonService, toastr);
    // if (sessionStorage.getItem('intrenshipPL') != null) {
    //   this.intrenshipPL = '',
    //   this.intrenshipPL = sessionStorage.getItem('intrenshipPL'), sessionStorage.removeItem('intrenshipPL')
    //   this.getCourseList();
    // } else {
    //   this.getCourseList();
    // }
  }

  ngOnInit(): void {
    // Get ROLEID from sessionStorage (same as header component - note: it's 'RoleId' not 'ROLEID')
    this.ROLEID = sessionStorage.getItem('RoleId') || '';
    
    // Set default tab based on role
    if (this.ROLEID === '1') {
      this.activeTab = 'list'; // Admin/Company sees list by default
    } else {
      this.activeTab = 'list'; // Student sees list by default
    }
    
    this.getCompanyList(); this.getCourseList()
  }
  // ngAfterViewInit(): void {
  //   const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  //   tooltipTriggerList.forEach(el => new Tooltip(el));
  // }

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`).subscribe((res: any) => {
      this.companyList = res.data;
    })
  }

  getCourseList() { // CourseSchedule/GetAllActiveCoursesByCategoryId/0/companyId
    this.CommonService.getCall(`CourseSchedule/GetAllActiveCoursesByCategoryId/0/${this.intrenshipPL}`).subscribe((res: any) => {
      if (res?.dtCourseScehdule && res.dtCourseScehdule.length > 0) {
        this.internships = res.dtCourseScehdule.map((e: any) => (
          {
            ...e,
            title: e.COURSE_NAME || e.title,
            verified: e.IS_CERTIFIED || false,
            deadline: e.COURSE_END_DATE || e.deadline,
            IMAGE_URL: `${this.fileUrl}${e.COURSE_IMAGE}`,
            count: 120,
            discount: 500
          }));
        this.courseList = this.internships;
      } else {
        this.internships = [];
        this.courseList = [];
      }
      console.log('API Response:', res); // Debug log
      this.courseList = [],
      this.courseList = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: `${this.fileUrl}${e.COURSE_IMAGE}`,
          count: 120,
          discount: 500
        }));
      console.log('Course List:', this.courseList); // Debug log
      // Map courseList to internships for display
      this.internships = this.courseList.map((course: any) => ({
        id: course.COURSE_ID,
        title: course.COURSE_NAME,
        company: course.COMPANY_NAME || 'Company',
        image: course.IMAGE_URL,
        logo: 'assets/kncci-img/header-kncci-logo.png',
        verified: true,
        type: 'INTERNSHIP',
        duration: course.COURSE_DURATION || '3-6 months',
        location: course.LOCATION || 'Nairobi',
        salary: course.SALARY || 'Negotiable',
        deadline: course.DEADLINE || 'TBD',
        description: course.COURSE_DESCRIPTION || ''
      }));
      console.log('Internships Array:', this.internships); // Debug log
      this.getSubscriptnData()
    })
  }

  getSubscriptnData() {
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          this.deactivateSpinner();
          if (res?.status == true && res?.data?.length > 0) {
            sessionStorage.setItem('subscribeData', `${JSON.stringify(res?.data[0])}`);
          }
        },
        err => {
          this.deactivateSpinner();
          console.warn('Subscription check failed:', err);
          // Don't navigate back - let user see internships anyway
        })
    } else {
      this.deactivateSpinner();
    }
  }

  isShw(): boolean {
    return !location.href.includes('/default');
  }

  intrenshipDetails(evnt: any) {
    if (sessionStorage.UserId)
      this.rtr.navigate(['view-course-details'], { state: evnt });
    else
      this.rtr.navigate(['eRP/view-course-details'], { state: evnt });
  }

  get filteredInternships() {
    let internships = this.internships;
    
    // Filter by search text
    if (this.searchText) {
      internships = internships.filter(i => 
        i.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        i.company.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    return internships;
  }

  get paginatedInternships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredInternships.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredInternships.length / this.entriesPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
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

  addInternship() {
    // Add internship logic here
    console.log('Add internship clicked');
  }

}
