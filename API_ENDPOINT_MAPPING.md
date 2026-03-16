# Payment API Endpoint Mapping

## Backend API Endpoints

### Primary Endpoints (as provided)

#### 1. Get Payment KPIs
```
GET http://127.0.0.1:8000/payments/kpis
```

**Alternative (used in code):**
```
GET http://127.0.0.1:8000/api/payment/kpi?status=Paid
```

**Response:**
```json
{
  "total_successful_payments": 47,
  "successful_transactions": 47,
  "students_paid": 164,
  "total_successful_amount": "₹1,06,500",
  "growth_percentage": 12,
  "transactions_growth": 8,
  "students_growth": 23
}
```

---

#### 2. Get All Payments
```
GET http://127.0.0.1:8000/payments/all
```

**Alternative (used in code):**
```
GET http://127.0.0.1:8000/api/payment/list?page=1&per_page=10&status=Paid
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Ravi Kumar",
    "email": "ravi.kumar@email.com",
    "payment_amount": 25000,
    "payment_status": "Paid",
    "paid_date": "2024-03-05T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Sneha P",
    "email": "sneha.p@email.com",
    "payment_amount": 15000,
    "payment_status": "Paid",
    "paid_date": "2024-03-04T14:20:00Z"
  }
]
```

---

## Service Layer Mapping

### PaymentService Methods → API Endpoints

```typescript
// Method 1: Get KPI Data
getPaymentKPI(status: string = 'Paid'): Observable<PaymentKPI>
  ↓
  GET /api/payment/kpi?status=Paid
  
// Method 2: Get Payment List (Paginated)
getPaymentList(page: number = 1, perPage: number = 10, status: string = 'Paid'): Observable<PaymentRecord[]>
  ↓
  GET /api/payment/list?page=1&per_page=10&status=Paid
  
// Method 3: Get Complete Dashboard
getPaymentDashboard(status: string = 'Paid'): Observable<PaymentDashboard>
  ↓
  GET /api/payment/dashboard?status=Paid
  
// Method 4: Search by Email
searchPaymentsByEmail(email: string, status: string = 'Paid'): Observable<PaymentRecord[]>
  ↓
  GET /api/payment/search?email=test@example.com&status=Paid
  
// Method 5: Get Statistics
getPaymentStats(startDate?: string, endDate?: string, status: string = 'Paid'): Observable<PaymentKPI>
  ↓
  GET /api/payment/stats?status=Paid&start_date=2024-01-01&end_date=2024-12-31
  
// Method 6: Export Data
exportPaymentData(format: 'csv' | 'excel' = 'csv', status: string = 'Paid'): Observable<Blob>
  ↓
  GET /api/payment/export?format=csv&status=Paid
```

---

## Component → Service → API Flow

### Flow 1: Load Payment KPIs on Counsellor Page

```
CounsellorPageComponent
  ↓
  ngOnInit()
  ↓
  loadPaymentKpiData()
  ↓
  PaymentService.getPaymentKPI('payment-completed')
  ↓
  HTTP GET /api/payment/kpi?status=payment-completed
  ↓
  Backend Database
  ↓
  Response: PaymentKPI object
  ↓
  this.paymentKpiData = kpiData
  ↓
  Template renders KPI cards
```

**Template Binding:**
```html
<h3 class="payment-kpi-value">₹{{paymentKpiData.total_successful_payments}}</h3>
<h3 class="payment-kpi-value">{{paymentKpiData.successful_transactions}}</h3>
<h3 class="payment-kpi-value">{{paymentKpiData.students_paid}}</h3>
```

---

### Flow 2: Load Payment Table on Payment Management Page

```
PaymentManagementComponent
  ↓
  ngOnInit()
  ↓
  loadPaymentData()
  ├─ loadKpiData()
  │  ↓
  │  PaymentService.getPaymentKPI('Paid')
  │  ↓
  │  HTTP GET /api/payment/kpi?status=Paid
  │
  └─ loadPaymentList()
     ↓
     PaymentService.getPaymentList(1, 10, 'Paid')
     ↓
     HTTP GET /api/payment/list?page=1&per_page=10&status=Paid
     ↓
     Response: PaymentRecord[] array
     ↓
     this.currentPageData = response
     ↓
     Template renders table rows
```

**Template Binding:**
```html
<tr *ngFor="let payment of currentPageData">
  <td>{{payment.name}}</td>
  <td>{{payment.email}}</td>
  <td>₹{{payment.payment_amount}}</td>
  <td>{{payment.payment_status}}</td>
  <td>{{payment.paid_date | date:'MMM dd, yyyy HH:mm'}}</td>
</tr>
```

---

### Flow 3: Search Payments by Email

```
User enters email in search box
  ↓
searchPayments(email: string)
  ↓
PaymentService.searchPaymentsByEmail(email, 'Paid')
  ↓
HTTP GET /api/payment/search?email=test@example.com&status=Paid
  ↓
Response: PaymentRecord[] array (filtered)
  ↓
this.currentPageData = response
  ↓
Template renders filtered results
```

---

### Flow 4: Export Payment Data

```
User clicks "Export CSV" button
  ↓
exportPaymentData('csv')
  ↓
PaymentService.exportPaymentData('csv', 'Paid')
  ↓
HTTP GET /api/payment/export?format=csv&status=Paid
  ↓
Response: Blob (CSV file)
  ↓
Create download link
  ↓
Trigger browser download
  ↓
File saved: payment_data_paid.csv
```

---

## Query Parameters Reference

### Status Parameter
```
status=Paid              // Show paid payments
status=Unpaid            // Show unpaid payments
status=payment-completed // Show completed payments
status=payment-pending   // Show pending payments
```

### Pagination Parameters
```
page=1                   // First page
page=2                   // Second page
per_page=10              // Items per page (default: 10)
per_page=25              // 25 items per page
```

### Search Parameters
```
email=test@example.com   // Search by email
```

### Date Range Parameters
```
start_date=2024-01-01    // Start date (YYYY-MM-DD)
end_date=2024-12-31      // End date (YYYY-MM-DD)
```

### Export Parameters
```
format=csv               // Export as CSV
format=excel             // Export as Excel
```

---

## HTTP Headers

**Default Headers (set in PaymentService):**
```typescript
headers: new HttpHeaders({
  'Content-Type': 'application/json'
})
```

**For File Download:**
```typescript
responseType: 'blob'
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning | Handling |
|--------|---------|----------|
| 200 | OK - Success | Data displayed |
| 400 | Bad Request | Show error message |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show access denied |
| 404 | Not Found | Check API endpoint |
| 500 | Server Error | Show retry button |
| 0 | Network Error | Check backend connection |

### Error Handling in Service

```typescript
.pipe(
  tap(response => {
    console.log('✅ API Response received:', response);
  }),
  catchError(error => {
    console.error('❌ API Error:', error);
    throw error;
  })
)
```

### Error Handling in Component

```typescript
this.paymentService.getPaymentKPI('Paid').subscribe({
  next: (data) => {
    // Success
    this.kpiData = data;
  },
  error: (error) => {
    // Error
    console.error('Failed to load KPI:', error);
    this.errorMessage = 'Failed to load payment data';
  }
});
```

---

## Request/Response Examples

### Example 1: Get KPI Data

**Request:**
```
GET http://127.0.0.1:8000/api/payment/kpi?status=Paid
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "total_successful_payments": 47,
  "successful_transactions": 47,
  "students_paid": 164,
  "total_successful_amount": "₹1,06,500",
  "growth_percentage": 12,
  "transactions_growth": 8,
  "students_growth": 23
}
```

---

### Example 2: Get Payment List

**Request:**
```
GET http://127.0.0.1:8000/api/payment/list?page=1&per_page=10&status=Paid
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Ravi Kumar",
    "email": "ravi.kumar@email.com",
    "payment_amount": 25000,
    "payment_status": "Paid",
    "paid_date": "2024-03-05T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Sneha P",
    "email": "sneha.p@email.com",
    "payment_amount": 15000,
    "payment_status": "Paid",
    "paid_date": "2024-03-04T14:20:00Z"
  }
]
```

---

### Example 3: Search by Email

**Request:**
```
GET http://127.0.0.1:8000/api/payment/search?email=ravi.kumar@email.com&status=Paid
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Ravi Kumar",
    "email": "ravi.kumar@email.com",
    "payment_amount": 25000,
    "payment_status": "Paid",
    "paid_date": "2024-03-05T10:30:00Z"
  }
]
```

---

### Example 4: Export to CSV

**Request:**
```
GET http://127.0.0.1:8000/api/payment/export?format=csv&status=Paid
Content-Type: application/json
```

**Response (200 OK):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="payments.csv"

id,name,email,payment_amount,payment_status,paid_date
1,Ravi Kumar,ravi.kumar@email.com,25000,Paid,2024-03-05
2,Sneha P,sneha.p@email.com,15000,Paid,2024-03-04
```

---

## cURL Examples for Testing

### Test KPI Endpoint
```bash
curl -X GET "http://127.0.0.1:8000/api/payment/kpi?status=Paid" \
  -H "Content-Type: application/json"
```

### Test Payment List Endpoint
```bash
curl -X GET "http://127.0.0.1:8000/api/payment/list?page=1&per_page=10&status=Paid" \
  -H "Content-Type: application/json"
```

### Test Search Endpoint
```bash
curl -X GET "http://127.0.0.1:8000/api/payment/search?email=test@example.com&status=Paid" \
  -H "Content-Type: application/json"
```

### Test Export Endpoint
```bash
curl -X GET "http://127.0.0.1:8000/api/payment/export?format=csv&status=Paid" \
  -H "Content-Type: application/json" \
  -o payments.csv
```

---

## Postman Collection

### Import to Postman

```json
{
  "info": {
    "name": "Payment API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get KPI",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://127.0.0.1:8000/api/payment/kpi?status=Paid",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "payment", "kpi"],
          "query": [{"key": "status", "value": "Paid"}]
        }
      }
    },
    {
      "name": "Get Payment List",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://127.0.0.1:8000/api/payment/list?page=1&per_page=10&status=Paid",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "payment", "list"],
          "query": [
            {"key": "page", "value": "1"},
            {"key": "per_page", "value": "10"},
            {"key": "status", "value": "Paid"}
          ]
        }
      }
    },
    {
      "name": "Search Payment",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://127.0.0.1:8000/api/payment/search?email=test@example.com&status=Paid",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "payment", "search"],
          "query": [
            {"key": "email", "value": "test@example.com"},
            {"key": "status", "value": "Paid"}
          ]
        }
      }
    },
    {
      "name": "Export CSV",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://127.0.0.1:8000/api/payment/export?format=csv&status=Paid",
          "protocol": "http",
          "host": ["127", "0", "0", "1"],
          "port": "8000",
          "path": ["api", "payment", "export"],
          "query": [
            {"key": "format", "value": "csv"},
            {"key": "status", "value": "Paid"}
          ]
        }
      }
    }
  ]
}
```

---

## Summary

| Component | Service Method | API Endpoint | Purpose |
|-----------|----------------|--------------|---------|
| Counsellor Page | `getPaymentKPI()` | `GET /api/payment/kpi` | Display KPI cards |
| Payment Management | `getPaymentKPI()` | `GET /api/payment/kpi` | Display KPI cards |
| Payment Management | `getPaymentList()` | `GET /api/payment/list` | Display payment table |
| Payment Management | `searchPaymentsByEmail()` | `GET /api/payment/search` | Search functionality |
| Payment Management | `exportPaymentData()` | `GET /api/payment/export` | Export to CSV/Excel |

---

## Verification Checklist

- [ ] Backend API is running on `http://127.0.0.1:8000`
- [ ] All endpoints are accessible
- [ ] Database has payment records
- [ ] CORS is enabled on backend
- [ ] Angular app is running on `http://localhost:4200`
- [ ] Environment.ts has correct API URL
- [ ] PaymentService is injected in components
- [ ] Components call service methods on init
- [ ] Templates bind to component properties
- [ ] No console errors
- [ ] Data displays correctly

