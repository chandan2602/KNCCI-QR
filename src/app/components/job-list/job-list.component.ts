import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent extends BaseComponent implements OnInit {

  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; 
  listGrid: any[] = [];
  
  // Pagination and search properties
  searchTerm: string = '';
  currentPage: number = 1;
  entriesPerPage: number = 10;
  Math = Math;
  
  tooltipContent = `
					Company admins can view all published job applications in the table below. They can also <strong>view</strong> or <strong>edit</strong> existing job postings at any time. <br><br>
To create a new job listing, click the <strong>Add</strong> button at the top right of the screen.
					`;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.isAdmin = (+this.USERTYPE == 24);
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() {
    this.CommonService.activateSpinner();
    let payLoad: any = {company_id: sessionStorage.getItem('company_id'), tnt_code: sessionStorage.getItem('TenantCode'), job_id: 0}
    this.CommonService.postCall('InternshipJobs/GetList', payLoad).subscribe(
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
        this.toastr.warning(err.error ? err.error.text || err.error : 'Job related record not getting');
      })
  }

  // Filter jobs based on search term
  filteredJobs() {
    if (!this.searchTerm) {
      return this.listGrid;
    }
    const term = this.searchTerm.toLowerCase();
    return this.listGrid.filter(job => 
      job.job_title?.toLowerCase().includes(term) ||
      job.job_category?.toLowerCase().includes(term) ||
      (job.super_admin_app_rej_status == '2' ? 'approved' : 
       job.super_admin_app_rej_status == '3' ? 'rejected' : 'pending').includes(term)
    );
  }

  // Get paginated jobs
  paginatedJobs() {
    const filtered = this.filteredJobs();
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  // Calculate total pages
  totalPages() {
    const total = Math.ceil(this.filteredJobs().length / this.entriesPerPage);
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

  add() {
    this.router.navigate(['/HOME/job'])
  }

  ApplyJob(evnt: any) {
    let params = {type: 'add', id: evnt}
    this.router.navigate(['/HOME/apply_job'])
  }

  OnEditView(evnt: any, ctrl: string = '' ) {
    let params = {type: ctrl, id: evnt?.job_id}
    this.router.navigate(['/HOME/job'], { queryParams: params })
  }

}
