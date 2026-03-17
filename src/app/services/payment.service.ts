import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

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
  // Payment API configuration - moved from environment
  private paymentApiUrl = 'http://127.0.0.1:8000';
  private paymentKpisEndpoint = '/KNCCI/api/payments/kpis';
  private paymentAllEndpoint = '/KNCCI/api/payments/all';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    console.log('PaymentService initialized with:');
    console.log('- Payment API URL:', this.paymentApiUrl);
    console.log('- KPIs Endpoint:', this.paymentKpisEndpoint);
    console.log('- All Payments Endpoint:', this.paymentAllEndpoint);
  }

  /**
   * Get payment KPI data
   * GET {paymentApiUrl}{paymentKpisEndpoint}
   * Response: { total_payment_amount: number, successful_transactions: number, students_paid: number }
   */
  getPaymentKPI(status: string = 'Paid'): Observable<PaymentKPI> {
    const url = `${this.paymentApiUrl}${this.paymentKpisEndpoint}`;
    
    console.log('🌐 [Payment Service] Making KPI API call to:', url);
    
    return this.http.get<any>(url, this.httpOptions).pipe(
      tap(response => {
        console.log('🌐 [Payment Service] KPI API Response received:', response);
      }),
      // Map the API response to PaymentKPI interface
      map((response: any) => {
        console.log('🌐 [Payment Service] Mapping KPI response');
        const mappedKpi: PaymentKPI = {
          total_successful_payments: response.total_payment_amount || 0,
          successful_transactions: response.successful_transactions || 0,
          students_paid: response.students_paid || 0,
          total_successful_amount: response.total_payment_amount ? `₹${response.total_payment_amount}` : '₹0',
          growth_percentage: response.growth_percentage || 0,
          transactions_growth: response.transactions_growth || 0,
          students_growth: response.students_growth || 0
        };
        console.log('🌐 [Payment Service] Mapped KPI:', mappedKpi);
        return mappedKpi;
      }),
      catchError(error => {
        console.error('🌐 [Payment Service] KPI API Error:', error);
        throw error;
      })
    );
  }

  /**
   * Get paginated payment list
   * GET http://127.0.0.1:8000/payments/all
   * Response: { total_payments: number, data: PaymentRecord[] }
   */
  getPaymentList(page: number = 1, perPage: number = 10, status: string = 'Paid'): Observable<PaymentRecord[]> {
    const url = `${this.paymentApiUrl}${this.paymentAllEndpoint}`;
    
    console.log('🌐 [Payment Service] Making Payment List API call to:', url);
    
    return this.http.get<any>(url, this.httpOptions).pipe(
      tap(response => {
        console.log('🌐 [Payment Service] Payment List API Response received:', response);
      }),
      // Extract the data array from the response
      map((response: any) => {
        console.log('🌐 [Payment Service] Extracting data from response');
        if (response && Array.isArray(response.data)) {
          console.log('🌐 [Payment Service] Found data array with', response.data.length, 'items');
          return response.data;
        } else if (Array.isArray(response)) {
          console.log('🌐 [Payment Service] Response is already an array');
          return response;
        } else {
          console.warn('🌐 [Payment Service] Unexpected response structure:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('🌐 [Payment Service] Payment List API Error:', error);
        throw error;
      })
    );
  }

  /**
   * Get complete payment dashboard data
   * GET {paymentApiUrl}{paymentAllEndpoint}
   */
  getPaymentDashboard(status: string = 'Paid'): Observable<PaymentDashboard> {
    const url = `${this.paymentApiUrl}${this.paymentAllEndpoint}`;
    
    console.log('Making API call to:', url);
    return this.http.get<any>(url, this.httpOptions).pipe(
      map((response: any) => {
        const data = Array.isArray(response.data) ? response.data : response;
        return {
          kpi: {
            total_successful_payments: 0,
            successful_transactions: 0,
            students_paid: 0
          },
          recent_payments: data,
          payment_trends: {
            monthly_data: []
          }
        };
      })
    );
  }

  /**
   * Search payments by email
   * GET {paymentApiUrl}{paymentAllEndpoint}
   */
  searchPaymentsByEmail(email: string, status: string = 'Paid'): Observable<PaymentRecord[]> {
    const url = `${this.paymentApiUrl}${this.paymentAllEndpoint}`;
    
    console.log('Making API call to:', url);
    return this.http.get<any>(url, this.httpOptions).pipe(
      map((response: any) => {
        const data = Array.isArray(response.data) ? response.data : response;
        // Filter by email on client side
        return data.filter((payment: any) => 
          payment.email && payment.email.toLowerCase().includes(email.toLowerCase())
        );
      })
    );
  }

  /**
   * Get payment statistics
   * GET {paymentApiUrl}{paymentKpisEndpoint}
   */
  getPaymentStats(startDate?: string, endDate?: string, status: string = 'Paid'): Observable<PaymentKPI> {
    const url = `${this.paymentApiUrl}${this.paymentKpisEndpoint}`;
    
    console.log('Making API call to:', url);
    return this.http.get<any>(url, this.httpOptions).pipe(
      map((response: any) => {
        const mappedKpi: PaymentKPI = {
          total_successful_payments: response.total_payment_amount || 0,
          successful_transactions: response.successful_transactions || 0,
          students_paid: response.students_paid || 0,
          total_successful_amount: response.total_payment_amount ? `₹${response.total_payment_amount}` : '₹0',
          growth_percentage: response.growth_percentage || 0,
          transactions_growth: response.transactions_growth || 0,
          students_growth: response.students_growth || 0
        };
        return mappedKpi;
      })
    );
  }

  /**
   * Export payment data
   * GET {paymentApiUrl}{paymentAllEndpoint}
   */
  exportPaymentData(format: 'csv' | 'excel' = 'csv', status: string = 'Paid'): Observable<Blob> {
    const url = `${this.paymentApiUrl}${this.paymentAllEndpoint}`;
    
    console.log('Making API call to:', url);
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
}