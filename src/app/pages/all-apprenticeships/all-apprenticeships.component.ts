import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-apprenticeships',
  templateUrl: './all-apprenticeships.component.html',
  styleUrls: ['./all-apprenticeships.component.css']
})
export class AllApprenticeshipsComponent implements OnInit {
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  isLoading: boolean = false;

  apprenticeshipsList: any[] = [];

  constructor(private router: Router, private commonService: CommonService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadApprenticeships();
  }

  loadApprenticeships() {
    this.isLoading = true;
    this.commonService.getApprenticeshipsList().subscribe(
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
    if (!this.searchTerm) {
      return this.apprenticeshipsList;
    }
    const search = this.searchTerm.toLowerCase();
    return this.apprenticeshipsList.filter(item =>
      item.apprenticeship_name?.toLowerCase().includes(search) ||
      item.company_name?.toLowerCase().includes(search) ||
      item.student_name?.toLowerCase().includes(search) ||
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
    this.router.navigate(['/HOME/apprenticeship-details', apprenticeship.id, { source: 'all' }]);
  }

  openAddModal() {
    alert('Add Apprenticeship functionality would be implemented here');
    // You can implement a modal dialog here to add new apprenticeships
  }
}
