import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CounselorService, ApiApplicationData } from 'src/app/services/consullor.services';
import { ApplicationData } from 'src/app/pages/application-reg/application-flow.component';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-counselor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counselor-dashboard.component.html',
  styleUrls: ['./counselor-dashboard.component.css']
})
export class CounselorDashboardComponent implements OnInit {
  applications: ApplicationData[] = [];
  selectedApplication: ApplicationData | null = null;
  isLoading = false;
  counselorNotes = '';
  activeTab: 'all' | 'pending' | 'documents' | 'approved' = 'all';
  searchEmail = '';
  dashboardStats: any = null;

  constructor(
    private applicationService: CounselorService,
    private router: Router,
    private loginService: LoginService
  ) {}

  async ngOnInit() {
    console.log('CounselorDashboardComponent initialized');
    console.log('Environment counselorApiUrl:', environment.counselorApiUrl);
    await this.loadApplications();
    await this.loadDashboardStats();
  }

  async refreshApplications() {
    console.log('Refreshing applications from API...');
    await this.loadApplications();
    await this.loadDashboardStats();
  }

  async testApiConnection() {
    console.log('Testing API connection...');
    console.log('Service being used:', this.applicationService.constructor.name);
    this.isLoading = true;
    
    this.applicationService.getAllApplications().subscribe({
      next: (applications) => {
        console.log('✅ API Connection successful!');
        console.log('📊 Received applications:', applications);
        alert(`API Connection successful! Loaded ${applications.length} applications.`);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ API Connection failed:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        let errorMessage = 'API Connection failed: ';
        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Check if the backend is running and CORS is configured.';
        } else if (error.status === 404) {
          errorMessage += 'API endpoint not found (404). Check the URL configuration.';
        } else if (error.status === 500) {
          errorMessage += 'Server error (500). Check backend logs.';
        } else {
          errorMessage += `${error.status} - ${error.statusText || error.message || 'Unknown error'}`;
        }
        
        alert(errorMessage);
        this.isLoading = false;
      }
    });
  }

  async loadApplications() {
    this.isLoading = true;
    try {
      this.applicationService.getAllApplications().subscribe({
        next: (applications: ApiApplicationData[]) => {
          console.log('Loaded applications from API:', applications);
          
          const transformedApps = applications.map(app => ({
            id: app.id?.toString() || '',
            personalInfo: {
              firstName: app.name?.split(' ')[0] || '',
              lastName: app.name?.split(' ').slice(1).join(' ') || '',
              email: app.email || '',
              phone: app.mobile || '',
              address: app.address || '',
              dateOfBirth: app.date_of_birth || ''
            },
            userType: app.user_type || '',
            companyName: app.company_name || '',
            qualification: app.qualification || '',
            appointmentDate: app.appointment_date || '',
            slot: app.slot || '',
            status: this.mapApiStatusToAppStatus(app.status),
            counselorNotes: app.counselor_notes || '',
            paymentAmount: app.payment_amount || 0,
            documents: this.createDocumentObjects(app),
            createdAt: new Date(app.created_at),
            updatedAt: new Date(app.updated_at)
          }));
          
          this.applications = transformedApps;
          console.log('Transformed applications:', transformedApps);
        },
        error: (error) => {
          console.error('Failed to load applications from API:', error);
          alert('Failed to load applications from server. Using demo data.');
          this.initializeStaticData();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to load applications:', error);
      this.initializeStaticData();
      this.isLoading = false;
    }
  }

  private mapApiStatusToAppStatus(apiStatus: string): ApplicationData['status'] {
    switch (apiStatus.toLowerCase()) {
      case 'form_submitted':
      case 'form-submitted':
        return 'form-submitted';
      case 'counselor_approved':
      case 'counselor-approved':
        return 'counselor-approved';
      case 'documents_requested':
      case 'documents-requested':
        return 'documents-requested';
      case 'documents_uploaded':
      case 'documents-uploaded':
        return 'documents-uploaded';
      case 'documents_verified':
      case 'documents-verified':
        return 'documents-verified';
      case 'payment_requested':
      case 'payment-requested':
        return 'payment-requested';
      case 'payment_completed':
      case 'payment-completed':
        return 'payment-completed';
      case 'rejected':
        return 'rejected';
      default:
        return 'form-submitted';
    }
  }

  private createDocumentObjects(app: ApiApplicationData): { document1?: File; document2?: File; document3?: File; } | undefined {
    if (!app.document1_name && !app.document2_name && !app.document3_name) {
      return undefined;
    }

    const documents: { document1?: File; document2?: File; document3?: File; } = {};
    
    if (app.document1_name) {
      documents.document1 = new File([''], app.document1_name, { type: 'application/pdf' });
    }
    if (app.document2_name) {
      documents.document2 = new File([''], app.document2_name, { type: 'application/pdf' });
    }
    if (app.document3_name) {
      documents.document3 = new File([''], app.document3_name, { type: 'application/pdf' });
    }

    return documents;
  }

  async loadDashboardStats() {
    try {
      this.applicationService.getDashboardStats().subscribe({
        next: (stats) => {
          console.log('Dashboard stats loaded from API:', stats);
          this.dashboardStats = stats;
        },
        error: (error) => {
          console.error('Failed to load dashboard stats from API:', error);
          // Stats will be calculated from loaded applications instead
        }
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  }

  // Search application by email
  searchApplicationByEmail() {
    if (!this.searchEmail.trim()) {
      alert('Please enter an email address to search');
      return;
    }

    this.isLoading = true;
    this.applicationService.searchByEmail(this.searchEmail.trim()).subscribe({
      next: (application) => {
        console.log('Found application:', application);
        
        // Transform the single application
        const transformedApp = {
          id: application.id?.toString() || '',
          personalInfo: {
            firstName: application.name?.split(' ')[0] || '',
            lastName: application.name?.split(' ').slice(1).join(' ') || '',
            email: application.email || '',
            phone: application.mobile || '',
            address: application.address || '',
            dateOfBirth: application.date_of_birth || ''
          },
          userType: application.user_type || '',
          companyName: application.company_name || '',
          qualification: application.qualification || '',
          appointmentDate: application.appointment_date || '',
          slot: application.slot || '',
          status: this.mapApiStatusToAppStatus(application.status),
          counselorNotes: application.counselor_notes || '',
          paymentAmount: application.payment_amount || 0,
          documents: this.createDocumentObjects(application),
          createdAt: new Date(application.created_at),
          updatedAt: new Date(application.updated_at)
        };

        // Replace applications list with search result
        this.applications = [transformedApp];
        this.selectApplication(transformedApp);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search failed:', error);
        alert('Application not found or search failed');
        this.isLoading = false;
      }
    });
  }

  // Clear search and reload all applications
  clearSearch() {
    this.searchEmail = '';
    this.loadApplications();
  }

  // Download document
  downloadDocument(docNumber: number) {
    const app = this.selectedApplication;
    if (!app) return;

    this.applicationService.downloadDocument(app.id!, docNumber).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document_${docNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Failed to download document:', error);
        alert('Failed to download document');
      }
    });
  }

  private initializeStaticData() {
    const staticApplications: ApplicationData[] = [
      {
        id: '1001',
        personalInfo: {
          firstName: 'Rajesh',
          lastName: 'Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 9876543210',
          address: '123 MG Road, Bangalore, Karnataka 560001',
          dateOfBirth: '1995-03-15'
        },
        userType: 'student',
        companyName: '',
        qualification: 'B.Tech Computer Science',
        appointmentDate: '2024-03-15',
        slot: '9-10',
        status: 'form-submitted',
        createdAt: new Date('2024-03-10T10:30:00'),
        updatedAt: new Date('2024-03-10T10:30:00')
      }
    ];

    this.applications = staticApplications;
  }

  getFilteredApplications(): ApplicationData[] {
    const apps = this.applications;
    switch (this.activeTab) {
      case 'all':
        return apps;
      case 'pending':
        return apps.filter(app => app.status === 'form-submitted');
      case 'documents':
        return apps.filter(app => ['documents-requested', 'documents-uploaded', 'payment-requested'].includes(app.status));
      case 'approved':
        return apps.filter(app => app.status === 'payment-completed');
      default:
        return apps;
    }
  }

  selectApplication(application: ApplicationData) {
    this.selectedApplication = application;
    this.counselorNotes = application.counselorNotes || '';
  }

  async approveApplication() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      this.applicationService.updateApplicationStatus(app.id!, 'documents-requested', this.counselorNotes).subscribe({
        next: (response) => {
          console.log('Application approved:', response);
          this.loadApplications();
          
          const updatedApp = this.applications.find(a => a.id === app.id);
          if (updatedApp) {
            this.selectedApplication = updatedApp;
          }
        },
        error: (error) => {
          console.error('Failed to approve application:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to approve application:', error);
      this.isLoading = false;
    }
  }

  async requestDocuments() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      this.applicationService.requestDocuments(app.id!, this.counselorNotes).subscribe({
        next: (response) => {
          console.log('Documents requested:', response);
          this.loadApplications();
          
          const updatedApp = this.applications.find(a => a.id === app.id);
          if (updatedApp) {
            this.selectedApplication = updatedApp;
          }
        },
        error: (error) => {
          console.error('Failed to request documents:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to request documents:', error);
      this.isLoading = false;
    }
  }

  async rejectApplication() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      this.applicationService.rejectApplication(app.id!, this.counselorNotes).subscribe({
        next: (response) => {
          console.log('Application rejected:', response);
          this.loadApplications();
          this.selectedApplication = null;
        },
        error: (error) => {
          console.error('Failed to reject application:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to reject application:', error);
      this.isLoading = false;
    }
  }

  async uploadDocuments() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      const mockDocuments = {
        document1: new File(['mock content'], 'government_id.pdf', { type: 'application/pdf' }),
        document2: new File(['mock content'], 'address_proof.pdf', { type: 'application/pdf' }),
        document3: new File(['mock content'], 'education_certificate.pdf', { type: 'application/pdf' })
      };

      this.applicationService.uploadDocuments(app.id!, mockDocuments).subscribe({
        next: (response) => {
          console.log('Documents uploaded:', response);
          this.loadApplications();
          
          const updatedApp = this.applications.find(a => a.id === app.id);
          if (updatedApp) {
            this.selectedApplication = updatedApp;
          }
        },
        error: (error) => {
          console.error('Failed to upload documents:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to upload documents:', error);
      this.isLoading = false;
    }
  }

  async requestPayment() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      this.applicationService.sendPaymentLink(app.id!, 299).subscribe({
        next: (response) => {
          console.log('Payment link sent:', response);
          this.loadApplications();
          
          const updatedApp = this.applications.find(a => a.id === app.id);
          if (updatedApp) {
            this.selectedApplication = updatedApp;
          }
        },
        error: (error) => {
          console.error('Failed to send payment link:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to send payment link:', error);
      this.isLoading = false;
    }
  }

  async confirmPayment() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      this.applicationService.confirmPayment(app.id!).subscribe({
        next: (response) => {
          console.log('Payment confirmed:', response);
          this.loadApplications();
          
          const updatedApp = this.applications.find(a => a.id === app.id);
          if (updatedApp) {
            this.selectedApplication = updatedApp;
          }
        },
        error: (error) => {
          console.error('Failed to confirm payment:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      this.isLoading = false;
    }
  }

  getStatusBadgeClass(status: ApplicationData['status']): string {
    switch (status) {
      case 'form-submitted':
        return 'status-pending';
      case 'counselor-approved':
        return 'status-approved';
      case 'documents-requested':
        return 'status-documents-requested';
      case 'documents-uploaded':
        return 'status-documents-uploaded';
      case 'documents-verified':
        return 'status-verified';
      case 'payment-requested':
        return 'status-payment';
      case 'payment-completed':
        return 'status-completed';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(status: ApplicationData['status']): string {
    switch (status) {
      case 'form-submitted':
        return 'Pending Review';
      case 'counselor-approved':
        return 'Approved';
      case 'documents-requested':
        return 'Documents Requested';
      case 'documents-uploaded':
        return 'Documents Uploaded';
      case 'documents-verified':
        return 'Documents Verified';
      case 'payment-requested':
        return 'Payment Requested';
      case 'payment-completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPendingCount(): number {
    return this.applications.filter(app => app.status === 'form-submitted').length;
  }

  getDocumentReviewCount(): number {
    return this.applications.filter(app => 
      ['documents-requested', 'documents-uploaded', 'payment-requested'].includes(app.status)
    ).length;
  }

  getApprovedCount(): number {
    return this.applications.filter(app => app.status === 'payment-completed').length;
  }

  getAllCount(): number {
    return this.applications.length;
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getDocumentName(document: File | undefined): string {
    return document?.name || 'Uploaded';
  }

  formatTimeSlot(slot: string | undefined): string {
    if (!slot) return 'N/A';
    
    const timeSlots: { [key: string]: string } = {
      '9-10': '9:00 AM - 10:00 AM',
      '10-11': '10:00 AM - 11:00 AM',
      '11-12': '11:00 AM - 12:00 PM',
      '14-15': '2:00 PM - 3:00 PM',
      '15-16': '3:00 PM - 4:00 PM',
      '16-17': '4:00 PM - 5:00 PM'
    };
    
    return timeSlots[slot] || slot;
  }

  navigateToApplicationReg() {
    this.router.navigate(['/application-registration']);
  }

  navigateToMainDashboard() {
    this.router.navigate(['/counsellor-page']);
  }

  /**
   * Logout counselor and redirect to login page
   */
  logout(): void {
    console.log('Logging out counselor...');
    this.loginService.counselorLogout();
  }
}