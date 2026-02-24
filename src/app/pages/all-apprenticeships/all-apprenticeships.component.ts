import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  ROLEID: string = ''; // Get from sessionStorage
  addApprenticeshipForm: FormGroup;

  apprenticeshipsList = [
    {
      id: 1,
      company: 'Tech Solutions Kenya',
      studentName: 'John Doe',
      programName: 'Software Development Apprenticeship',
      creationDate: '15-02-2026',
      closingDate: '31-03-2026',
      comments: 'PENDING',
      status: 'Active',
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
      company: 'Marketing Pro Ltd',
      studentName: 'Jane Smith',
      programName: 'Digital Marketing Apprenticeship',
      creationDate: '10-02-2026',
      closingDate: '30-04-2026',
      comments: 'APPROVED',
      status: 'Active',
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
      company: 'Power Systems Kenya',
      studentName: 'Mike Johnson',
      programName: 'Electrical Engineering Apprenticeship',
      creationDate: '05-02-2026',
      closingDate: '15-05-2026',
      comments: 'PENDING',
      status: 'Active',
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
      company: 'Financial Services Group',
      studentName: 'Sarah Williams',
      programName: 'Accounting & Finance Apprenticeship',
      creationDate: '20-02-2026',
      closingDate: '10-04-2026',
      comments: 'APPROVED',
      status: 'Active',
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
      company: 'Grand Hotel Nairobi',
      studentName: 'Emily Brown',
      programName: 'Hospitality Management Apprenticeship',
      creationDate: '25-01-2026',
      closingDate: '28-02-2026',
      comments: 'REJECTED',
      status: 'Inactive',
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

  constructor(private router: Router, private fb: FormBuilder) {
    this.addApprenticeshipForm = this.fb.group({
      category: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['Uncertified'],
      certificateName: [''],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get ROLEID from sessionStorage (same as header component - note: it's 'RoleId' not 'ROLEID')
    this.ROLEID = sessionStorage.getItem('RoleId') || '';
  }

  get filteredApprenticeships() {
    if (!this.searchTerm) {
      return this.apprenticeshipsList;
    }
    const search = this.searchTerm.toLowerCase();
    return this.apprenticeshipsList.filter(item =>
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
    this.router.navigate(['/HOME/apprenticeship-details', apprenticeship.id, { source: 'all' }]);
  }

  openAddModal() {
    this.addApprenticeshipForm.reset({
      type: 'Uncertified',
      status: 'Active'
    });
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addApprenticeshipModal'));
    modal.show();
  }

  saveApprenticeship() {
    if (this.addApprenticeshipForm.valid) {
      const newApprenticeship = {
        id: this.apprenticeshipsList.length + 1,
        programName: this.addApprenticeshipForm.get('name')?.value,
        company: 'New Company',
        duration: '12 months',
        location: 'Nairobi',
        stipend: 'KES 25,000/month',
        startDate: new Date().toLocaleDateString('en-GB'),
        creationDate: new Date().toLocaleDateString('en-GB'),
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        status: this.addApprenticeshipForm.get('status')?.value === 'Active' ? 'Active' : 'Inactive',
        image: 'assets/kncci-img/img-1.png',
        category: this.addApprenticeshipForm.get('category')?.value,
        description: this.addApprenticeshipForm.get('description')?.value,
        requirements: ['Requirement 1', 'Requirement 2']
      };

      this.apprenticeshipsList.push(newApprenticeship as any);
      
      // Close modal
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addApprenticeshipModal'));
      modal?.hide();

      // Reset form
      this.addApprenticeshipForm.reset({
        type: 'Uncertified',
        status: 'Active'
      });

      alert('Apprenticeship added successfully!');
    }
  }
}
