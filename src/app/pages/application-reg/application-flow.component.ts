import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CounselorService } from 'src/app/services/consullor.services';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

export interface ApplicationData {
  id?: string;
  personalInfo: PersonalInfo;
  userType?: string;
  companyName?: string;
  qualification?: string;
  appointmentDate?: string;
  slot?: string;
  status: 'form-submitted' | 'counselor-approved' | 'documents-requested' | 'documents-uploaded' | 'documents-verified' | 'payment-requested' | 'payment-completed' | 'rejected';
  counselorNotes?: string;
  documents?: {
    document1?: File;
    document2?: File;
    document3?: File;
  };
  paymentAmount?: number;
  receiptUploaded?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-application-flow',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './application-flow.component.html',
  styleUrls: ['./application-flow.component.css']
})
export class ApplicationFlowComponent implements OnInit {
  applicationForm: FormGroup;
  currentStep: 'form' | 'submitted' | 'documents-requested' | 'documents-uploaded' | 'payment-requested' | 'payment-completed' = 'form';
  applicationData: ApplicationData | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  selectedFiles: {
    document1: File | null;
    document2: File | null;
    document3: File | null;
  } = {
    document1: null,
    document2: null,
    document3: null
  };

  // Receipt upload
  selectedReceipt: File | null = null;
  isReceiptUploading = false;
  paymentRequestSent = false;

  constructor(
    private fb: FormBuilder,
    private applicationService: CounselorService
  ) {
    this.applicationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      dateOfBirth: ['', Validators.required],
      userType: ['student', Validators.required],
      companyName: [''],
      qualification: [''],
      appointmentDate: ['', Validators.required],
      slot: ['9-10', Validators.required]
    });
  }

  ngOnInit() {
    // Initialize component
  }

  submitApplication() {
    if (this.applicationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const formData = this.applicationForm.value;
      
      const application = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth
        },
        userType: formData.userType,
        companyName: formData.companyName,
        qualification: formData.qualification,
        appointmentDate: formData.appointmentDate,
        slot: formData.slot,
        status: 'form-submitted',
        createdAt: new Date()
      };

      this.applicationService.submitApplication(application).subscribe({
        next: (result) => {
          console.log('Application submitted successfully:', result);
          this.applicationData = {
            id: result.application_id?.toString(),
            personalInfo: application.personalInfo,
            userType: application.userType,
            companyName: application.companyName,
            qualification: application.qualification,
            appointmentDate: application.appointmentDate,
            slot: application.slot,
            status: 'form-submitted',
            createdAt: new Date()
          };
          this.currentStep = 'submitted';
          this.successMessage = result.message || 'Application submitted successfully! A counselor will contact you within 24 hours.';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to submit application:', error);
          let errorMsg = 'Failed to submit application. Please try again.';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.detail) {
              errorMsg = error.error.detail;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            }
          } else if (error.message) {
            errorMsg = error.message;
          }
          
          this.errorMessage = errorMsg;
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onFileSelected(event: Event, documentType: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only PDF, JPG, and PNG files are allowed';
        return;
      }

      this.selectedFiles = {
        ...this.selectedFiles,
        [documentType]: file
      };
      this.errorMessage = '';
    }
  }

  uploadDocuments() {
    const files = this.selectedFiles;
    const hasAllFiles = files.document1 && files.document2 && files.document3;
    
    if (!hasAllFiles) {
      this.errorMessage = 'Please upload all three required documents';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const applicationId = this.applicationData?.id;
    if (applicationId) {
      const documentsToUpload = {
        document1: files.document1,
        document2: files.document2,
        document3: files.document3
      };
      
      this.applicationService.uploadDocuments(applicationId, documentsToUpload).subscribe({
        next: (result) => {
          console.log('Documents uploaded successfully:', result);
          this.currentStep = 'documents-uploaded';
          this.successMessage = 'Documents uploaded successfully! They will be verified within 2 business days.';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to upload documents:', error);
          let errorMsg = 'Failed to upload documents. Please try again.';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.detail) {
              errorMsg = error.error.detail;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            }
          }
          
          this.errorMessage = errorMsg;
          this.isLoading = false;
        }
      });
    }
  }

  processPayment() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate payment request being sent
    setTimeout(() => {
      console.log('Payment request sent successfully');
      this.paymentRequestSent = true;
      this.successMessage = 'Payment request sent! Please complete the payment and upload your receipt.';
      this.isLoading = false;
    }, 2000);
  }

  /**
   * Handle receipt file selection
   */
  onReceiptSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please select a valid file type (JPG, PNG, or PDF)';
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB';
        return;
      }
      
      this.selectedReceipt = file;
      this.errorMessage = '';
      this.successMessage = 'Receipt uploaded successfully! You can now confirm payment completion.';
      console.log('Receipt selected:', file.name);
    }
  }

  /**
   * Confirm payment completed after receipt upload
   */
  confirmPaymentCompleted() {
    const applicationId = this.applicationData?.id;
    if (applicationId) {
      this.applicationService.confirmPayment(applicationId).subscribe({
        next: (result) => {
          console.log('Payment completed successfully:', result);
          this.currentStep = 'payment-completed';
          this.successMessage = 'Payment completed successfully! Your application is now complete.';
          this.isReceiptUploading = false;
        },
        error: (error) => {
          console.error('Payment confirmation failed:', error);
          let errorMsg = 'Payment confirmation failed. Please try again.';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMsg = error.error;
            } else if (error.error.detail) {
              errorMsg = error.error.detail;
            } else if (error.error.message) {
              errorMsg = error.error.message;
            }
          }
          
          this.errorMessage = errorMsg;
          this.isReceiptUploading = false;
        }
      });
    } else {
      // Fallback for demo mode
      this.currentStep = 'payment-completed';
      this.successMessage = 'Payment completed successfully! Your application is now complete.';
      this.isReceiptUploading = false;
    }
  }

  // Simulate counselor actions (for demo purposes)
  simulateCounselorApproval() {
    this.currentStep = 'documents-requested';
    this.successMessage = 'Counselor has approved your application! Please upload the required documents.';
  }

  simulateDocumentVerification() {
    this.currentStep = 'payment-requested';
    this.successMessage = 'Documents verified successfully! Please proceed with payment.';
  }

  private markFormGroupTouched() {
    Object.keys(this.applicationForm.controls).forEach(key => {
      this.applicationForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} is too short`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      dateOfBirth: 'Date of Birth',
      userType: 'User Type',
      appointmentDate: 'Appointment Date',
      slot: 'Time Slot'
    };
    return labels[fieldName] || fieldName;
  }

  getCurrentTimestamp(): number {
    return Date.now();
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
}