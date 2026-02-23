import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-public-jobs',
  templateUrl: './public-jobs.component.html',
  styleUrls: ['./public-jobs.component.css']
})
export class PublicJobsComponent extends BaseComponent implements OnInit {
  
  searchText: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  isLoggedIn: boolean = false;
  userId: string = '';
  
  jobsList: any[] = [];
  selectedJob: any = null;
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
    
    console.log('PublicJobsComponent initialized');
    console.log('User logged in:', this.isLoggedIn);
    console.log('TenantCode:', sessionStorage.getItem('TenantCode'));
    console.log('company_id:', sessionStorage.getItem('company_id'));
    
    // Load jobs
    this.getJobs();
    
    // Check if user just logged in to view a specific job
    const jobId = sessionStorage.getItem('viewJobId');
    if (jobId) {
      sessionStorage.removeItem('viewJobId');
      setTimeout(() => {
        const job = this.jobsList.find(j => j.job_id === parseInt(jobId));
        if (job) {
          this.viewDetails(job);
        }
      }, 500);
    }
  }

  getJobs() {
    this.activeSpinner();
    
    // Use HomePageGetList API which works for public view
    let payLoad: any = {
      job_title: '',
      job_category_id: 0,
      county_id: 0,
      job_type_ids: '',
      shift_id: 0,
      company_id: 0,
      job_salary_from: 0,
      job_salary_to: 0
    };
    
    console.log('Loading jobs with payload:', payLoad);
    
    this.CommonService.postCall('InternshipJobs/HomePageGetList', payLoad).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        console.log('API Response:', res);
        
        if (res?.status == true && res.data) {
          console.log('Total jobs loaded:', res.data.length);
          
          // Filter only approved jobs for public view
          this.jobsList = res.data.filter((job: any) => job.super_admin_app_rej_status == '2');
          console.log('Approved jobs:', this.jobsList.length);
          
          if (this.jobsList.length === 0) {
            this.toastr.info('No approved jobs available at the moment');
          }
        } else {
          this.jobsList = [];
          console.log('No jobs in response or status is false');
          if (res?.message) {
            this.toastr.info(res.message);
          }
        }
      },
      err => {
        this.deactivateSpinner();
        console.error('Error loading jobs:', err);
        console.error('Error details:', err.error);
        this.toastr.warning('Failed to load jobs. Please try again later.');
      }
    );
  }

  get filteredJobs() {
    let list = this.jobsList;
    
    if (this.searchText) {
      list = list.filter(j => 
        j.job_title?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        j.job_category?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    return list;
  }

  get paginatedJobs() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredJobs.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredJobs.length / this.entriesPerPage);
  }

  get totalPagesArray(): number[] {
    const pageCount = Math.ceil(this.filteredJobs.length / this.entriesPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  viewDetails(job: any) {
    // Allow anyone to view job details, no login required
    // Navigate to job view page with publicView flag
    this.router.navigate(['/HOME/job'], { 
      queryParams: { 
        type: 'view',
        id: job.job_id,
        publicView: 'true'
      } 
    });
  }

  backToList() {
    this.router.navigate(['/jobs']);
  }

  redirectToLogin() {
    sessionStorage.setItem('returnUrl', '/jobs');
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
