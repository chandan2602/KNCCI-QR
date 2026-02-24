import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-apprenticeships',
  templateUrl: './my-apprenticeships.component.html',
  styleUrls: ['./my-apprenticeships.component.css']
})
export class MyApprenticeshipsComponent implements OnInit {
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  showReviewModal: boolean = false;
  selectedRating: number = 0;
  reviewDescription: string = '';
  selectedApprenticeship: any = null;

  myApprenticeships = [1];

  apprenticeshipsList = [
    {
      id: 1,
      programName: 'Angular/2025',
      company: 'Apple Tim Cook',
      startDate: '08-10-2025',
      endDate: '31-10-2025',
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      duration: '12 months',
      location: 'Nairobi',
      stipend: 'KES 25,000/month',
      status: 'Open',
      image: 'assets/kncci-img/img-1.png',
      category: 'Technology',
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
      programName: 'Digital Marketing Apprenticeship',
      company: 'Marketing Pro Ltd',
      duration: '6 months',
      location: 'Mombasa',
      stipend: 'KES 20,000/month',
      startDate: '15-03-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-2.png',
      category: 'Marketing',
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
      programName: 'Electrical Engineering Apprenticeship',
      company: 'Power Systems Kenya',
      duration: '18 months',
      location: 'Kisumu',
      stipend: 'KES 30,000/month',
      startDate: '01-05-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-3.png',
      category: 'Engineering',
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
      programName: 'Accounting & Finance Apprenticeship',
      company: 'Financial Services Group',
      duration: '12 months',
      location: 'Nairobi',
      stipend: 'KES 28,000/month',
      startDate: '10-04-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-4.png',
      category: 'Finance',
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
      programName: 'Hospitality Management Apprenticeship',
      company: 'Grand Hotel Nairobi',
      duration: '9 months',
      location: 'Nairobi',
      stipend: 'KES 22,000/month',
      startDate: '01-03-2026',
      status: 'Closed',
      image: 'assets/kncci-img/img-5.png',
      category: 'Hospitality',
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
      programName: 'Mechanical Engineering Apprenticeship',
      company: 'Manufacturing Industries Ltd',
      duration: '24 months',
      location: 'Thika',
      stipend: 'KES 32,000/month',
      startDate: '01-06-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-6.jpg',
      category: 'Engineering',
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
      programName: 'Graphic Design Apprenticeship',
      company: 'Creative Studio Kenya',
      duration: '6 months',
      location: 'Nairobi',
      stipend: 'KES 18,000/month',
      startDate: '15-04-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-7.png',
      category: 'Design',
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
      programName: 'Data Analytics Apprenticeship',
      company: 'Data Insights Africa',
      duration: '12 months',
      location: 'Nairobi',
      stipend: 'KES 27,000/month',
      startDate: '01-05-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-1.png',
      category: 'Technology',
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
      programName: 'Human Resources Apprenticeship',
      company: 'HR Solutions Kenya',
      duration: '9 months',
      location: 'Mombasa',
      stipend: 'KES 23,000/month',
      startDate: '20-03-2026',
      status: 'Closed',
      image: 'assets/kncci-img/img-2.png',
      category: 'Management',
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
      programName: 'Automotive Mechanics Apprenticeship',
      company: 'Auto Care Center',
      duration: '18 months',
      location: 'Nakuru',
      stipend: 'KES 24,000/month',
      startDate: '01-04-2026',
      status: 'Open',
      image: 'assets/kncci-img/img-3.png',
      category: 'Engineering',
      description: 'Learn vehicle diagnostics, repair, and maintenance from certified mechanics.',
      requirements: [
        'Certificate in Automotive Engineering',
        'Mechanical aptitude',
        'Physical stamina',
        'Problem-solving skills'
      ]
    },
    {
      id: 11,
      programName: 'Culinary Arts Apprenticeship',
      company: 'Gourmet Restaurant',
      duration: '12 months',
      location: 'Nairobi',
      stipend: 'KES 20,000/month',
      startDate: '15-05-2026',
      status: 'Open',
      description: 'Train under professional chefs and learn various cooking techniques and kitchen management.',
      requirements: [
        'Certificate in Culinary Arts',
        'Passion for cooking',
        'Creativity',
        'Ability to work under pressure'
      ]
    },
    {
      id: 12,
      programName: 'Network Administration Apprenticeship',
      company: 'IT Networks Ltd',
      duration: '12 months',
      location: 'Nairobi',
      stipend: 'KES 26,000/month',
      startDate: '01-06-2026',
      status: 'Open',
      description: 'Learn network setup, maintenance, security, and troubleshooting in enterprise environments.',
      requirements: [
        'Diploma in IT or Computer Science',
        'Basic networking knowledge',
        'CCNA certification (preferred)',
        'Problem-solving skills'
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  get filteredApprenticeships() {
    let data = this.apprenticeshipsList.filter(item => this.myApprenticeships.includes(item.id));
    
    if (!this.searchTerm) {
      return data;
    }
    const search = this.searchTerm.toLowerCase();
    return data.filter(item =>
      item.programName?.toLowerCase().includes(search) ||
      item.company?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search) ||
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
    this.selectedApprenticeship = apprenticeship;
    this.showReviewModal = true;
    this.selectedRating = 0;
    this.reviewDescription = '';
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.selectedApprenticeship = null;
    this.selectedRating = 0;
    this.reviewDescription = '';
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  submitReview() {
    if (this.selectedRating > 0 && this.reviewDescription.trim()) {
      alert('Review submitted successfully!');
      this.closeReviewModal();
    } else {
      alert('Please provide a rating and description');
    }
  }
}
