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
  
  apprenticeshipsList: any[] = [
    {
      id: 1,
      program_name: 'Software Development Apprenticeship',
      company: 'Tech Solutions Kenya',
      duration: '12',
      location: 'Nairobi',
      stipend: '25,000',
      start_date: '2026-04-01',
      status: 'Open',
      category: 'TECHNOLOGY',
      image: 'assets/kncci-img/img-1.png',
      description: 'Learn full-stack web development with hands-on projects and mentorship from experienced developers.',
      requirements: [
        'Basic knowledge of programming',
        'Diploma or Degree in Computer Science or related field',
        'Good communication skills',
        'Passion for technology'
      ]
    },
    {
      id: 2,
      program_name: 'Digital Marketing Apprenticeship',
      company: 'Marketing Pro Ltd',
      duration: '6',
      location: 'Mombasa',
      stipend: '20,000',
      start_date: '2026-03-15',
      status: 'Open',
      category: 'MARKETING',
      image: 'assets/kncci-img/img-2.png',
      description: 'Gain practical experience in SEO, social media marketing, content creation, and digital advertising.',
      requirements: [
        'Certificate or Diploma in Marketing',
        'Social media savvy',
        'Creative thinking',
        'Basic graphic design skills'
      ]
    },
    {
      id: 3,
      program_name: 'Electrical Engineering Apprenticeship',
      company: 'Power Systems Kenya',
      duration: '18',
      location: 'Kisumu',
      stipend: '30,000',
      start_date: '2026-05-01',
      status: 'Open',
      category: 'ENGINEERING',
      image: 'assets/kncci-img/img-3.png',
      description: 'Work on real electrical installations and maintenance projects under the guidance of certified engineers.',
      requirements: [
        'Diploma in Electrical Engineering',
        'Understanding of electrical systems',
        'Safety consciousness',
        'Physical fitness'
      ]
    },
    {
      id: 4,
      program_name: 'Accounting & Finance Apprenticeship',
      company: 'Financial Services Group',
      duration: '12',
      location: 'Nairobi',
      stipend: '28,000',
      start_date: '2026-04-10',
      status: 'Open',
      category: 'FINANCE',
      image: 'assets/kncci-img/img-4.png',
      description: 'Learn bookkeeping, financial reporting, tax preparation, and auditing in a professional environment.',
      requirements: [
        'CPA Part I or equivalent',
        'Strong numerical skills',
        'Attention to detail',
        'Proficiency in MS Excel'
      ]
    },
    {
      id: 5,
      program_name: 'Hospitality Management Apprenticeship',
      company: 'Grand Hotel Nairobi',
      duration: '9',
      location: 'Nairobi',
      stipend: '22,000',
      start_date: '2026-03-01',
      status: 'Closed',
      category: 'HOSPITALITY',
      image: 'assets/kncci-img/img-5.png',
      description: 'Rotate through various hotel departments including front desk, housekeeping, and food & beverage.',
      requirements: [
        'Diploma in Hotel Management',
        'Excellent customer service skills',
        'Professional appearance',
        'Flexibility with working hours'
      ]
    },
    {
      id: 6,
      program_name: 'Mechanical Engineering Apprenticeship',
      company: 'Manufacturing Industries Ltd',
      duration: '24',
      location: 'Thika',
      stipend: '32,000',
      start_date: '2026-06-01',
      status: 'Open',
      category: 'ENGINEERING',
      image: 'assets/kncci-img/img-6.jpg',
      description: 'Hands-on training in machine operation, maintenance, and manufacturing processes.',
      requirements: [
        'Diploma in Mechanical Engineering',
        'Technical drawing skills',
        'Problem-solving abilities',
        'Teamwork skills'
      ]
    },
    {
      id: 7,
      program_name: 'Graphic Design Apprenticeship',
      company: 'Creative Studio Kenya',
      duration: '6',
      location: 'Nairobi',
      stipend: '18,000',
      start_date: '2026-04-15',
      status: 'Open',
      category: 'DESIGN',
      image: 'assets/kncci-img/img-7.png',
      description: 'Work on real client projects while learning advanced design techniques and software.',
      requirements: [
        'Certificate in Graphic Design',
        'Portfolio of work',
        'Adobe Creative Suite knowledge',
        'Creative mindset'
      ]
    },
    {
      id: 8,
      program_name: 'Data Analytics Apprenticeship',
      company: 'Data Insights Africa',
      duration: '12',
      location: 'Nairobi',
      stipend: '27,000',
      start_date: '2026-05-01',
      status: 'Open',
      category: 'TECHNOLOGY',
      image: 'assets/kncci-img/img-1.png',
      description: 'Learn data collection, analysis, visualization, and reporting using industry-standard tools.',
      requirements: [
        'Degree in Statistics, Mathematics, or related field',
        'Basic SQL knowledge',
        'Analytical thinking',
        'Excel proficiency'
      ]
    },
    {
      id: 9,
      program_name: 'Human Resources Apprenticeship',
      company: 'HR Solutions Kenya',
      duration: '9',
      location: 'Mombasa',
      stipend: '23,000',
      start_date: '2026-03-20',
      status: 'Closed',
      category: 'MANAGEMENT',
      image: 'assets/kncci-img/img-2.png',
      description: 'Gain experience in recruitment, employee relations, training, and HR administration.',
      requirements: [
        'Diploma in Human Resource Management',
        'Good interpersonal skills',
        'Confidentiality',
        'Organizational skills'
      ]
    },
    {
      id: 10,
      program_name: 'Automotive Mechanics Apprenticeship',
      company: 'Auto Care Center',
      duration: '18',
      location: 'Nakuru',
      stipend: '24,000',
      start_date: '2026-04-01',
      status: 'Open',
      category: 'ENGINEERING',
      image: 'assets/kncci-img/img-3.png',
      description: 'Learn vehicle diagnostics, repair, and maintenance from certified mechanics.',
      requirements: [
        'Certificate in Automotive Engineering',
        'Mechanical aptitude',
        'Problem-solving skills',
        'Attention to detail'
      ]
    }
  ];
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

  get filteredApprenticeships() {
    let list = this.apprenticeshipsList;
    
    if (this.searchText) {
      list = list.filter(a => 
        a.program_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        a.company?.toLowerCase().includes(this.searchText.toLowerCase()) ||
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
