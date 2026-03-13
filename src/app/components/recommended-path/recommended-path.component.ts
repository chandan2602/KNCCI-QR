import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recommended-path',
  templateUrl: './recommended-path.component.html',
  styleUrls: ['./recommended-path.component.css']
})
export class RecommendedPathComponent implements OnInit {

  hollandCode: string = '';
  activeTab: string = 'internships';
  searchQuery: string = '';
  isLoading: boolean = false;

  tabs = [
    // { id: 'jobs', label: 'ALL', count: 0 },
    { id: 'internships', label: 'INTERNSHIPS', count: 0 },
    { id: 'apprenticeships', label: 'APPRENTICESHIPS', count: 0 },
    { id: 'courses', label: 'JOBS', count: 0 }
  ];

  staticJobs: any[] = [];
  staticInternships: any[] = [];
  staticApprenticeships: any[] = [];
  staticCourses: any[] = [];

  private apiUrl = 'http://127.0.0.1:8000/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Get holland code from navigation state or route params
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.holland_code) {
      this.hollandCode = navigation.extras.state.holland_code;
      this.loadRecommendations();
    } else {
      // Fallback: try to get from route params
      this.route.queryParams.subscribe(params => {
        if (params['holland_code']) {
          this.hollandCode = params['holland_code'];
          this.loadRecommendations();
        } else {
          // Try to get from sessionStorage (set by quiz component)
          const quizResult = sessionStorage.getItem('quizSummaryResult');
          if (quizResult) {
            try {
              const result = JSON.parse(quizResult);
              if (result.holland_code) {
                this.hollandCode = result.holland_code;
                this.loadRecommendations();
              } else {
                this.toastr.error('Holland code not found in quiz results');
              }
            } catch (e) {
              this.toastr.error('Failed to parse quiz results');
            }
          } else {
            this.toastr.error('Please complete the Holland exam first to see recommendations');
            this.router.navigate(['/HOME/hooland-exam']);
          }
        }
      });
    }
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    if (!this.hollandCode) {
      this.toastr.error('Holland code not found');
      return;
    }

    this.isLoading = true;

    // Parse holland code into array (e.g., "SIA" -> ["S", "I", "A"])
    const hollandCodes = this.hollandCode.toUpperCase().split('');

    // Validate that we have exactly 3 codes
    if (hollandCodes.length !== 3) {
      this.toastr.error('Holland code must be exactly 3 characters (e.g., SIA)');
      this.isLoading = false;
      return;
    }

    const payload = {
      holland_codes: hollandCodes
    };

    console.log('Sending payload:', payload);

    switch (this.activeTab) {
      case 'jobs':
        this.loadJobs(payload);
        break;
      case 'internships':
        this.loadInternships(payload);
        break;
      case 'apprenticeships':
        this.loadApprenticeships(payload);
        break;
      case 'courses':
        this.loadCourses(payload);
        break;
    }
  }

  loadJobs(payload: any): void {
    this.http.post<any>(`${this.apiUrl}hollandcode/jobs-recommendations/`, payload).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.staticJobs = response.map(job => ({
            id: job.id || job.Job_ID,
            title: job.Title || job.title,
            company: job.Company || job.company,
            location: job.Location || job.location,
            type: 'Full-time',
            salary: job.Salary || '$80k - $120k',
            description: job.Description || job.description,
            matchScore: job.Match_Score || 0
          }));
          this.updateTabCount('jobs', this.staticJobs.length);
        } else {
          this.toastr.info(response.message || 'No jobs found');
          this.staticJobs = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Failed to load jobs');
        console.error('Jobs API error:', err);
        this.staticJobs = [];
      }
    });
  }

  loadInternships(payload: any): void {
    console.log('=== INTERNSHIPS REQUEST ===');
    console.log('URL:', `${this.apiUrl}hollandcode/internships-recommendations/`);
    console.log('Payload:', JSON.stringify(payload));
    
    this.http.post<any>(`${this.apiUrl}hollandcode/internships-recommendations/`, payload).subscribe({
      next: (response) => {
        console.log('=== INTERNSHIPS RESPONSE ===');
        console.log('Response:', response);
        console.log('Is Array:', Array.isArray(response));
        
        if (Array.isArray(response)) {
          this.staticInternships = response.map(internship => ({
            id: internship.id || internship.Internship_ID,
            title: internship.Title || internship.title,
            company: internship.Company || internship.company,
            location: internship.Location || internship.location,
            type: 'Internship',
            duration: internship.Duration || '6 months',
            description: internship.Description || internship.description,
            matchScore: internship.Match_Score || 0
          }));
          this.updateTabCount('internships', this.staticInternships.length);
        } else if (response && typeof response === 'object') {
          this.toastr.info(response.message || 'No internships found');
          this.staticInternships = [];
        } else {
          this.toastr.info('No internships found');
          this.staticInternships = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('=== INTERNSHIPS ERROR ===');
        console.error('Full error object:', err);
        console.error('Status:', err.status);
        
        let errorMessage = 'Failed to load internships';
        if (err.status === 0) {
          errorMessage = 'Network error - Cannot reach server';
        } else if (err.status === 404) {
          errorMessage = err.error?.detail || 'No internships found';
        } else if (err.status === 422) {
          errorMessage = 'Invalid request format';
        }
        
        this.toastr.error(errorMessage);
        this.staticInternships = [];
      }
    });
  }

  loadApprenticeships(payload: any): void {
    console.log('=== APPRENTICESHIPS REQUEST ===');
    console.log('URL:', `${this.apiUrl}hollandcode/apprenticeship-recommendations/`);
    console.log('Payload:', JSON.stringify(payload));
    console.log('Payload type:', typeof payload);
    
    this.http.post<any>(`${this.apiUrl}hollandcode/apprenticeship-recommendations/`, payload).subscribe({
      next: (response) => {
        console.log('=== APPRENTICESHIPS RESPONSE ===');
        console.log('Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is Array:', Array.isArray(response));
        
        if (Array.isArray(response)) {
          this.staticApprenticeships = response.map(apprenticeship => ({
            id: apprenticeship.id || apprenticeship.course_id,
            title: apprenticeship.Title || apprenticeship.title,
            company: apprenticeship.Company || apprenticeship.company,
            location: apprenticeship.Location || apprenticeship.location,
            type: 'Apprenticeship',
            duration: apprenticeship.Duration || '4 years',
            description: apprenticeship.Description || apprenticeship.description,
            matchScore: apprenticeship.Match_Score || 0
          }));
          this.updateTabCount('apprenticeships', this.staticApprenticeships.length);
          console.log('Mapped apprenticeships:', this.staticApprenticeships);
        } else if (response && typeof response === 'object') {
          // Handle case where response is an object with a message (404 wrapped in success)
          console.log('Response is object, not array');
          if (response.message) {
            this.toastr.info(response.message);
          } else {
            this.toastr.info('No apprenticeships found');
          }
          this.staticApprenticeships = [];
        } else {
          this.toastr.info('No apprenticeships found');
          this.staticApprenticeships = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('=== APPRENTICESHIPS ERROR ===');
        console.error('Full error object:', err);
        console.error('Status:', err.status);
        console.error('Status text:', err.statusText);
        console.error('Error body:', err.error);
        console.error('Error message:', err.message);
        
        // Try to extract meaningful error message
        let errorMessage = 'Failed to load apprenticeships';
        
        if (err.status === 0) {
          errorMessage = 'Network error - Cannot reach server';
        } else if (err.status === 404) {
          errorMessage = err.error?.detail || err.error?.message || 'No apprenticeships found matching your profile';
        } else if (err.status === 422) {
          errorMessage = 'Invalid request format: ' + (err.error?.detail?.[0]?.msg || 'Check payload format');
        } else if (err.status === 500) {
          errorMessage = 'Server error: ' + (err.error?.detail || 'Internal server error');
        } else if (err.error?.detail) {
          errorMessage = err.error.detail;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        this.toastr.error(errorMessage);
        this.staticApprenticeships = [];
      }
    });
  }

  loadCourses(payload: any): void {
    // Using apprenticeship endpoint for courses as per API structure
    this.http.post<any>(`${this.apiUrl}hollandcode/jobs-recommendations/`, payload).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.staticCourses = response.map(course => ({
            id: course.id || course.course_id,
            title: course.Title || course.title,
            provider: course.Company || course.provider,
            mode: 'Online',
            duration: course.Duration || '12 weeks',
            price: course.Fees || course.Price || 'KES 25,000',
            startDate: '1 Apr 2026',
            description: course.Description || course.description,
            matchScore: course.Match_Score || 0
          }));
          this.updateTabCount('courses', this.staticCourses.length);
        } else {
          this.toastr.info(response.message || 'No courses found');
          this.staticCourses = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Courses API error:', err);

        // Handle 404 as "no results found" instead of error
        if (err.status === 404) {
          const message = err.error?.detail || err.error?.message || 'No courses found matching your profile';
          this.toastr.info(message);
          this.staticCourses = [];
        } else {
          this.toastr.error('Failed to load courses');
          this.staticCourses = [];
        }
      }
    });
  }

  updateTabCount(tabId: string, count: number): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.count = count;
    }
  }

  applyForJob(job: any): void {
    this.toastr.success(`Applied for ${job.title} at ${job.company}`);
  }

  viewJobDetails(job: any): void {
    this.toastr.info(`Viewing details for ${job.title}`);
  }

  applyForInternship(internship: any): void {
    this.toastr.success(`Applied for ${internship.title} at ${internship.company}`);
  }

  viewInternshipDetails(internship: any): void {
    this.toastr.info(`Viewing details for ${internship.title}`);
  }

  applyForApprenticeship(apprenticeship: any): void {
    this.toastr.success(`Applied for ${apprenticeship.title} at ${apprenticeship.company}`);
  }

  viewApprenticeshipDetails(apprenticeship: any): void {
    this.toastr.info(`Viewing details for ${apprenticeship.title}`);
  }

  enrollCourse(course: any): void {
    this.toastr.success(`Enrolled in ${course.title}`);
  }

  viewCourseDetails(course: any): void {
    this.toastr.info(`Viewing details for ${course.title}`);
  }

  goBack(): void {
    this.router.navigate(['/HOME/hooland-exam']);
  }

  navigateToAllJobs(): void {
    this.router.navigate(['/HOME/jobList'], {
      state: { holland_code: this.hollandCode }
    });
  }

  navigateToAllInternships(): void {
    this.router.navigate(['/HOME/intereShipList'], {
      state: { holland_code: this.hollandCode }
    });
  }

  navigateToAllApprenticeships(): void {
    this.router.navigate(['/HOME/all-apprenticeships'], {
      state: { holland_code: this.hollandCode }
    });
  }

  navigateToAllCourses(): void {
    this.router.navigate(['/HOME/courses'], {
      state: { holland_code: this.hollandCode }
    });
  }
}
