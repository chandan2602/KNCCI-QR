import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-apprenticeships-applications',
  templateUrl: './apprenticeships-applications.component.html',
  styleUrls: ['./apprenticeships-applications.component.css']
})
export class ApprenticeshipsApplicationsComponent implements OnInit {

  applicationsList: any[] = [];
  isLoading: boolean = false;

  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  filterStatus: string = 'All';
  viewMode: string = 'list';
  selectedApplication: any = null;
  ROLEID: string = '';

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.ROLEID = sessionStorage.getItem('RoleId') || '';
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.commonService.getApprenticeshipsList().subscribe(
      (res: any) => {
        if (res?.status === true && res?.data) {
          this.applicationsList = res.data;
        } else {
          this.applicationsList = [];
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Error loading applications:', err);
        this.toastr.error('Failed to load applications');
        this.isLoading = false;
      }
    );
  }

  get filteredApplications() {
    let applications = this.applicationsList;

    // Filter by status
    if (this.filterStatus !== 'All') {
      applications = applications.filter(item => item.status === this.filterStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      applications = applications.filter(item =>
        item.apprenticeship_name?.toLowerCase().includes(search) ||
        item.company_name?.toLowerCase().includes(search) ||
        item.student_name?.toLowerCase().includes(search)
      );
    }

    return applications;
  }

  get paginatedApplications() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredApplications.slice(start, end);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredApplications.length / this.entriesPerPage);
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

  getStatusClass(status: string): string {
    switch(status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-pending';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'Approved':
        return 'bi-check-circle-fill';
      case 'Pending':
        return 'bi-clock-fill';
      case 'Rejected':
        return 'bi-x-circle-fill';
      default:
        return '';
    }
  }

  viewApplicationDetails(application: any) {
    this.selectedApplication = application;
    this.viewMode = 'details';
  }

  goBackToList() {
    this.viewMode = 'list';
    this.selectedApplication = null;
  }

  approveApplication(application: any) {
    application.status = 'Approved';
    alert(`Application approved for ${application.student_name}`);
  }

  rejectApplication(application: any) {
    application.status = 'Rejected';
    alert(`Application rejected for ${application.student_name}`);
  }
}
