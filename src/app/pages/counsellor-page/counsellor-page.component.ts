import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

interface DashboardData {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  pendingApplications: number;
  urgentApplications: number;
  approvedStudents: number;
  approvedThisMonth: number;
  scheduledCalls: number;
  completedSessions: number;
  studentFeedbackCount: number;
  applicationStats: {
    all: number;
    pending: number;
    documentUpload: number;
    approved: number;
  };
}

@Component({
  selector: 'app-counsellor-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counsellor-page.component.html',
  styleUrls: ['./counsellor-page.component.css']
})
export class CounsellorPageComponent implements OnInit {
  
  isLoading = true;
  dashboardData: DashboardData = {
    totalStudents: 164,
    activeStudents: 142,
    inactiveStudents: 22,
    pendingApplications: 42,
    urgentApplications: 8,
    approvedStudents: 78,
    approvedThisMonth: 15,
    scheduledCalls: 10,
    completedSessions: 35,
    studentFeedbackCount: 12,
    applicationStats: {
      all: 164,
      pending: 42,
      documentUpload: 25,
      approved: 78
    }
  };

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load dashboard data from API
   * Currently using dummy data, replace with actual API call
   */
  loadDashboardData(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // In real implementation, replace with:
      // this.counsellorService.getDashboardData().subscribe(data => {
      //   this.dashboardData = data;
      //   this.isLoading = false;
      // });
      
      this.isLoading = false;
    }, 1500);
  }

  /**
   * Navigate to applications view (detailed counselor dashboard)
   */
  viewApplications(): void {
    console.log('Navigating to detailed counselor dashboard...');
    this.router.navigate(['/counselor-dashboard']);
  }

  /**
   * Open schedule call dialog/page
   */
  scheduleCall(): void {
    console.log('Opening schedule call dialog...');
    // Implementation for scheduling calls
  }

  /**
   * Open counselling notes dialog/page
   */
  addCounsellingNotes(): void {
    console.log('Opening counselling notes dialog...');
    // Implementation for adding notes
  }

  /**
   * Navigate to student profile view
   */
  viewStudentProfile(): void {
    console.log('Navigating to student profile...');
    // this.router.navigate(['/counsellor/student-profile']);
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  /**
   * Logout counselor and redirect to login page
   */
  logout(): void {
    console.log('Logging out counselor...');
    this.loginService.counselorLogout();
  }
}