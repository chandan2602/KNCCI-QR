import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
export interface ApiResponse {
  success: boolean;
  message: string;
  application_id?: number;
  application?: any;
}
 
export interface ApiApplicationData {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  user_type: string;
  company_name?: string;
  qualification?: string;
  date_of_birth: string;
  appointment_date: string;
  slot: string;
  address?: string;
  status: string;
  counselor_notes?: string;
  payment_amount?: number;
  document1_name?: string;
  document2_name?: string;
  document3_name?: string;
  created_at: string;
  updated_at: string;
}
 
export interface DashboardStats {
  total_applications: number;
  pending_review: number;
  document_review: number;
  approved: number;
  rejected: number;
}
 
@Injectable({
  providedIn: 'root'
})
export class CounselorService {
  private baseUrl = environment.counselorApiUrl; // For counselor dashboard APIs
  private applicationBaseUrl = environment.applicationApiUrl; // For application APIs
 
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
 
  constructor(private http: HttpClient) { 
    console.log('CounselorService initialized with:');
    console.log('- Counselor API baseUrl:', this.baseUrl);
    console.log('- Application API baseUrl:', this.applicationBaseUrl);
  }
 
  // User Registration (for application submission) - POST /api/register
  submitApplication(applicationData: any): Observable<ApiResponse> {
    const payload = {
      name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
      email: applicationData.personalInfo.email,
      mobile: applicationData.personalInfo.phone,
      user_type: applicationData.userType || 'student',
      company_name: applicationData.companyName || '',
      qualification: applicationData.qualification || '',
      date_of_birth: applicationData.personalInfo.dateOfBirth,
      appointment_date: applicationData.appointmentDate || new Date().toISOString().split('T')[0],
      slot: applicationData.slot || '9-10',
      address: applicationData.personalInfo.address
    };
    
    const url = `${this.baseUrl}/register`;
    console.log('Making API call to:', url);
    return this.http.post<ApiResponse>(url, payload, this.httpOptions);
  }
 
  // Get dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    const url = `${this.baseUrl}/dashboard/stats`;
    console.log('Making API call to:', url);
    return this.http.get<DashboardStats>(url);
  }
 
  // Get all applications
  getAllApplications(): Observable<ApiApplicationData[]> {
    const url = `${this.baseUrl}/applications`;
    console.log('Making API call to:', url);
    return this.http.get<ApiApplicationData[]>(url);
  }
 
  // Get applications by status
  getApplicationsByStatus(status: string): Observable<ApiApplicationData[]> {
    const url = `${this.baseUrl}/applications/status/${status}`;
    console.log('Making API call to:', url);
    return this.http.get<ApiApplicationData[]>(url);
  }
 
  // Get specific application by ID - GET /api/applications/{application_id}
  getApplication(applicationId: string): Observable<ApiApplicationData> {
    const url = `${this.baseUrl}/applications/${applicationId}`;
    console.log('Making API call to:', url);
    return this.http.get<ApiApplicationData>(url);
  }
 
  // Search application by email
  searchByEmail(email: string): Observable<ApiApplicationData> {
    const url = `${this.baseUrl}/applications/search/${email}`;
    console.log('Making API call to:', url);
    return this.http.get<ApiApplicationData>(url);
  }
 
  // Update application status
  updateApplicationStatus(applicationId: string, status: string, notes?: string, paymentAmount?: number): Observable<ApiResponse> {
    const payload: any = { status };
    if (notes) payload.counselor_notes = notes;
    if (paymentAmount) payload.payment_amount = paymentAmount;
    
    const url = `${this.baseUrl}/applications/${applicationId}/status`;
    console.log('Making API call to:', url);
    return this.http.put<ApiResponse>(url, payload, this.httpOptions);
  }
 
  // Reject application
  rejectApplication(applicationId: string, reason: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('reason', reason);
    
    const url = `${this.baseUrl}/applications/${applicationId}/reject`;
    console.log('Making API call to:', url);
    return this.http.post<ApiResponse>(url, formData);
  }
 
  // Request documents
  requestDocuments(applicationId: string, notes: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('notes', notes);
    
    const url = `${this.baseUrl}/applications/${applicationId}/request-documents`;
    console.log('Making API call to:', url);
    return this.http.post<ApiResponse>(url, formData);
  }
 
  // Send payment link
  sendPaymentLink(applicationId: string, amount: number = 299): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('amount', amount.toString());
    
    const url = `${this.baseUrl}/applications/${applicationId}/send-payment-link`;
    console.log('Making API call to:', url);
    return this.http.post<ApiResponse>(url, formData);
  }
 
  // Confirm payment
  confirmPayment(applicationId: string): Observable<ApiResponse> {
    const url = `${this.baseUrl}/applications/${applicationId}/confirm-payment`;
    console.log('Making API call to:', url);
    return this.http.post<ApiResponse>(url, {});
  }
 
  // Download document - GET /api/applications/{application_id}/documents/{doc_number}
  downloadDocument(applicationId: string, docNumber: number): Observable<Blob> {
    const url = `${this.baseUrl}/applications/${applicationId}/documents/${docNumber}`;
    console.log('Making API call to:', url);
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
 
  // Upload documents - POST /api/applications/{application_id}/documents
  uploadDocuments(applicationId: string, documents: {
    document1: File | null;
    document2: File | null;
    document3: File | null;
  }): Observable<ApiResponse> {
    const formData = new FormData();
    if (documents.document1) formData.append('document1', documents.document1);
    if (documents.document2) formData.append('document2', documents.document2);
    if (documents.document3) formData.append('document3', documents.document3);
    
    const url = `${this.baseUrl}/applications/${applicationId}/documents`;
    console.log('Making API call to:', url);
    return this.http.post<ApiResponse>(url, formData);
  }
 
}