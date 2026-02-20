import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apprenticeships-applications',
  templateUrl: './apprenticeships-applications.component.html',
  styleUrls: ['./apprenticeships-applications.component.css']
})
export class ApprenticeshipsApplicationsComponent implements OnInit {

  applicationsList = [
    {
      id: 1,
      programName: 'Software Development Apprenticeship',
      company: 'Tech Solutions Kenya',
      studentName: 'Timothy Ochoa',
      appliedDate: '08-10-2025',
      closingDate: '31-10-2025',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '05-10-2025',
      registrationEndDate: '31-10-2025',
      internshipStartDate: '08-10-2025',
      internshipEndDate: '31-10-2025',
      aboutInternship: 'Learn full-stack web development with hands-on projects and mentorship from experienced developers. This apprenticeship covers HTML, CSS, JavaScript, Angular, and backend technologies.',
      whoCanApply: 'HTML, CSS, JAVASCRIPT, ANGULAR',
      termsOfEngagement: 'Participants must commit to the full duration of the apprenticeship. Regular attendance and active participation are mandatory.'
    },
    {
      id: 2,
      programName: 'AIML Training',
      company: 'Tech Solutions Kenya',
      studentName: 'Timothy Ochoa',
      appliedDate: '30-08-2026',
      closingDate: '18-09-2026',
      comments: 'APPROVED',
      status: 'Approved',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '25-08-2026',
      registrationEndDate: '18-09-2026',
      internshipStartDate: '30-08-2026',
      internshipEndDate: '18-09-2026',
      aboutInternship: 'Artificial Intelligence and Machine Learning training program covering deep learning, neural networks, and practical AI applications.',
      whoCanApply: 'PYTHON, MACHINE LEARNING, DATA SCIENCE',
      termsOfEngagement: 'Participants must have basic programming knowledge and commitment to complete all assignments.'
    },
    {
      id: 3,
      programName: 'Internship/2025',
      company: 'Tech Solutions Kenya',
      studentName: 'Sara Ramos',
      appliedDate: '07-10-2025',
      closingDate: '31-10-2025',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '05-10-2025',
      registrationEndDate: '31-10-2025',
      internshipStartDate: '07-10-2025',
      internshipEndDate: '31-10-2025',
      aboutInternship: 'General internship program providing exposure to various departments and business operations.',
      whoCanApply: 'BUSINESS, MANAGEMENT, ADMINISTRATION',
      termsOfEngagement: 'Full-time commitment required. Interns will be assigned to different departments for rotation.'
    },
    {
      id: 4,
      programName: 'ReactJS',
      company: 'Tech Solutions Kenya',
      studentName: 'Sara Ramos',
      appliedDate: '01-10-2025',
      closingDate: '15-10-2025',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '28-09-2025',
      registrationEndDate: '15-10-2025',
      internshipStartDate: '01-10-2025',
      internshipEndDate: '15-10-2025',
      aboutInternship: 'React.js framework training covering components, hooks, state management, and building modern web applications.',
      whoCanApply: 'JAVASCRIPT, WEB DEVELOPMENT, REACT',
      termsOfEngagement: 'Participants should have JavaScript fundamentals knowledge before joining.'
    },
    {
      id: 5,
      programName: 'AIML ATC',
      company: 'Tech Solutions Kenya',
      studentName: 'Sara Ramos',
      appliedDate: '01-10-2025',
      closingDate: '10-05-2026',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '28-09-2025',
      registrationEndDate: '10-05-2026',
      internshipStartDate: '01-10-2025',
      internshipEndDate: '10-05-2026',
      aboutInternship: 'Advanced AI and ML training with focus on real-world applications and industry best practices.',
      whoCanApply: 'ADVANCED PYTHON, TENSORFLOW, KERAS',
      termsOfEngagement: 'Participants must complete all projects and maintain minimum 80% attendance.'
    },
    {
      id: 6,
      programName: 'HR',
      company: 'Tech Solutions Kenya',
      studentName: 'Kimoshy K',
      appliedDate: '31-07-2025',
      closingDate: '09-08-2025',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '28-07-2025',
      registrationEndDate: '09-08-2025',
      internshipStartDate: '31-07-2025',
      internshipEndDate: '09-08-2025',
      aboutInternship: 'Human Resources apprenticeship covering recruitment, employee relations, and HR administration.',
      whoCanApply: 'HR, BUSINESS ADMINISTRATION, COMMUNICATION',
      termsOfEngagement: 'Interns will work on real HR projects and assist in recruitment processes.'
    },
    {
      id: 7,
      programName: 'Sito Eng',
      company: 'Tech Solutions Kenya',
      studentName: 'Kimoshy K',
      appliedDate: '31-07-2025',
      closingDate: '10-08-2025',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '28-07-2025',
      registrationEndDate: '10-08-2025',
      internshipStartDate: '31-07-2025',
      internshipEndDate: '10-08-2025',
      aboutInternship: 'Site Engineering apprenticeship with hands-on experience in construction and project management.',
      whoCanApply: 'ENGINEERING, CONSTRUCTION, PROJECT MANAGEMENT',
      termsOfEngagement: 'Safety compliance is mandatory. Participants must wear appropriate safety gear.'
    },
    {
      id: 8,
      programName: 'Python Dev Intern',
      company: 'Tech Solutions Kenya',
      studentName: 'DSTD',
      appliedDate: '21-07-2025',
      closingDate: '24-08-2025',
      comments: 'PENDING',
      status: 'Pending',
      companyEmail: 'info@techsolutions.com',
      companyContact: '0712345678',
      registrationStartDate: '18-07-2025',
      registrationEndDate: '24-08-2025',
      internshipStartDate: '21-07-2025',
      internshipEndDate: '24-08-2025',
      aboutInternship: 'Python development internship covering backend development, databases, and API creation.',
      whoCanApply: 'PYTHON, BACKEND DEVELOPMENT, DATABASES',
      termsOfEngagement: 'Participants will work on real projects and contribute to production code.'
    }
  ];

  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  filterStatus: string = 'All';
  viewMode: string = 'list'; // 'list' or 'details'
  selectedApplication: any = null;

  constructor() { }

  ngOnInit(): void {
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
        item.programName?.toLowerCase().includes(search) ||
        item.company?.toLowerCase().includes(search) ||
        item.studentName?.toLowerCase().includes(search)
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
    application.comments = 'APPROVED';
    alert(`Application approved for ${application.studentName}`);
  }

  rejectApplication(application: any) {
    application.status = 'Rejected';
    application.comments = 'REJECTED';
    alert(`Application rejected for ${application.studentName}`);
  }
}
