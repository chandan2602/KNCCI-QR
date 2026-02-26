import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-apprenticeship-details',
  templateUrl: './apprenticeship-details.component.html',
  styleUrls: ['./apprenticeship-details.component.css']
})
export class ApprenticeshipDetailsComponent implements OnInit {

  apprenticeship: any = null;
  sourceComponent: string = '';
  isLoading: boolean = true;
  showEnrollModal: boolean = false;
  isEnrolling: boolean = false;
  enrollmentForm: FormGroup;
  roleId: string = '';
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    this.enrollmentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      educationLevel: ['', Validators.required],
      motivation: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Check if user is admin
    this.roleId = sessionStorage.getItem('RoleId') || '';
    this.isAdmin = this.roleId === '1';
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.sourceComponent = params['source'] || '';
      this.loadApprenticeshipDetails(id);
    });
  }

  loadApprenticeshipDetails(id: string) {
    this.isLoading = true;
    this.commonService.getApprenticeshipsList().subscribe(
      (res: any) => {
        if (res?.status === true && res?.data) {
          // Find the apprenticeship by ID
          this.apprenticeship = res.data.find((item: any) => item.id === +id);
          if (!this.apprenticeship) {
            this.toastr.error('Apprenticeship not found');
            this.router.navigate(['/HOME/apprenticeships']);
          }
        } else {
          this.toastr.error('Failed to load apprenticeship details');
          this.router.navigate(['/HOME/apprenticeships']);
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Error loading apprenticeship details:', err);
        this.toastr.error('Failed to load apprenticeship details');
        this.router.navigate(['/HOME/apprenticeships']);
        this.isLoading = false;
      }
    );
  }

  goBack() {
    this.router.navigate(['/HOME/apprenticeships']);
  }

  openEnrollModal() {
    // Pre-fill form with user data from session if available
    const userName = sessionStorage.getItem('userName') || sessionStorage.getItem('name') || '';
    const userEmail = sessionStorage.getItem('email') || sessionStorage.getItem('username') || '';
    const userPhone = sessionStorage.getItem('phone') || sessionStorage.getItem('mobileno') || '';

    this.enrollmentForm.patchValue({
      fullName: userName,
      email: userEmail,
      phone: userPhone
    });

    this.showEnrollModal = true;
  }

  closeEnrollModal() {
    this.showEnrollModal = false;
    this.enrollmentForm.reset();
  }

  submitEnrollment() {
    if (this.enrollmentForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.isEnrolling = true;

    const enrollmentData = {
      apprenticeship_id: this.apprenticeship.id,
      apprenticeship_name: this.apprenticeship.apprenticeship_name,
      student_id: sessionStorage.getItem('UserId'),
      student_name: this.enrollmentForm.value.fullName,
      email: this.enrollmentForm.value.email,
      phone: this.enrollmentForm.value.phone,
      education_level: this.enrollmentForm.value.educationLevel,
      motivation: this.enrollmentForm.value.motivation,
      application_date: new Date().toISOString(),
      status: 'Pending',
      tenant_code: sessionStorage.getItem('TenantCode') || ''
    };

    this.commonService.enrollApprenticeship(enrollmentData).subscribe(
      (res: any) => {
        this.isEnrolling = false;
        if (res?.status === true) {
          this.toastr.success('Application submitted successfully!');
          this.closeEnrollModal();
          // Navigate to applied apprenticeships
          this.router.navigate(['/HOME/apprenticeships'], { 
            queryParams: { tab: 'applied' } 
          });
        } else {
          this.toastr.error(res?.message || 'Failed to submit application');
        }
      },
      (err) => {
        this.isEnrolling = false;
        console.error('Error submitting enrollment:', err);
        this.toastr.error('Failed to submit application. Please try again.');
      }
    );
  }
}
