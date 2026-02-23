import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-internships',
  templateUrl: './public-internships.component.html',
  styleUrls: ['./public-internships.component.css']
})
export class PublicInternshipsComponent extends BaseComponent implements OnInit {
  
  searchText: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  isLoggedIn: boolean = false;
  userId: string = '';
  fileUrl: string = environment.fileUrl;
  activeTab: string = 'all';
  selectedCompany: string = '0';
  companyList: any[] = [];
  
  internshipsList: any[] = [];
  selectedInternship: any = null;
  showDetails: boolean = false;

  constructor(
    private router: Router,
    CommonService: CommonService,
    toastr: ToastrService
  ) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    // Check if user is logged in
    this.userId = sessionStorage.getItem('UserId') || '';
    this.isLoggedIn = !!this.userId;
    
    // Load companies and internships
    this.getCompanyList();
    this.getInternships();
    
    // Check if user just logged in to view a specific internship
    const internshipId = sessionStorage.getItem('viewInternshipId');
    if (internshipId) {
      sessionStorage.removeItem('viewInternshipId');
      const internship = this.internshipsList.find(i => i.COURSE_ID === parseInt(internshipId));
      if (internship) {
        this.viewDetails(internship);
      }
    }
  }

  getCompanyList() {
    this.CommonService.getCall(`Registration/GetCompanyList`, '', false).subscribe(
      (res: any) => {
        if (res?.data) {
          this.companyList = res.data;
        }
      },
      err => {
        console.error('Error loading companies:', err);
      }
    );
  }

  getInternships() {
    this.activeSpinner();
    // Get internships filtered by selected company
    this.CommonService.getCall(`CourseSchedule/GetAllActiveCoursesByCategoryId/0/${this.selectedCompany}`, '', false).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res?.dtCourseScehdule && res.dtCourseScehdule.length > 0) {
          this.internshipsList = res.dtCourseScehdule.map((e: any) => ({
            ...e,
            IMAGE_URL: `${this.fileUrl}${e.COURSE_IMAGE}`,
            title: e.COURSE_NAME,
            company: e.COMPANY_NAME || 'Company',
            duration: e.COURSE_DURATION || '3-6 months',
            location: e.LOCATION || 'Nairobi',
            salary: e.SALARY || 'Negotiable',
            deadline: e.COURSE_END_DATE,
            description: e.COURSE_DESCRIPTION || '',
            verified: e.IS_CERTIFIED || false
          }));
        } else {
          this.internshipsList = [];
        }
      },
      err => {
        this.deactivateSpinner();
        console.error('Error loading internships:', err);
        this.toastr.error('Failed to load internships');
      }
    );
  }

  get filteredInternships() {
    let list = this.internshipsList;
    
    if (this.searchText) {
      list = list.filter(i => 
        i.title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        i.company?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        i.location?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    return list;
  }

  get paginatedInternships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredInternships.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredInternships.length / this.entriesPerPage);
  }

  get totalPagesArray(): number[] {
    const pageCount = Math.ceil(this.filteredInternships.length / this.entriesPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  viewDetails(internship: any) {
    this.selectedInternship = internship;
    this.showDetails = true;
    window.scrollTo(0, 0);
  }

  backToList() {
    this.showDetails = false;
    this.selectedInternship = null;
    window.scrollTo(0, 0);
  }

  applyNow(internship: any) {
    if (!this.isLoggedIn) {
      // Store the internship ID and redirect to login
      sessionStorage.setItem('viewInternshipId', internship.COURSE_ID.toString());
      sessionStorage.setItem('returnUrl', '/internships');
      this.toastr.info('Please login to apply for this internship');
      this.router.navigate(['/login']);
      return;
    }
    
    // User is logged in, navigate to course details for enrollment
    this.router.navigate(['eRP/view-course-details'], { state: internship });
  }

  redirectToLogin() {
    if (this.selectedInternship) {
      sessionStorage.setItem('viewInternshipId', this.selectedInternship.COURSE_ID.toString());
    }
    sessionStorage.setItem('returnUrl', '/internships');
    this.router.navigate(['/login']);
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
}
