import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-apprenticeships',
  templateUrl: './apprenticeships.component.html',
  styleUrls: ['./apprenticeships.component.css']
})
export class ApprenticeshipsComponent implements OnInit {
  
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  selectedApprenticeship: any = null;
  activeTab: string = 'list';
  ROLEID: string = '';
  isLoading: boolean = false;
  
  appliedApprenticeships = [1, 2, 3];
  aiApprenticeships = [4, 5];
  myApprenticeships = [1];

  tooltipContent = `
    Browse available apprenticeship programs from leading companies. Apprenticeships combine on-the-job training with classroom learning, 
    providing you with practical skills and industry experience. Click <strong>View Details</strong> to see full program information and requirements.
  `;

  apprenticeshipsList: any[] = [];
  addApprenticeshipForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private toastr: ToastrService) { 
    this.addApprenticeshipForm = this.fb.group({
      apprenticeship_category: ['', Validators.required],
      apprenticeship_name: ['', Validators.required],
      student_level: [''],
      batch_name: [''],
      application_fees: [0],
      apprenticeship_classification: [''],
      batch_end_date: [''],
      stipend_per_month: [0],
      registration_start_date: [''],
      batch_start_date: [''],
      number_of_students: [0],
      batch_start_time: [''],
      payment_method: [''],
      batch_end_time: [''],
      registration_end_date: [''],
      batch_duration_days: [0],
      external_link: [''],
      terms_of_engagement: [''],
      demo_video_url: [''],
      who_can_apply: [''],
      status: ['Open', Validators.required],
      approval_status: ['Pending'],
      approval_date: [null],
      is_certified: [false],
      created_by: [''],
      tenant_id: [0]
    });
  }

  ngOnInit(): void {
    this.ROLEID = sessionStorage.getItem('RoleId') || '';
    
    if (this.ROLEID === '1') {
      this.activeTab = 'all';
    } else {
      this.activeTab = 'applied';
    }
    
    this.loadApprenticeships();
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadApprenticeships();
  }

  loadApprenticeships() {
    this.isLoading = true;
    const studentName = sessionStorage.getItem('StudentName') || sessionStorage.getItem('userName') || sessionStorage.getItem('name') || 'student';
    
    console.log('Loading apprenticeships for student:', studentName);
    
    // Use the same API for both applied and my apprenticeships
    if (this.activeTab === 'applied' || this.activeTab === 'my') {
      this.commonService.getStudentApprenticeships(studentName).subscribe(
        (res: any) => {
          console.log('Student apprenticeships response:', res);
          if (res?.status === true && res?.data) {
            this.apprenticeshipsList = res.data;
          } else {
            this.apprenticeshipsList = [];
          }
          this.isLoading = false;
        },
        (err) => {
          console.error('Error loading apprenticeships:', err);
          this.toastr.error('Failed to load apprenticeships');
          this.isLoading = false;
        }
      );
    } else {
      // For all and ai tabs, use the list API
      this.commonService.getApprenticeshipsList().subscribe(
        (res: any) => {
          console.log('All apprenticeships response:', res);
          if (res?.status === true && res?.data) {
            this.apprenticeshipsList = res.data;
          } else {
            this.apprenticeshipsList = [];
          }
          this.isLoading = false;
        },
        (err) => {
          console.error('Error loading apprenticeships:', err);
          this.toastr.error('Failed to load apprenticeships');
          this.isLoading = false;
        }
      );
    }
  }

  get filteredApprenticeships() {
    let data = this.apprenticeshipsList;
    
    if (this.activeTab === 'applied') {
      data = data.filter(item => this.appliedApprenticeships.includes(item.id));
    } else if (this.activeTab === 'ai') {
      data = data.filter(item => this.aiApprenticeships.includes(item.id));
    } else if (this.activeTab === 'my') {
      data = data.filter(item => this.myApprenticeships.includes(item.id));
    }
    
    if (!this.searchTerm) {
      return data;
    }
    const search = this.searchTerm.toLowerCase();
    return data.filter(item =>
      item.apprenticeship_name?.toLowerCase().includes(search) ||
      item.company_name?.toLowerCase().includes(search) ||
      item.status?.toLowerCase().includes(search)
    );
  }

  get paginatedApprenticeships() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredApprenticeships.slice(start, end);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredApprenticeships.length / this.entriesPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  viewDetails(apprenticeship: any) {
    this.router.navigate(['/HOME/apprenticeship-details', apprenticeship.id]);
  }

  openAddModal() {
    const userId = sessionStorage.getItem('UserId') || '';
    const tenantId = sessionStorage.getItem('TenantCode') || '0';
    
    this.addApprenticeshipForm.reset({
      apprenticeship_category: '',
      apprenticeship_name: '',
      student_level: '',
      batch_name: '',
      application_fees: 0,
      apprenticeship_classification: '',
      batch_end_date: '',
      stipend_per_month: 0,
      registration_start_date: '',
      batch_start_date: '',
      number_of_students: 0,
      batch_start_time: '',
      payment_method: '',
      batch_end_time: '',
      registration_end_date: '',
      batch_duration_days: 0,
      external_link: '',
      terms_of_engagement: '',
      demo_video_url: '',
      who_can_apply: '',
      status: 'Open',
      approval_status: 'Pending',
      approval_date: '',
      is_certified: false,
      created_by: userId,
      tenant_id: parseInt(tenantId)
    });
    const modal = new bootstrap.Modal(document.getElementById('addApprenticeshipModal'));
    modal.show();
  }

  saveApprenticeship() {
    if (this.addApprenticeshipForm.valid) {
      const formValue = this.addApprenticeshipForm.value;
      
      // Ensure all required fields are present with correct types
      const payload: any = {
        apprenticeship_category: formValue.apprenticeship_category || '',
        apprenticeship_name: formValue.apprenticeship_name || '',
        student_level: formValue.student_level || '',
        batch_name: formValue.batch_name || '',
        application_fees: parseFloat(formValue.application_fees) || 0,
        apprenticeship_classification: formValue.apprenticeship_classification || '',
        stipend_per_month: parseFloat(formValue.stipend_per_month) || 0,
        number_of_students: parseInt(formValue.number_of_students) || 0,
        batch_duration_days: parseInt(formValue.batch_duration_days) || 0,
        payment_method: formValue.payment_method || '',
        external_link: formValue.external_link || '',
        terms_of_engagement: formValue.terms_of_engagement || '',
        demo_video_url: formValue.demo_video_url || '',
        who_can_apply: formValue.who_can_apply || '',
        status: formValue.status || 'Open',
        approval_status: formValue.approval_status || 'Pending',
        is_certified: formValue.is_certified || false,
        created_by: sessionStorage.getItem('UserId') || '',
        tenant_id: parseInt(sessionStorage.getItem('TenantCode') || '0')
      };

      // Add date fields only if they have values
      if (formValue.batch_end_date) {
        payload.batch_end_date = formValue.batch_end_date;
      }
      if (formValue.registration_start_date) {
        payload.registration_start_date = formValue.registration_start_date;
      }
      if (formValue.batch_start_date) {
        payload.batch_start_date = formValue.batch_start_date;
      }
      if (formValue.registration_end_date) {
        payload.registration_end_date = formValue.registration_end_date;
      }
      if (formValue.batch_start_time) {
        payload.batch_start_time = formValue.batch_start_time;
      }
      if (formValue.batch_end_time) {
        payload.batch_end_time = formValue.batch_end_time;
      }
      if (formValue.approval_date) {
        payload.approval_date = formValue.approval_date;
      }

      console.log('Sending payload:', payload);

      this.commonService.addApprenticeship(payload).subscribe(
        (res: any) => {
          if (res?.status === true) {
            this.toastr.success('Apprenticeship added successfully!');
            this.loadApprenticeships();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addApprenticeshipModal'));
            modal?.hide();
          } else {
            this.toastr.error(res?.message || 'Failed to add apprenticeship');
          }
        },
        (err) => {
          console.error('Error adding apprenticeship:', err);
          console.error('Error details:', err?.error);
          this.toastr.error(err?.error?.detail || 'Failed to add apprenticeship');
        }
      );
    } else {
      this.toastr.warning('Please fill in all required fields');
      console.log('Form errors:', this.addApprenticeshipForm.errors);
      Object.keys(this.addApprenticeshipForm.controls).forEach(key => {
        const control = this.addApprenticeshipForm.get(key);
        if (control?.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
    }
  }
}
