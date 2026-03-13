import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CounselorService, ApiApplicationData, DashboardStats } from 'src/app/services/consullor.services';
import { ApplicationData } from 'src/app/pages/application-reg/application-flow.component';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { CounsellorHeaderComponent } from './counsellor-header.component';

@Component({
  selector: 'app-counselor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CounsellorHeaderComponent],
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
  dashboardStats: DashboardStats | null = null;
  
  // Document upload properties
  selectedFiles: {
    document1: File | null;
    document2: File | null;
    document3: File | null;
  } = {
    document1: null,
    document2: null,
    document3: null
  };
  
  uploadProgress: {
    document1: boolean;
    document2: boolean;
    document3: boolean;
  } = {
    document1: false,
    document2: false,
    document3: false
  };

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
          // Calculate stats from loaded applications as fallback
          this.calculateStatsFromApplications();
        }
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Calculate stats from loaded applications as fallback
      this.calculateStatsFromApplications();
    }
  }

  // Calculate dashboard stats from loaded applications (fallback method)
  private calculateStatsFromApplications() {
    if (this.applications.length === 0) {
      this.dashboardStats = {
        total_applications: 0,
        pending_review: 0,
        document_review: 0,
        approved: 0,
        rejected: 0,
        total_students: 0,
        active_students: 0,
        inactive_students: 0,
        urgent_applications: 0,
        approved_this_month: 0,
        scheduled_calls: 0,
        completed_sessions: 0,
        student_feedback_count: 0
      };
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.dashboardStats = {
      total_applications: this.applications.length,
      pending_review: this.applications.filter(app => app.status === 'form-submitted').length,
      document_review: this.applications.filter(app => 
        ['documents-requested', 'documents-uploaded', 'payment-requested'].includes(app.status)
      ).length,
      approved: this.applications.filter(app => app.status === 'payment-completed').length,
      rejected: this.applications.filter(app => app.status === 'rejected').length,
      total_students: this.applications.length,
      active_students: this.applications.filter(app => 
        !['rejected', 'payment-completed'].includes(app.status)
      ).length,
      inactive_students: this.applications.filter(app => 
        ['rejected'].includes(app.status)
      ).length,
      urgent_applications: this.applications.filter(app => {
        const daysSinceCreated = Math.floor(
          (now.getTime() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceCreated > 7 && app.status === 'form-submitted';
      }).length,
      approved_this_month: this.applications.filter(app => {
        if (app.status !== 'payment-completed') return false;
        const updatedDate = new Date(app.updatedAt);
        return updatedDate.getMonth() === currentMonth && updatedDate.getFullYear() === currentYear;
      }).length,
      scheduled_calls: 0, // This would need to come from a separate calls API
      completed_sessions: 0, // This would need to come from a separate sessions API
      student_feedback_count: 0 // This would need to come from a separate feedback API
    };

    console.log('Calculated dashboard stats from applications:', this.dashboardStats);
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
    // Reset file selections when selecting a new application
    this.resetFileSelections();
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

    // Check if all three documents are selected
    if (!this.selectedFiles.document1 || !this.selectedFiles.document2 || !this.selectedFiles.document3) {
      alert('Please upload all three required documents before proceeding.');
      return;
    }

    this.isLoading = true;
    try {
      const documentsToUpload = {
        document1: this.selectedFiles.document1,
        document2: this.selectedFiles.document2,
        document3: this.selectedFiles.document3
      };

      this.applicationService.uploadDocuments(app.id!, documentsToUpload).subscribe({
        next: (response) => {
          console.log('Documents uploaded:', response);
          this.loadApplications();
          
          // Reset file selections after successful upload
          this.resetFileSelections();
          
          const updatedApp = this.applications.find(a => a.id === app.id);
          if (updatedApp) {
            this.selectedApplication = updatedApp;
          }
        },
        error: (error) => {
          console.error('Failed to upload documents:', error);
          alert('Failed to upload documents. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Failed to upload documents:', error);
      alert('Failed to upload documents. Please try again.');
      this.isLoading = false;
    }
  }

  // Handle file selection for each document type
  onFileSelected(event: any, documentType: 'document1' | 'document2' | 'document3') {
    const file = event.target.files[0];
    if (file) {
      console.log(`File selected for ${documentType}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
        lastModified: new Date(file.lastModified).toISOString()
      });

      // Enhanced file validation
      const validationResult = this.validateFile(file, documentType);
      if (!validationResult.isValid) {
        alert(validationResult.errorMessage);
        console.error('File validation failed:', validationResult.errorMessage);
        // Clear the file input
        event.target.value = '';
        return;
      }
      
      // Store the selected file but don't upload immediately
      this.selectedFiles[documentType] = file;
      console.log(`File stored for ${documentType}, waiting for all three documents...`);
      
      // Check if all three documents are now selected
      if (this.areAllDocumentsSelected()) {
        console.log('All three documents selected, starting upload...');
        this.uploadAllDocuments();
      } else {
        console.log('Still waiting for more documents. Current status:', {
          document1: this.selectedFiles.document1 ? 'selected' : 'missing',
          document2: this.selectedFiles.document2 ? 'selected' : 'missing',
          document3: this.selectedFiles.document3 ? 'selected' : 'missing'
        });
      }
    } else {
      console.log(`No file selected for ${documentType}`);
    }
  }

  // Check if all three documents are selected
  areAllDocumentsSelected(): boolean {
    return !!(this.selectedFiles.document1 && this.selectedFiles.document2 && this.selectedFiles.document3);
  }

  // Upload all three documents together (as required by backend)
  async uploadAllDocuments() {
    const app = this.selectedApplication;
    if (!app) return;

    if (!this.areAllDocumentsSelected()) {
      console.error('Cannot upload: not all documents are selected');
      return;
    }

    this.isLoading = true;
    try {
      console.log('Uploading all three documents together...');
      
      const documentsToUpload = {
        document1: this.selectedFiles.document1!,
        document2: this.selectedFiles.document2!,
        document3: this.selectedFiles.document3!
      };

      this.applicationService.uploadDocuments(app.id!, documentsToUpload).subscribe({
        next: (response) => {
          console.log('All documents uploaded successfully:', response);
          
          // Mark all documents as uploaded
          this.uploadProgress.document1 = true;
          this.uploadProgress.document2 = true;
          this.uploadProgress.document3 = true;
          
          // Update the application's document status
          if (this.selectedApplication) {
            if (!this.selectedApplication.documents) {
              this.selectedApplication.documents = {};
            }
            this.selectedApplication.documents.document1 = this.selectedFiles.document1!;
            this.selectedApplication.documents.document2 = this.selectedFiles.document2!;
            this.selectedApplication.documents.document3 = this.selectedFiles.document3!;
          }
          
          // Refresh applications to get updated status
          this.loadApplications();
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to upload documents:', error);
          this.handleUploadError('all documents', error);
        }
      });
    } catch (error) {
      console.error('Failed to upload documents:', error);
      this.handleUploadError('all documents', error);
    }
  }

  // Enhanced file validation
  private validateFile(file: File, documentType: string): { isValid: boolean; errorMessage: string } {
    // Check if file exists
    if (!file) {
      return { isValid: false, errorMessage: 'No file selected.' };
    }

    // Validate file name
    if (!file.name || file.name.trim() === '') {
      return { isValid: false, errorMessage: `Invalid file name for ${documentType}.` };
    }

    // Check for file name length (some servers have limits)
    if (file.name.length > 255) {
      return { isValid: false, errorMessage: `File name too long for ${documentType}. Please use a shorter name.` };
    }

    // Validate file type - be more specific about allowed types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg', 
      'image/jpg',
      'image/png'
    ];
    
    // Also check file extension as backup
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return { 
        isValid: false, 
        errorMessage: `Invalid file type for ${documentType}. File type: ${file.type}, Extension: ${fileExtension}. Please upload only PDF, JPEG, or PNG files.` 
      };
    }
    
    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        errorMessage: `File size too large for ${documentType}. Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Please use a file under 5MB.` 
      };
    }

    // Check minimum file size (avoid empty files)
    if (file.size < 100) { // 100 bytes minimum
      return { 
        isValid: false, 
        errorMessage: `File too small for ${documentType}. The file appears to be empty or corrupted.` 
      };
    }

    // Additional validation for PDF files
    if (file.type === 'application/pdf' || fileExtension === 'pdf') {
      // Check if it's actually a PDF by looking at file signature (basic check)
      // This is a simple check - for production, you might want more thorough validation
    }

    return { isValid: true, errorMessage: '' };
  }

  // Handle upload errors and keep buttons enabled
  private handleUploadError(documentType: string, error: any) {
    // Log detailed error information for debugging
    console.error(`Upload error for ${documentType}:`, {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message,
      url: error.url
    });

    // More detailed error handling
    let errorMessage = `Failed to upload ${documentType}. `;
    if (error.status === 422) {
      // Log the specific validation errors from the server
      if (error.error && error.error.errors) {
        console.error('Server validation errors:', error.error.errors);
        errorMessage += `Server validation failed: ${JSON.stringify(error.error.errors)}`;
      } else if (error.error && error.error.message) {
        console.error('Server error message:', error.error.message);
        errorMessage += `Server says: ${error.error.message}`;
      } else {
        errorMessage += 'Validation error: Please check the file format and size. Only PDF, JPEG, and PNG files under 5MB are allowed.';
      }
    } else if (error.status === 400) {
      if (error.error && error.error.detail) {
        errorMessage += `${error.error.detail}`;
      } else {
        errorMessage += 'Bad request. Please check your files and try again.';
      }
    } else if (error.status === 413) {
      errorMessage += 'File size is too large. Please use files under 5MB.';
    } else if (error.status === 415) {
      errorMessage += 'Unsupported file type. Please use PDF, JPEG, or PNG files.';
    } else if (error.status === 404) {
      errorMessage += 'Application not found. Please refresh and try again.';
    } else if (error.status === 500) {
      errorMessage += 'Server error. Please try again later.';
    } else {
      errorMessage += `Server error (${error.status}). Please try again.`;
    }
    
    alert(errorMessage);
    
    // Reset all file selections on error since backend requires all three
    this.selectedFiles = {
      document1: null,
      document2: null,
      document3: null
    };
    this.uploadProgress = {
      document1: false,
      document2: false,
      document3: false
    };
    
    // Ensure loading state is reset
    this.isLoading = false;
  }

  // Reset file selections
  resetFileSelections() {
    this.selectedFiles = {
      document1: null,
      document2: null,
      document3: null
    };
    this.uploadProgress = {
      document1: false,
      document2: false,
      document3: false
    };
  }

  // Check if all documents are uploaded
  areAllDocumentsUploaded(): boolean {
    return this.uploadProgress.document1 && this.uploadProgress.document2 && this.uploadProgress.document3;
  }

  // Get file name for display
  getFileName(documentType: 'document1' | 'document2' | 'document3'): string {
    const file = this.selectedFiles[documentType];
    return file ? file.name : 'No file chosen';
  }

  // Remove selected file
  removeFile(documentType: 'document1' | 'document2' | 'document3') {
    this.selectedFiles[documentType] = null;
    this.uploadProgress[documentType] = false;
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

  async uploadReceipt() {
    const app = this.selectedApplication;
    if (!app) return;

    this.isLoading = true;
    try {
      // Simulate receipt upload process
      setTimeout(() => {
        console.log('Receipt uploaded for application:', app.id);
        
        // Mark receipt as uploaded
        if (this.selectedApplication) {
          this.selectedApplication.receiptUploaded = true;
        }
        
        // Update the application in the list
        const appIndex = this.applications.findIndex(a => a.id === app.id);
        if (appIndex !== -1) {
          this.applications[appIndex].receiptUploaded = true;
        }
        
        this.isLoading = false;
        alert('Receipt uploaded successfully! You can now confirm payment completion.');
      }, 2000);
    } catch (error) {
      console.error('Failed to upload receipt:', error);
      this.isLoading = false;
      alert('Failed to upload receipt. Please try again.');
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
    return this.dashboardStats?.pending_review || this.applications.filter(app => app.status === 'form-submitted').length;
  }

  getDocumentReviewCount(): number {
    return this.dashboardStats?.document_review || this.applications.filter(app => 
      ['documents-requested', 'documents-uploaded', 'payment-requested'].includes(app.status)
    ).length;
  }

  getApprovedCount(): number {
    return this.dashboardStats?.approved || this.applications.filter(app => app.status === 'payment-completed').length;
  }

  getAllCount(): number {
    return this.dashboardStats?.total_applications || this.applications.length;
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