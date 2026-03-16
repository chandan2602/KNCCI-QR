import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { PaymentService, PaymentKPI, PaymentRecord } from '../../services/payment.service';
import { CounsellorHeaderComponent } from './counsellor-header.component';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [CommonModule, CounsellorHeaderComponent],
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit {

  // Make Math available in template
  Math = Math;

  // Loading states
  isLoading = false;
  isKpiLoading = false;
  isTableLoading = false;

  // Payment status filter
  paymentStatus = 'Paid'; // Default to show only paid payments

  // KPI Data
  kpiData: PaymentKPI = {
    total_successful_payments: 0,
    successful_transactions: 0,
    students_paid: 0,
    total_successful_amount: '₹0',
    growth_percentage: 0,
    transactions_growth: 0,
    students_growth: 0
  };

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Payment data
  currentPageData: PaymentRecord[] = [];

  // Error handling
  errorMessage: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    console.log('Payment Management component initialized');
    this.loadPaymentData();
  }

  /**
   * Load all payment data (KPI + List) with status filter
   */
  async loadPaymentData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('🔄 loadPaymentData started');

    try {
      // Load KPI data first
      console.log('🔄 Loading KPI data...');
      await this.loadKpiData();
      console.log('✅ KPI data loaded');
      
      // Then load payment list
      console.log('🔄 Loading payment list...');
      await this.loadPaymentList();
      console.log('✅ Payment list loaded');
      
    } catch (error) {
      console.error('❌ Failed to load payment data:', error);
      this.errorMessage = 'Failed to load payment data. Please try again.';
    } finally {
      this.isLoading = false;
      console.log('✅ loadPaymentData completed');
    }
  }

  /**
   * Load KPI data from API with status filter
   */
  async loadKpiData(): Promise<void> {
    this.isKpiLoading = true;
    console.log('🔄 Starting KPI data load...');
    console.log('🔄 Payment status for KPI:', this.paymentStatus);
    
    return new Promise((resolve, reject) => {
      try {
        this.paymentService.getPaymentKPI(this.paymentStatus).subscribe({
          next: (kpiData: any) => {
            console.log('✅ KPI API Response received:', kpiData);
            console.log('📊 KPI Data type:', typeof kpiData);
            console.log('📊 KPI Data keys:', Object.keys(kpiData || {}));
            
            // Check if response has expected structure
            if (kpiData && typeof kpiData === 'object') {
              // Map API response to PaymentKPI interface
              const mappedKpi: PaymentKPI = {
                total_successful_payments: kpiData.total_successful_payments || kpiData.total_payments || 0,
                successful_transactions: kpiData.successful_transactions || kpiData.transactions || 0,
                students_paid: kpiData.students_paid || kpiData.total_students || 0,
                total_successful_amount: kpiData.total_successful_amount || kpiData.total_amount || '₹0',
                growth_percentage: kpiData.growth_percentage || 0,
                transactions_growth: kpiData.transactions_growth || 0,
                students_growth: kpiData.students_growth || 0
              };
              
              this.kpiData = mappedKpi;
              console.log('✅ KPI data assigned to component:', this.kpiData);
              console.log('📊 total_successful_payments:', this.kpiData.total_successful_payments);
              console.log('📊 successful_transactions:', this.kpiData.successful_transactions);
              console.log('📊 students_paid:', this.kpiData.students_paid);
            } else {
              console.error('❌ Invalid KPI data structure:', kpiData);
            }
            
            this.isKpiLoading = false;
            console.log('✅ KPI loading completed');
            resolve();
          },
          error: (error) => {
            console.error('❌ Failed to load KPI data:', error);
            console.error('❌ Error status:', error.status);
            console.error('❌ Error message:', error.message);
            console.error('❌ Full error object:', error);
            this.handleKpiError();
            this.isKpiLoading = false;
            reject(error);
          }
        });
      } catch (error) {
        console.error('❌ Exception in loadKpiData:', error);
        this.handleKpiError();
        this.isKpiLoading = false;
        reject(error);
      }
    });
  }

  /**
   * Load payment list from API with status filter
   */
  async loadPaymentList(): Promise<void> {
    this.isTableLoading = true;
    console.log('🔄 Starting payment list load...');
    console.log('🔄 Current page:', this.currentPage);
    console.log('🔄 Items per page:', this.itemsPerPage);
    console.log('🔄 Payment status:', this.paymentStatus);
    
    return new Promise((resolve, reject) => {
      try {
        this.paymentService.getPaymentList(this.currentPage, this.itemsPerPage, this.paymentStatus).subscribe({
          next: (response: any) => {
            console.log('✅ Payment List API Response received:', response);
            console.log('📊 Response type:', typeof response);
            console.log('📊 Response is array:', Array.isArray(response));
            console.log('📊 Response length:', response?.length);
            
            if (Array.isArray(response) && response.length > 0) {
              console.log('📊 First payment record:', response[0]);
              console.log('📊 First record keys:', Object.keys(response[0]));
              
              this.currentPageData = response.map((payment: any) => {
                console.log('📊 Processing payment:', payment);
                
                // Map API response to PaymentRecord interface
                const mappedPayment: PaymentRecord = {
                  id: payment.id,
                  name: payment.name || payment.user_name || payment.student_name || '',
                  email: payment.email || payment.email_id || '',
                  payment_amount: payment.payment_amount || payment.amount || payment.fee_amount || 0,
                  payment_status: payment.payment_status || payment.status || 'Pending',
                  paid_date: payment.paid_date || payment.payment_date || new Date().toISOString(),
                  avatar: this.generateAvatar(payment.name || payment.user_name || payment.student_name || '')
                };
                
                console.log('📊 Mapped payment:', mappedPayment);
                return mappedPayment;
              });
              
              this.totalItems = response.length;
              this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
              
              console.log('✅ Payment data processed:', this.currentPageData);
              console.log('✅ Total items:', this.totalItems);
              console.log('✅ Total pages:', this.totalPages);
              console.log('✅ Current page data length:', this.currentPageData.length);
            } else if (Array.isArray(response) && response.length === 0) {
              console.log('⚠️ API returned empty array');
              this.currentPageData = [];
              this.totalItems = 0;
              this.totalPages = 0;
            } else {
              console.error('❌ API response is not an array:', response);
              this.handlePaymentListError();
            }
            
            this.isTableLoading = false;
            console.log('✅ Payment list loading completed');
            resolve();
          },
          error: (error) => {
            console.error('❌ Failed to load payment list:', error);
            console.error('❌ Error status:', error.status);
            console.error('❌ Error message:', error.message);
            console.error('❌ Full error object:', error);
            this.handlePaymentListError();
            this.isTableLoading = false;
            reject(error);
          }
        });
      } catch (error) {
        console.error('❌ Exception in loadPaymentList:', error);
        this.handlePaymentListError();
        this.isTableLoading = false;
        reject(error);
      }
    });
  }

  /**
   * Handle KPI data loading error with fallback
   */
  private handleKpiError(): void {
    console.log('KPI API failed - no fallback data will be shown');
    // Commented out static fallback data to show real API data
    /*
    this.kpiData = {
      total_successful_payments: 47,
      total_successful_amount: '₹1,06,500',
      successful_transactions: 47,
      students_paid: 164,
      growth_percentage: 12,
      transactions_growth: 8,
      students_growth: 23
    };
    */
  }

  /**
   * Handle payment list loading error with fallback
   */
  private handlePaymentListError(): void {
    console.log('Payment list API failed - no fallback data will be shown');
    
    // Commented out static fallback data to show real API data
    /*
    const fallbackData = [
      { id: 1, user_name: 'Ravi Kumar', email: 'ravi.kumar@email.com', fee_amount: '₹25,000', payment_status: 'Paid', paid_date: '05 Mar', avatar: 'R' },
      { id: 2, user_name: 'Sneha P', email: 'sneha.p@email.com', fee_amount: '₹15,000', payment_status: 'Paid', paid_date: '04 Mar', avatar: 'S' },
      { id: 3, user_name: 'Priya Das', email: 'priya.das@email.com', fee_amount: '₹28,500', payment_status: 'Paid', paid_date: '06 Mar', avatar: 'P' },
      { id: 4, user_name: 'Amit Singh', email: 'amit.singh@email.com', fee_amount: '₹20,000', payment_status: 'Paid', paid_date: '07 Mar', avatar: 'A' },
      { id: 5, user_name: 'Kavya Sharma', email: 'kavya.sharma@email.com', fee_amount: '₹18,000', payment_status: 'Paid', paid_date: '08 Mar', avatar: 'K' },
      { id: 6, user_name: 'Manoj Patel', email: 'manoj.patel@email.com', fee_amount: '₹22,000', payment_status: 'Paid', paid_date: '09 Mar', avatar: 'M' },
      { id: 7, user_name: 'Neha Sharma', email: 'neha.sharma@email.com', fee_amount: '₹19,500', payment_status: 'Paid', paid_date: '10 Mar', avatar: 'N' },
      { id: 8, user_name: 'Vikash Kumar', email: 'vikash.kumar@email.com', fee_amount: '₹24,000', payment_status: 'Paid', paid_date: '11 Mar', avatar: 'V' },
      { id: 9, user_name: 'Deepika Roy', email: 'deepika.roy@email.com', fee_amount: '₹17,500', payment_status: 'Paid', paid_date: '12 Mar', avatar: 'D' },
      { id: 10, user_name: 'Tarun Singh', email: 'tarun.singh@email.com', fee_amount: '₹21,000', payment_status: 'Paid', paid_date: '13 Mar', avatar: 'T' }
    ];

    this.currentPageData = fallbackData;
    this.totalItems = 50;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    */
    
    // Clear data on error
    this.currentPageData = [];
    this.totalItems = 0;
    this.totalPages = 0;
  }

  /**
   * Generate avatar letter from user name
   */
  private generateAvatar(userName: string): string {
    if (!userName) return 'U';
    return userName.charAt(0).toUpperCase();
  }

  /**
   * Refresh all payment data
   */
  async refreshPaymentData(): Promise<void> {
    console.log('Refreshing payment data...');
    await this.loadPaymentData();
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPaymentList();
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPaymentList();
    }
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPaymentList();
    }
  }

  /**
   * Get page numbers for pagination display
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  /**
   * Export payment data with status filter
   */
  async exportPaymentData(format: 'csv' | 'excel' = 'csv'): Promise<void> {
    try {
      this.paymentService.exportPaymentData(format, this.paymentStatus).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `payment_data_${this.paymentStatus.toLowerCase()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (error) => {
          console.error('Failed to export payment data:', error);
          alert('Failed to export payment data. Please try again.');
        }
      });
    } catch (error) {
      console.error('Failed to export payment data:', error);
      alert('Failed to export payment data. Please try again.');
    }
  }

  /**
   * Search payments by email with status filter
   */
  async searchPayments(email: string): Promise<void> {
    if (!email.trim()) {
      alert('Please enter an email address to search');
      return;
    }

    this.isTableLoading = true;
    
    try {
      this.paymentService.searchPaymentsByEmail(email.trim(), this.paymentStatus).subscribe({
        next: (response: PaymentRecord[]) => {
          console.log('Search results:', response);
          
          if (Array.isArray(response) && response.length > 0) {
            this.currentPageData = response.map(payment => ({
              ...payment,
              avatar: this.generateAvatar(payment.name)
            }));
            this.totalItems = response.length;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.currentPage = 1;
          } else {
            alert('No payments found for this email address');
            this.currentPageData = [];
            this.totalItems = 0;
            this.totalPages = 0;
          }
          
          this.isTableLoading = false;
        },
        error: (error) => {
          console.error('Search failed:', error);
          alert('Search failed. Please try again.');
          this.isTableLoading = false;
        }
      });
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
      this.isTableLoading = false;
    }
  }

  /**
   * Clear search and reload all payments
   */
  async clearSearch(): Promise<void> {
    this.currentPage = 1;
    await this.loadPaymentList();
  }

  /**
   * Change payment status filter and reload data
   */
  async changePaymentStatus(status: string): Promise<void> {
    this.paymentStatus = status;
    this.currentPage = 1;
    await this.loadPaymentData();
  }

  /**
   * Navigate back to main counsellor dashboard
   */
  navigateToMainDashboard(): void {
    this.router.navigate(['/counsellor-page']);
  }

  /**
   * Logout counselor and redirect to login page
   */
  logout(): void {
    console.log('Logging out counselor...');
    this.loginService.counselorLogout();
  }
  // Debug methods
  testKpiApi(): void {
    console.log('🧪 Testing KPI API directly...');
    this.paymentService.getPaymentKPI('Paid').subscribe({
      next: (data) => {
        console.log('🧪 KPI Test Success:', data);
        alert('KPI API Test Success! Check console for details.');
      },
      error: (error) => {
        console.error('🧪 KPI Test Error:', error);
        alert('KPI API Test Failed! Check console for details.');
      }
    });
  }

  testListApi(): void {
    console.log('🧪 Testing List API directly...');
    this.paymentService.getPaymentList(1, 10, 'Paid').subscribe({
      next: (data) => {
        console.log('🧪 List Test Success:', data);
        alert('List API Test Success! Check console for details.');
      },
      error: (error) => {
        console.error('🧪 List Test Error:', error);
        alert('List API Test Failed! Check console for details.');
      }
    });
  }
}