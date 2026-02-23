import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kncci-courses',
  templateUrl: './kncci-courses.component.html',
  styleUrls: ['./kncci-courses.component.css']
})
export class KncciCoursesComponent implements OnInit {

  activeTab: string = 'all';
  selectedCourse: any = null;
  showDetails: boolean = false;
  searchText: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  isLoggedIn: boolean = false;
  userId: string = '';

  allCourses = [
    {
      id: 1,
      courseName: 'Digital Marketing Fundamentals',
      description: 'Master the essentials of digital marketing including SEO, social media, and content marketing strategies. Learn how to create effective digital campaigns, analyze metrics, and optimize your online presence.',
      image: 'assets/new-images/pg.jpg',
      category: 'Marketing',
      duration: '8 Weeks',
      students: 245,
      rating: 4.8,
      price: '15,000',
      instructor: 'Jane Kamau',
      startDate: '2026-03-15',
      endDate: '2026-05-10',
      status: 'Active',
      level: 'Beginner',
      applied: false
    },
    {
      id: 2,
      courseName: 'Web Development Bootcamp',
      description: 'Learn full-stack web development with HTML, CSS, JavaScript, and modern frameworks. Build responsive websites and web applications from scratch.',
      image: 'assets/new-images/ProgrammingLanguages.jpeg',
      category: 'Technology',
      duration: '12 Weeks',
      students: 189,
      rating: 4.9,
      price: '25,000',
      instructor: 'John Ochieng',
      startDate: '2026-03-20',
      endDate: '2026-06-15',
      status: 'Active',
      level: 'Intermediate',
      applied: false
    },
    {
      id: 3,
      courseName: 'Business Management Essentials',
      description: 'Develop core business management skills including leadership, strategy, and operations. Perfect for aspiring managers and entrepreneurs.',
      image: 'assets/new-images/pg.jpg',
      category: 'Business',
      duration: '6 Weeks',
      students: 312,
      rating: 4.7,
      price: '18,000',
      instructor: 'Mary Wanjiru',
      startDate: '2026-03-10',
      endDate: '2026-04-25',
      status: 'Active',
      level: 'Beginner',
      applied: true
    },
    {
      id: 4,
      courseName: 'Artificial Intelligence Fundamentals',
      description: 'Introduction to AI concepts, machine learning algorithms, neural networks, and practical applications in various industries.',
      image: 'assets/new-images/artificial_intelligence.jpg',
      category: 'AI',
      duration: '10 Weeks',
      students: 156,
      rating: 4.8,
      price: '22,000',
      instructor: 'David Mwangi',
      startDate: '2026-04-01',
      endDate: '2026-06-10',
      status: 'Active',
      level: 'Advanced',
      applied: false
    },
    {
      id: 5,
      courseName: 'Machine Learning with Python',
      description: 'Deep dive into machine learning algorithms, data preprocessing, model training, and deployment using Python and popular ML libraries.',
      image: 'assets/new-images/machine_learning.jpg',
      category: 'AI',
      duration: '12 Weeks',
      students: 198,
      rating: 4.9,
      price: '28,000',
      instructor: 'Sarah Akinyi',
      startDate: '2026-03-25',
      endDate: '2026-06-20',
      status: 'Enrolled',
      level: 'Advanced',
      applied: true
    },
    {
      id: 6,
      courseName: 'Financial Management for SMEs',
      description: 'Learn essential financial management skills for small and medium enterprises including budgeting, forecasting, and financial analysis.',
      image: 'assets/new-images/pg.jpg',
      category: 'Finance',
      duration: '6 Weeks',
      students: 267,
      rating: 4.7,
      price: '17,000',
      instructor: 'Peter Kimani',
      startDate: '2026-03-18',
      endDate: '2026-05-01',
      status: 'Active',
      level: 'Intermediate',
      applied: false
    },
    {
      id: 7,
      courseName: 'Mobile App Development',
      description: 'Build native mobile applications for Android and iOS platforms using modern development tools and frameworks.',
      image: 'assets/new-images/ProgrammingLanguages.jpeg',
      category: 'Technology',
      duration: '14 Weeks',
      students: 134,
      rating: 4.9,
      price: '28,000',
      instructor: 'Grace Njeri',
      startDate: '2026-04-05',
      endDate: '2026-07-10',
      status: 'Active',
      level: 'Advanced',
      applied: true
    },
    {
      id: 8,
      courseName: 'Deep Learning & Neural Networks',
      description: 'Advanced course on deep learning architectures, convolutional neural networks, recurrent networks, and transformer models.',
      image: 'assets/new-images/artificial_intelligence.jpg',
      category: 'AI',
      duration: '10 Weeks',
      students: 223,
      rating: 4.8,
      price: '30,000',
      instructor: 'James Otieno',
      startDate: '2026-04-10',
      endDate: '2026-06-20',
      status: 'Enrolled',
      level: 'Advanced',
      applied: true
    },
    {
      id: 9,
      courseName: 'Content Writing & Copywriting',
      description: 'Develop professional writing skills for web content, blogs, and marketing copy. Learn SEO writing and content strategy.',
      image: 'assets/new-images/pg.jpg',
      category: 'Marketing',
      duration: '6 Weeks',
      students: 178,
      rating: 4.5,
      price: '14,000',
      instructor: 'Lucy Wambui',
      startDate: '2026-03-22',
      endDate: '2026-05-05',
      status: 'Active',
      level: 'Beginner',
      applied: false
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Check if user is logged in
    this.userId = sessionStorage.getItem('UserId') || '';
    this.isLoggedIn = !!this.userId;
    
    // If not logged in, force "all" tab
    if (!this.isLoggedIn) {
      this.activeTab = 'all';
    }
    
    // Check if user just logged in to enroll in a course
    const enrollCourseId = sessionStorage.getItem('enrollCourseId');
    if (this.isLoggedIn && enrollCourseId) {
      // Find the course and show enrollment
      const courseId = parseInt(enrollCourseId);
      const course = this.allCourses.find(c => c.id === courseId);
      if (course) {
        // Clear the stored course ID
        sessionStorage.removeItem('enrollCourseId');
        // Show the course details
        this.viewDetails(course);
        // Optionally auto-trigger enrollment
        setTimeout(() => {
          this.enrollCourse(course);
        }, 500);
      }
    }
  }

  setActiveTab(tab: string) {
    // Only allow tab change if logged in
    if (!this.isLoggedIn && tab !== 'all') {
      return;
    }
    this.activeTab = tab;
    this.currentPage = 1;
    this.showDetails = false;
  }

  get filteredCourses() {
    let courses = this.allCourses;
    
    // Filter by tab
    if (this.activeTab === 'applied') {
      courses = courses.filter(c => c.applied);
    } else if (this.activeTab === 'ai') {
      courses = courses.filter(c => c.category === 'AI');
    } else if (this.activeTab === 'my') {
      courses = courses.filter(c => c.status === 'Enrolled');
    }
    
    // Filter by search text
    if (this.searchText) {
      courses = courses.filter(c => 
        c.courseName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        c.instructor.toLowerCase().includes(this.searchText.toLowerCase()) ||
        c.category.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    
    return courses;
  }

  get paginatedCourses() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredCourses.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredCourses.length / this.entriesPerPage);
  }

  viewDetails(course: any) {
    this.selectedCourse = course;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCourse = null;
  }

  enrollCourse(course: any) {
    // Check if user is logged in
    if (!this.isLoggedIn) {
      // Store the course ID and current route for redirect after login
      sessionStorage.setItem('enrollCourseId', course.id.toString());
      sessionStorage.setItem('returnUrl', '/HOME/kncci-courses');
      
      // Redirect to login page
      this.router.navigate(['/login']);
      return;
    }
    
    // User is logged in, proceed with enrollment
    console.log('Enrolling in course:', course.courseName);
    alert(`Enrolling in: ${course.courseName}\nPrice: KES ${course.price}`);
    
    // Here you would typically call an API to enroll the user
    // After successful enrollment, update the course status
    course.status = 'Enrolled';
    course.applied = true;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log('Next page clicked, current page:', this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log('Previous page clicked, current page:', this.currentPage);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    console.log('Go to page clicked, current page:', this.currentPage);
  }

  testClick() {
    console.log('Test click worked!');
    alert('Button click is working!');
  }

}
