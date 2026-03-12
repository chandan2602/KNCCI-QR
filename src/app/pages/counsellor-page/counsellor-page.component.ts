import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CounselorService, DashboardStats } from '../../services/consullor.services';
import { CounsellorHeaderComponent } from '../counsellor/counsellor-header.component';

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
  imports: [CommonModule, CounsellorHeaderComponent],
  templateUrl: './counsellor-page.component.html',
  styleUrls: ['./counsellor-page.component.css']
})
export class CounsellorPageComponent implements OnInit {
  
  isLoading = true;
  dashboardData: DashboardData = {
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    pendingApplications: 0,
    urgentApplications: 0,
    approvedStudents: 0,
    approvedThisMonth: 0,
    scheduledCalls: 0,
    completedSessions: 0,
    studentFeedbackCount: 0,
    applicationStats: {
      all: 0,
      pending: 0,
      documentUpload: 0,
      approved: 0
    }
  };

  constructor(
    private router: Router,
    private loginService: LoginService,
    private counselorService: CounselorService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Load dashboard data from API
   */
  loadDashboardData(): void {
    this.isLoading = true;
    
    this.counselorService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        console.log('Dashboard stats loaded:', stats);
        
        // Map API response to dashboard data
        this.dashboardData = {
          totalStudents: stats.total_students || stats.total_applications || 0,
          activeStudents: stats.active_students || 0,
          inactiveStudents: stats.inactive_students || 0,
          pendingApplications: stats.pending_review || 0,
          urgentApplications: stats.urgent_applications || 0,
          approvedStudents: stats.approved || 0,
          approvedThisMonth: stats.approved_this_month || 0,
          scheduledCalls: stats.scheduled_calls || 0,
          completedSessions: stats.completed_sessions || 0,
          studentFeedbackCount: stats.student_feedback_count || 0,
          applicationStats: {
            all: stats.total_applications || 0,
            pending: stats.pending_review || 0,
            documentUpload: stats.document_review || 0,
            approved: stats.approved || 0
          }
        };
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load dashboard stats:', error);
        
        // Show error message but keep default values
        alert('Failed to load dashboard statistics. Please refresh the page.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData();
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
   * Logout counselor and redirect to login page
   */
  logout(): void {
    console.log('Logging out counselor...');
    this.loginService.counselorLogout();
  }
}