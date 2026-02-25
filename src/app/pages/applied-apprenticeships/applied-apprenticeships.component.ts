import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-applied-apprenticeships',
  templateUrl: './applied-apprenticeships.component.html',
  styleUrls: ['./applied-apprenticeships.component.css']
})
export class AppliedApprenticeshipsComponent implements OnInit {
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  isLoading: boolean = false;

  apprenticeshipsList: any[] = [];

  constructor(
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAppliedApprenticeships();
  }

  loadAppliedApprenticeships() {
    this.isLoading = true;
    const studentId = sessionStorage.getItem('UserId') || '';
    
    if (!studentId) {
      this.toastr.warning('Please log in to view your applications');
      this.isLoading = false;
      return;
    }
    
    console.log('Loading applied apprenticeships for student ID:', studentId);
    
    // Use the new API endpoint to get student's enrolled apprenticeships
    this.commonService.getStudentEnrolledApprenticeships(studentId).subscribe(
      (res: any) => {
        console.log('Applied apprenticeships response:', res);
        if (res?.status === true && res?.data) {
          this.apprenticeshipsList = res.data;
        } else {
          this.apprenticeshipsList = [];
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Error loading applied apprenticeships:', err);
        this.toastr.error('Failed to load applied apprenticeships');
        this.isLoading = false;
      }
    );
  }

  get filteredApprenticeships() {
    let data = this.apprenticeshipsList;
    
    if (!this.searchTerm) {
      return data;
    }
    const search = this.searchTerm.toLowerCase();
    return data.filter(item =>
      item.apprenticeship_name?.toLowerCase().includes(search) ||
      item.company_name?.toLowerCase().includes(search) ||
      item.status?.toLowerCase().includes(search)
    );
  }

  get paginatedApprenticeships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredApprenticeships.slice(start, end);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredApprenticeships.length / this.entriesPerPage);
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

  viewDetails(apprenticeship: any) {
    this.router.navigate(['/HOME/apprenticeship-details', apprenticeship.id]);
  }
}
