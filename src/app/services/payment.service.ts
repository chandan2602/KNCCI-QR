import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PaymentKPI {
  total_successful_payments: number;
  successful_transactions: number;
  students_paid: number;
  total_successful_amount?: string;
  growth_percentage?: number;
  transactions_growth?: number;
  students_growth?: number;
}

export interface PaymentRecord {
  id?: number;
  name: string;
  email: string;
  payment_amount: number;
  payment_status: string;
  paid_date: string;
  avatar?: string;
}

export interface PaymentListResponse {
  success?: boolean;
  data?: PaymentRecord[];
  total?: number;
  current_page?: number;
  per_page?: number;
  total_pages?: number;
}

export interface PaymentDashboard {
  kpi: PaymentKPI;
  recent_payments: PaymentRecord[];
  payment_trends: {
    monthly_data: Array<{
      month: string;
      amount: number;
      transactions: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.counselorApiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('PaymentService initialized with baseUrl:', this.baseUrl);
  }

  /**
   * Get payment KPI data with status filter
   * GET /api/payment/kpi?status=Paid
   */
  getPaymentKPI(status: string = 'Paid'): Observable<PaymentKPI> {
    const url = `${this.baseUrl}/payment/kpi`;
    const params = { status };
    
    console.log('🌐 [Payment Service] Making KPI API call to:', url);
    console.log('🌐 [Payment Service] With params:', params);
    console.log('🌐 [Payment Service] Base URL:', this.baseUrl);
    
    return this.http.get<PaymentKPI>(url, {
      ...this.httpOptions,
      params
    }).pipe(
      tap(response => {
        console.log('🌐 [Payment Service] KPI API Response received:', response);
      }),
      catchError(error => {
        console.error('🌐 [Payment Service] KPI API Error:', error);
        throw error;
      })
    );
  }

  /**
   * Get paginated payment list with status filter
   * GET /api/payment/list?status=Paid
   */
  getPaymentList(page: number = 1, perPage: number = 10, status: string = 'Paid'): Observable<PaymentRecord[]> {
    const url = `${this.baseUrl}/payment/list`;
    const params = {
      page: page.toString(),
      per_page: perPage.toString(),
      status: status
    };
    
    console.log('🌐 [Payment Service] Making Payment List API call to:', url);
    console.log('🌐 [Payment Service] With params:', params);
    
    return this.http.get<PaymentRecord[]>(url, { 
      ...this.httpOptions,
      params 
    }).pipe(
      tap(response => {
        console.log('🌐 [Payment Service] Payment List API Response received:', response);
      }),
      catchError(error => {
        console.error('🌐 [Payment Service] Payment List API Error:', error);
        throw error;
      })
    );
  }

  /**
   * Get complete payment dashboard data with status filter
   * GET /api/payment/dashboard?status=Paid
   */
  getPaymentDashboard(status: string = 'Paid'): Observable<PaymentDashboard> {
    const url = `${this.baseUrl}/payment/dashboard`;
    const params = { status };
    
    console.log('Making API call to:', url, 'with params:', params);
    return this.http.get<PaymentDashboard>(url, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Search payments by email with status filter
   * GET /api/payment/search?status=Paid
   */
  searchPaymentsByEmail(email: string, status: string = 'Paid'): Observable<PaymentRecord[]> {
    const url = `${this.baseUrl}/payment/search`;
    const params = { email, status };
    
    console.log('Making API call to:', url, 'with params:', params);
    return this.http.get<PaymentRecord[]>(url, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Get payment statistics for date range with status filter
   * GET /api/payment/stats?status=Paid
   */
  getPaymentStats(startDate?: string, endDate?: string, status: string = 'Paid'): Observable<PaymentKPI> {
    const url = `${this.baseUrl}/payment/stats`;
    const params: any = { status };
    
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    console.log('Making API call to:', url, 'with params:', params);
    return this.http.get<PaymentKPI>(url, {
      ...this.httpOptions,
      params
    });
  }

  /**
   * Export payment data with status filter
   * GET /api/payment/export?status=Paid
   */
  exportPaymentData(format: 'csv' | 'excel' = 'csv', status: string = 'Paid'): Observable<Blob> {
    const url = `${this.baseUrl}/payment/export`;
    const params = { format, status };
    
    console.log('Making API call to:', url, 'with params:', params);
    return this.http.get(url, {
      params,
      responseType: 'blob'
    });
  }
}