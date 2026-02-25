import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-public-apprenticeships',
  templateUrl: './public-apprenticeships.component.html',
  styleUrls: ['./public-apprenticeships.component.css']
})
export class PublicApprenticeshipsComponent extends BaseComponent implements OnInit {
  
  searchText: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  isLoggedIn: boolean = false;
  userId: string = '';
  isLoading: boolean = false;
  
  apprenticeshipsList: any[] = [];
  selectedApprenticeship: any = null;
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
    
    // Load apprenticeships from API
    this.loadApprenticeships();
    
    // Check if user just logged in to view a specific apprenticeship
    const apprenticeshipId = sessionStorage.getItem('viewApprenticeshipId');
    if (apprenticeshipId) {
      sessionStorage.removeItem('viewApprenticeshipId');
      const apprenticeship = this.apprenticeshipsList.find(a => a.id === parseInt(apprenticeshipId));
      if (apprenticeship) {
        this.selectedApprenticeship = apprenticeship;
        this.showDetails = true;
      }
    }
  }

  loadApprenticeships() {
    this.isLoading = true;
    this.CommonService.getApprenticeshipsList().subscribe(
      (res: any) => {
        if (res?.status === true && res?.data) {
          // Filter to show only apprenticeships approved by super admin
          this.apprenticeshipsList = res.data.filter((item: any) => 
            item.approval_status === 'Approved' || item.approval_status === 'approved'
          );
        } else {
          this.apprenticeshipsList = [];
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Error loading apprenticeships:', err);
        this.toastr.error('Failed to load apprenticeships');
        this.isLoading = false;
      }
    );
  }

  get filteredApprenticeships() {
    let list = this.apprenticeshipsList;
    
    if (this.searchText) {
      list = list.filter(a => 
        (a.apprenticeship_name || a.program_name)?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (a.company_name || a.company)?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        a.location?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    return list;
  }

  get paginatedApprenticeships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredApprenticeships.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredApprenticeships.length / this.entriesPerPage);
  }

  get totalPagesArray(): number[] {
    const pageCount = Math.ceil(this.filteredApprenticeships.length / this.entriesPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  viewDetails(apprenticeship: any) {
    this.selectedApprenticeship = apprenticeship;
    this.showDetails = true;
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeDetails() {
    this.selectedApprenticeship = null;
    this.showDetails = false;
  }

  enrollNow(apprenticeship: any) {
    if (!this.isLoggedIn) {
      // Store the apprenticeship ID and redirect to login
      sessionStorage.setItem('viewApprenticeshipId', apprenticeship.id.toString());
      sessionStorage.setItem('returnUrl', '/apprenticeships');
      this.router.navigate(['/login']);
      return;
    }
    
    // User is logged in, proceed with enrollment
    this.toastr.success(`Enrolling in: ${apprenticeship.program_name}`, 'Enrollment');
    // Here you would typically call an API to enroll the user
    // After successful enrollment, you might want to redirect or show a success message
  }

  redirectToLogin() {
    if (this.selectedApprenticeship) {
      sessionStorage.setItem('viewApprenticeshipId', this.selectedApprenticeship.id.toString());
    }
    sessionStorage.setItem('returnUrl', '/apprenticeships');
    this.router.navigate(['/login']);
  }

  enrollApprenticeship(apprenticeship: any) {
    if (!this.isLoggedIn) {
      sessionStorage.setItem('enrollApprenticeshipId', apprenticeship.id.toString());
      sessionStorage.setItem('returnUrl', '/apprenticeships');
      this.router.navigate(['/login']);
      return;
    }
    
    // Navigate to details page for enrollment
    this.router.navigate(['/HOME/apprenticeship-details', apprenticeship.id]);
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
