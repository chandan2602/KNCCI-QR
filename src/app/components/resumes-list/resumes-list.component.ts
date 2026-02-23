import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resumes-list',
  templateUrl: './resumes-list.component.html',
  styleUrls: ['./resumes-list.component.css']
})
export class ResumesListComponent extends BaseComponent implements OnInit {

  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false;
  listGrid: any[] = [];
  fileUrl: string = environment.fileUrl;
  
  // Pagination and search properties
  searchTerm: string = '';
  currentPage: number = 1;
  entriesPerPage: number = 10;
  Math = Math;

  tooltipContent = `
This section displays resumes uploaded by students upon completion of their internships.<br><br>
Company admins can<strong> view </strong>these resumes and may <strong>contact the students directly </strong>if needed for future opportunities.
`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() {
    this.CommonService.activateSpinner();
    let payLoad: any = {company_id: sessionStorage.getItem('company_id'), tnt_code: sessionStorage.getItem('TenantCode'), job_id: 0}
    this.CommonService.getCall(`InternshipJobs/GetResumeByCompanyIdAsync/${sessionStorage.getItem('company_id')}`).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data;
        } else {
          this.deactivateSpinner();
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Resume related record not getting');
      })
  }

  // Filter resumes based on search term
  filteredResumes() {
    if (!this.searchTerm) {
      return this.listGrid;
    }
    const term = this.searchTerm.toLowerCase();
    return this.listGrid.filter(resume => 
      resume.name?.toLowerCase().includes(term) ||
      resume.emailid?.toLowerCase().includes(term) ||
      resume.mobileno?.toLowerCase().includes(term)
    );
  }

  // Get paginated resumes
  paginatedResumes() {
    const filtered = this.filteredResumes();
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  // Calculate total pages
  totalPages() {
    const total = Math.ceil(this.filteredResumes().length / this.entriesPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Navigate to next page
  nextPage() {
    if (this.currentPage < this.totalPages().length) {
      this.currentPage++;
    }
  }

  // Navigate to previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Go to specific page
  goToPage(page: number) {
    this.currentPage = page;
  }

  OnEditView(evnt: any, ctrl: string = '' ) {
    if (ctrl === 'view' && evnt.resume) {
      window.open(this.fileUrl + evnt.resume, '_blank');
    }
  }

}
