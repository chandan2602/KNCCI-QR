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
  enrollmentForm: FormGroup;
  showEnrollmentModal: boolean = false;
  enrollingCourse: any = null;
  qrCodeData: string = '';
  showQRCode: boolean = false;
  enrollmentStep: number = 1; // 1 = form, 2 = QR code, 3 = success
  editingCourse: any = null;
  isEditMode: boolean = false;

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

    // Initialize the enrollment form
    this.enrollmentForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      education: ['', Validators.required],
      experience: [''],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    this.userId = sessionStorage.getItem('UserId') || '';
    this.isLoggedIn = !!this.userId;
    
    // Use RoleId instead of USERTYPE to match the header component
    const roleId = sessionStorage.getItem('RoleId') || '';
    this.userType = roleId;
    
    // Determine user role based on RoleId
    // RoleId: 1 = Admin, 2 = Trainer, 3 = Student, 4 = Super Admin, 5 = Company/Employer
    this.isAdmin = roleId === '1' || roleId === '2'; // Both Admin and Trainer can manage courses
    this.isSuperAdmin = roleId === '4';
    this.isStudent = roleId === '3' || roleId === '5'; // Student or other non-admin roles
    
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
    
    // Get enrolled courses from localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const userEnrolledCourseIds = enrolledCourses
      .filter((e: any) => e.userId === this.userId)
      .map((e: any) => e.courseId);
    
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
            
            // Check if user is enrolled in this course
            const isEnrolled = userEnrolledCourseIds.includes(course.id);
            
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
              status: isEnrolled ? 'Enrolled' : (course.status || 'Active'),
              level: course.level,
              applied: isEnrolled || course.is_active || false,
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
    
    // User is logged in, fetch user details and show enrollment form
    this.enrollingCourse = course;
    this.enrollmentStep = 1;
    this.showQRCode = false;
    
    // Fetch user details from API or session storage
    this.loadUserDetailsForEnrollment();
    
    // Open modal
    this.showEnrollmentModal = true;
    setTimeout(() => {
      const modalElement = document.getElementById('enrollmentModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }

  loadUserDetailsForEnrollment() {
    // First, try to get userDetails JSON object from sessionStorage
    const userDetailsStr = sessionStorage.getItem('userDetails');
    let userDetails: any = null;
    
    if (userDetailsStr) {
      try {
        userDetails = JSON.parse(userDetailsStr);
        console.log('=== User Details from sessionStorage ===');
        console.log('Parsed userDetails:', userDetails);
      } catch (e) {
        console.error('Error parsing userDetails:', e);
      }
    }
    
    // Get data from userDetails object or individual sessionStorage keys
    const firstName = userDetails?.FIRSTNAME 
      || sessionStorage.getItem('FIRSTNAME') 
      || sessionStorage.getItem('FirstName') 
      || '';
      
    const lastName = userDetails?.LASTNAME 
      || sessionStorage.getItem('LASTNAME') 
      || sessionStorage.getItem('LastName') 
      || '';
      
    const userName = userDetails?.USERNAME 
      || sessionStorage.getItem('USERNAME') 
      || sessionStorage.getItem('Email')
      || '';
      
    const mobileNo = userDetails?.MobileNo 
      || sessionStorage.getItem('MobileNo') 
      || sessionStorage.getItem('Phone')
      || '';
    
    // Build full name
    let fullName = '';
    if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`.trim();
    } else if (firstName) {
      fullName = firstName.trim();
    } else if (lastName) {
      fullName = lastName.trim();
    }
    
    console.log('=== Extracted Values ===');
    console.log('FIRSTNAME:', firstName);
    console.log('LASTNAME:', lastName);
    console.log('USERNAME (email):', userName);
    console.log('MobileNo:', mobileNo);
    console.log('Full Name (computed):', fullName);
    
    // Populate form with user data
    this.enrollmentForm.patchValue({
      full_name: fullName,
      email: userName,
      phone: mobileNo,
      address: ''
    });
    
    console.log('Form after patch:', this.enrollmentForm.value);
  }

  submitEnrollment() {
    if (this.enrollmentForm.valid && this.enrollingCourse) {
      this.isLoading = true;
      
      const enrollmentData = {
        ...this.enrollmentForm.value,
        course_id: this.enrollingCourse.id,
        course_name: this.enrollingCourse.courseName,
        user_id: this.userId,
        amount: this.enrollingCourse.price,
        enrollment_date: new Date().toISOString(),
        payment_status: 'Pending'
      };
      
      // Simulate enrollment processing
      setTimeout(() => {
        this.isLoading = false;
        // Show payment QR code step
        this.qrCodeData = this.generateQRCodeData(enrollmentData);
        this.enrollmentStep = 2;
        this.showQRCode = true;
      }, 1000);
      
      /* Uncomment when API is ready:
      this.commonService.enrollCourse(enrollmentData).subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response && response.status) {
            this.qrCodeData = this.generateQRCodeData(enrollmentData);
            this.enrollmentStep = 2;
            this.showQRCode = true;
          } else {
            alert('Enrollment failed: ' + (response?.message || 'Unknown error'));
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error enrolling in course:', error);
          alert('Error enrolling in course. Please try again.');
        }
      );
      */
    } else {
      alert('Please fill in all required fields.');
    }
  }

  generateQRCodeData(enrollmentData: any): string {
    // Generate QR code data for payment
    // This could be a payment URL or payment details in JSON format
    const paymentData = {
      amount: enrollmentData.amount,
      course: enrollmentData.course_name,
      student: enrollmentData.full_name,
      email: enrollmentData.email,
      reference: `COURSE-${enrollmentData.course_id}-${enrollmentData.user_id}-${Date.now()}`
    };
    
    // Return as JSON string for QR code
    return JSON.stringify(paymentData);
  }

  confirmPayment() {
    // Mark enrollment as complete
    this.enrollmentStep = 3;
    
    // Update course status
    if (this.enrollingCourse) {
      this.enrollingCourse.status = 'Enrolled';
      this.enrollingCourse.applied = true;
      
      // Store enrolled course in localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      const enrollmentRecord = {
        courseId: this.enrollingCourse.id,
        userId: this.userId,
        enrollmentDate: new Date().toISOString(),
        paymentStatus: 'Pending'
      };
      
      // Check if already enrolled
      const alreadyEnrolled = enrolledCourses.find(
        (e: any) => e.courseId === this.enrollingCourse.id && e.userId === this.userId
      );
      
      if (!alreadyEnrolled) {
        enrolledCourses.push(enrollmentRecord);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      }
    }
    
    // Close modal after 2 seconds
    setTimeout(() => {
      this.closeEnrollmentModal();
      // Reload courses to reflect changes
      this.loadCourses();
    }, 2000);
  }

  closeEnrollmentModal() {
    const modalElement = document.getElementById('enrollmentModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.showEnrollmentModal = false;
    this.enrollingCourse = null;
    this.enrollmentStep = 1;
    this.showQRCode = false;
    this.enrollmentForm.reset();
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
    // Reset to add mode
    this.isEditMode = false;
    this.editingCourse = null;
    
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
    if (this.isEditMode) {
      // Update existing course
      this.updateCourse();
    } else {
      // Add new course
      this.addNewCourse();
    }
  }

  addNewCourse() {
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
    // Set edit mode and populate form with course data
    this.isEditMode = true;
    this.editingCourse = course;
    
    // Populate the form with existing course data
    this.addCourseForm.patchValue({
      course_name: course.courseName,
      description: course.description,
      category: course.category,
      duration: course.duration,
      price: course.price,
      instructor: course.instructor,
      start_date: course.startDate,
      end_date: course.endDate,
      level: course.level,
      students: course.students,
      rating: course.rating,
      image: course.image
    });
    
    // Open the modal
    setTimeout(() => {
      const modalElement = document.getElementById('addCourseModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }

  updateCourse() {
    if (this.addCourseForm.valid && this.editingCourse) {
      this.isLoading = true;
      
      const courseData = {
        id: this.editingCourse.id,
        course_name: this.addCourseForm.value.course_name,
        description: this.addCourseForm.value.description,
        category: this.addCourseForm.value.category,
        duration: this.addCourseForm.value.duration,
        price: this.addCourseForm.value.price,
        instructor: this.addCourseForm.value.instructor,
        start_date: this.addCourseForm.value.start_date,
        end_date: this.addCourseForm.value.end_date,
        level: this.addCourseForm.value.level,
        students: this.addCourseForm.value.students,
        rating: this.addCourseForm.value.rating,
        image: this.addCourseForm.value.image || 'assets/new-images/pg.jpg'
      };
      
      this.commonService.updateCourse(courseData).subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response && response.status) {
            alert('Course updated successfully!');
            
            // Close modal
            const modalElement = document.getElementById('addCourseModal');
            if (modalElement) {
              const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
              modal?.hide();
            }
            
            // Reset edit mode
            this.isEditMode = false;
            this.editingCourse = null;
            
            // Reload courses
            this.loadCourses();
          } else {
            alert('Failed to update course: ' + (response?.message || 'Unknown error'));
          }
        },
        (error) => {
          this.isLoading = false;
          console.error('Error updating course:', error);
          alert('Error updating course. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

}
