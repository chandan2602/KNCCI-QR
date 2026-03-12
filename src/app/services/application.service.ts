import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApplicationSubmissionResult {
  application_id: number;
  status: string;
  message: string;
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
export class ApplicationService {
  private baseUrl = environment.counselorApiUrl;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // POST /register - Register a new user
  submitApplication(application: any): Observable<ApplicationSubmissionResult> {
    const payload = {
      name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
      email: application.personalInfo.email,
      mobile: application.personalInfo.phone,
      user_type: application.userType || 'student',
      company_name: application.companyName || '',
      qualification: application.qualification || '',
      date_of_birth: application.personalInfo.dateOfBirth,
      appointment_date: application.appointmentDate || new Date().toISOString().split('T')[0],
      slot: application.slot || '9-10',
      address: application.personalInfo.address
    };
    
    return this.http.post<ApplicationSubmissionResult>(`${this.baseUrl}/register`, payload, this.httpOptions);
  }

  // GET /applications - Get all applications
  getAllApplications(): Observable<ApiApplicationData[]> {
    return this.http.get<ApiApplicationData[]>(`${this.baseUrl}/applications`);
  }

  // GET /applications/status/{status} - Get applications by status
  getApplicationsByStatus(status: string): Observable<ApiApplicationData[]> {
    return this.http.get<ApiApplicationData[]>(`${this.baseUrl}/applications/status/${status}`);
  }

  // GET /applications/{application_id} - Get specific application by ID
  getApplication(applicationId: string): Observable<ApiApplicationData> {
    return this.http.get<ApiApplicationData>(`${this.baseUrl}/applications/${applicationId}`);
  }

  // PUT /applications/{application_id}/status - Update application status
  updateApplicationStatus(applicationId: string, status: string, notes?: string, paymentAmount?: number): Observable<any> {
    const payload: any = { status };
    if (notes) payload.counselor_notes = notes;
    if (paymentAmount) payload.payment_amount = paymentAmount;
    
    return this.http.put(`${this.baseUrl}/applications/${applicationId}/status`, payload, this.httpOptions);
  }

  // POST /applications/{application_id}/upload-documents - Upload documents
  uploadDocuments(applicationId: string, documents: {
    document1: File | null;
    document2: File | null;
    document3: File | null;
  }): Observable<any> {
    const formData = new FormData();
    if (documents.document1) formData.append('document1', documents.document1);
    if (documents.document2) formData.append('document2', documents.document2);
    if (documents.document3) formData.append('document3', documents.document3);
    
    return this.http.post(`${this.baseUrl}/applications/${applicationId}/upload-documents`, formData);
  }

  // GET /applications/{application_id}/download-document/{doc_number} - Download document
  downloadDocument(applicationId: string, docNumber: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/applications/${applicationId}/download-document/${docNumber}`, {
      responseType: 'blob'
    });
  }

  // POST /applications/{application_id}/request-documents - Request additional documents
  requestDocuments(applicationId: string, notes: string): Observable<any> {
    const formData = new FormData();
    formData.append('notes', notes);
    
    return this.http.post(`${this.baseUrl}/applications/${applicationId}/request-documents`, formData);
  }

  // POST /applications/{application_id}/reject - Reject application with reason
  rejectApplication(applicationId: string, reason: string): Observable<any> {
    const formData = new FormData();
    formData.append('reason', reason);
    
    return this.http.post(`${this.baseUrl}/applications/${applicationId}/reject`, formData);
  }

  // POST /applications/{application_id}/send-payment-link - Send payment link
  sendPaymentLink(applicationId: string, amount: number = 299): Observable<any> {
    const formData = new FormData();
    formData.append('amount', amount.toString());
    
    return this.http.post(`${this.baseUrl}/applications/${applicationId}/send-payment-link`, formData);
  }

  // POST /applications/{application_id}/confirm-payment - Confirm payment
  confirmPayment(applicationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/applications/${applicationId}/confirm-payment`, {}, this.httpOptions);
  }

  // GET /dashboard/stats - Get dashboard statistics
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  // GET /applications/search/{email} - Search application by email
  searchByEmail(email: string): Observable<ApiApplicationData> {
    return this.http.get<ApiApplicationData>(`${this.baseUrl}/applications/search/${email}`);
  }
}