import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';

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
  isLoading: boolean = false;
  userType: string = '';
  isStudent: boolean = false;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  addCourseForm: FormGroup;

  allCourses: any[] = [];

  constructor(
    private router: Router, 
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    // Initialize the add course form
    this.addCourseForm = this.fb.group({
      course_name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
      instructor: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      level: ['Beginner', Validators.required],
      students: [0],
      rating: [0],
      image: ['']
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    this.userId = sessionStorage.getItem('UserId') || '';
    this.isLoggedIn = !!this.userId;
    this.userType = sessionStorage.getItem('USERTYPE') || '';
    
    // Determine user role
    // Assuming USERTYPE: 24 = Admin, 1 = Super Admin, others = Student
    this.isAdmin = this.userType === '24';
    this.isSuperAdmin = this.userType === '1';
    this.isStudent = !this.isAdmin && !this.isSuperAdmin && this.isLoggedIn;
    
    // Set default tab based on user type
    if (this.isAdmin) {
      this.activeTab = 'list'; // Course List for admin
    } else if (this.isSuperAdmin) {
      this.activeTab = 'applications'; // Course Applications for super admin
    } else {
      this.activeTab = 'all'; // All Courses for students
    }
    
    // Load courses from API
    this.loadCourses();
    
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

  loadCourses(): void {
    this.isLoading = true;
    this.commonService.getCoursesList().subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('=== loadCourses Response ===');
        console.log('Full response:', response);
        console.log('Response status:', response?.status);
        console.log('Response data:', response?.data);
        
        if (response && response.status && response.data) {
          // Map all courses from API
          const mappedCourses = response.data.map((course: any) => {
            console.log('Course approval status:', course.course_approval_status, 'for course:', course.course_name);
            return {
              id: course.id,
              courseName: course.course_name,
              description: course.description,
              image: course.image || 'assets/new-images/pg.jpg',
              category: course.category,
              duration: course.duration,
              students: course.students || 0,
              rating: course.rating || 0,
              price: course.price,
              instructor: course.instructor,
              startDate: course.start_date,
              endDate: course.end_date,
              status: course.status || 'Active',
              level: course.level,
              applied: course.is_active || false,
              // API returns course_approval_status (with underscore)
              approvalStatus: course.course_approval_status || course.approval_status || 'Pending'
            };
          });

          console.log('Mapped courses:', mappedCourses);
          console.log('Current tab:', this.activeTab);
          console.log('Is Admin:', this.isAdmin);
          console.log('Is Student:', this.isStudent);

          // Filter courses based on user role and active tab
          if (this.isAdmin && this.activeTab === 'list') {
            // Course List: Show only APPROVED courses
            this.allCourses = mappedCourses.filter((c: any) => c.approvalStatus === 'Approved');
            console.log('Filtered for Course List (Approved only):', this.allCourses.length);
          } else if (this.isAdmin && this.activeTab === 'schedule') {
            // Course Schedule: Show ALL courses (Pending, Approved, Rejected)
            this.allCourses = mappedCourses;
            console.log('Course Schedule (All courses):', this.allCourses.length);
          } else if (this.isStudent || !this.isLoggedIn) {
            // Students: Show only APPROVED courses
            this.allCourses = mappedCourses.filter((c: any) => c.approvalStatus === 'Approved');
            console.log('Filtered for Students (Approved only):', this.allCourses.length);
          } else {
            // Default: Show all courses
            this.allCourses = mappedCourses;
            console.log('Default (All courses):', this.allCourses.length);
          }
        } else {
          console.error('Failed to load courses:', response?.message);
          this.allCourses = [];
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading courses:', error);
        this.allCourses = [];
      }
    );
  }

  setActiveTab(tab: string) {
    // Only allow tab change based on user role
    if (this.isStudent && !['all', 'applied', 'ai', 'my'].includes(tab)) {
      return;
    }
    if (this.isAdmin && !['list', 'schedule', 'applications'].includes(tab)) {
      return;
    }
    if (this.isSuperAdmin && !['applications'].includes(tab)) {
      return;
    }
    this.activeTab = tab;
    this.currentPage = 1;
    this.showDetails = false;
    
    // Reload courses when switching tabs to apply correct filters
    if (this.isAdmin && (tab === 'list' || tab === 'schedule')) {
      this.loadCourses();
    }
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

  openAddCourseModal() {
    // Reset form
    this.addCourseForm.reset({
      level: 'Beginner',
      students: 0,
      rating: 0
    });
    
    // Open modal using Bootstrap
    const modalElement = document.getElementById('addCourseModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveCourse() {
    if (this.addCourseForm.valid) {
      this.isLoading = true;
      const courseData = this.addCourseForm.value;
      
      this.commonService.addCourse(courseData).subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response && response.status) {
            alert('Course added successfully! It will appear in Course Schedule with Pending status. Waiting for Super Admin approval.');
            
            // Close modal
            const modalElement = document.getElementById('addCourseModal');
            if (modalElement) {
              const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
              modal?.hide();
            }
            
            // Switch to schedule tab to show the newly added course
            this.activeTab = 'schedule';
            
            // Reload courses
            this.loadCourses();
          } else {
            alert('Failed to add course: ' + (response?.message || 'Unknown error'));
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error adding course:', error);
          alert('Error adding course. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

  editCourse(course: any) {
    // Navigate to edit course page or open edit modal
    this.router.navigate(['/HOME/edit-course', course.id]);
  }

}
