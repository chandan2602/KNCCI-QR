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

  internships: any[] = [
    {
      id: 1,
      title: 'AI/ML Model Development Intern',
      company: 'Safaricom PLC',
      image: 'assets/kncci-img/img-2.png',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: false,
      type: 'INTERNSHIP',
      duration: '6 months',
      location: 'Nairobi',
      salary: 'KES 30,000/month',
      deadline: '01-10-2026',
      description: 'Join our engineering team to build next-generation mobile applications serving millions of Kenyans. Work...'
    },
    {
      id: 2,
      title: 'AML Arc',
      company: 'Equity Bank',
      image: 'assets/kncci-img/img-3.png',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: true,
      type: 'INTERNSHIP',
      duration: '6 months',
      location: 'Nairobi',
      salary: 'KES 25,000/month',
      deadline: '01-07-2025',
      description: 'Work with financial data to generate insights. Learn SQL, Python, and business intelligence tools while...'
    },
    {
      id: 3,
      title: 'AML Training',
      company: 'Craft Silicon',
      image: 'assets/kncci-img/img-4.png',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: false,
      type: 'INTERNSHIP',
      duration: '3 months',
      location: 'Mombasa',
      salary: 'KES 25,000/month',
      deadline: '01-07-2025',
      description: 'Design user interfaces for mobile and web applications. Collaborate with product teams and lea...'
    },
    {
      id: 4,
      title: 'Angular2026',
      company: 'Safaricom PLC',
      image: 'assets/kncci-img/img-5.png',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: true,
      type: 'INTERNSHIP',
      duration: '6 months',
      location: 'Nairobi',
      salary: 'KES 30,000/month',
      deadline: '08-10-2026',
      description: 'Protect digital assets and learn cybersecurity best practices. Work on real security challenges...'
    },
    {
      id: 5,
      title: 'Apple Time',
      company: 'Tech Innovations Ltd',
      image: 'assets/kncci-img/img-6.jpg',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: true,
      type: 'INTERNSHIP',
      duration: '3 months',
      location: 'Nairobi',
      salary: 'KES 20,000/month',
      deadline: '30-07-2025',
      description: 'Develop marketing strategies and campaigns. Learn digital marketing, social media, and brand...'
    },
    {
      id: 6,
      title: 'Apple Time test',
      company: 'Tech Innovations Ltd',
      image: 'assets/kncci-img/img-6.jpg',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: false,
      type: 'INTERNSHIP',
      duration: '3 months',
      location: 'Nairobi',
      salary: 'KES 20,000/month',
      deadline: '30-07-2025',
      description: 'Develop marketing strategies and campaigns. Learn digital marketing, social media, and brand...'
    },
    {
      id: 7,
      title: 'Apple Time test2',
      company: 'Tech Innovations Ltd',
      image: 'assets/kncci-img/img-6.jpg',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: true,
      type: 'INTERNSHIP',
      duration: '3 months',
      location: 'Nairobi',
      salary: 'KES 20,000/month',
      deadline: '30-07-2025',
      description: 'Develop marketing strategies and campaigns. Learn digital marketing, social media, and brand...'
    },
    {
      id: 8,
      title: 'Apple watch Ads',
      company: 'Tech Innovations Ltd',
      image: 'assets/kncci-img/img-6.jpg',
      logo: 'assets/kncci-img/header-kncci-logo.png',
      verified: true,
      type: 'INTERNSHIP',
      duration: '3 months',
      location: 'Nairobi',
      salary: 'KES 20,000/month',
      deadline: '09-12-2025',
      description: 'Develop marketing strategies and campaigns. Learn digital marketing, social media, and brand...'
    }
  ];

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
      this.courseList = [],
      this.courseList = res.dtCourseScehdule.map((e: any) => (
        {
          ...e,
          IMAGE_URL: `${this.fileUrl}${e.COURSE_IMAGE}`,
          count: 120,
          discount: 500
        }));
        this.getSubscriptnData()
    })
  }

  getSubscriptnData() { // http://localhost:56608/api/InternshipJobs/GetSubscriberByUserId/12345
    let userId: any = sessionStorage.UserId;
    if(userId != undefined && userId != null && userId !='') {
      this.activeSpinner();
      this.CommonService.getCall(`InternshipJobs/GetSubscriberByUserId/${sessionStorage.UserId}`, '', false).subscribe(
        (res: any) => {
          if (res?.status == true) {
            this.deactivateSpinner();
            if(res?.data.length > 0) {
              // this.subscribeData = res?.data[0];
              sessionStorage.setItem('subscribeData', `${JSON.stringify(res?.data[0])}`);
            }
              
            } else {
              this.toastr.success(res.message);
              this.deactivateSpinner();
            }
        },
        err => {
          this.deactivateSpinner();
          this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
          window.history.back()
        })
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
