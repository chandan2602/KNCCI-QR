import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-apprenticeships-schedule',
  templateUrl: './apprenticeships-schedule.component.html',
  styleUrls: ['./apprenticeships-schedule.component.css']
})
export class ApprenticeshipsScheduleComponent implements OnInit {

  addScheduleForm: FormGroup;
  editScheduleForm: FormGroup;
  addTrainerForm: FormGroup;
  selectedSchedule: any = null;
  ROLEID: string = '';
  isLoading: boolean = false;

  scheduleList: any[] = [];

  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;

  constructor(private fb: FormBuilder, private commonService: CommonService, private toastr: ToastrService) {
    this.addScheduleForm = this.fb.group({
      meetingType: ['', Validators.required],
      internshipCategory: ['', Validators.required],
      internshipName: ['', Validators.required],
      studentLevel: ['', Validators.required],
      batchName: ['', Validators.required],
      applicationFees: ['', Validators.required],
      internshipClassification: ['', Validators.required],
      batchEndDate: ['', Validators.required],
      stipendPerMonth: ['', Validators.required],
      registrationStartDate: ['', Validators.required],
      batchStartDate: ['', Validators.required],
      numberOfStudents: ['', Validators.required],
      batchStartTime: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      batchEndTime: ['', Validators.required],
      registrationEndDate: ['', Validators.required],
      batchDurationDays: ['', Validators.required],
      externalLink: [''],
      termsOfEngagement: ['', Validators.required],
      uploadDemoVideo: [''],
      whoCanApply: ['', Validators.required]
    });

    this.editScheduleForm = this.fb.group({
      meetingType: ['', Validators.required],
      internshipCategory: ['', Validators.required],
      internshipName: ['', Validators.required],
      studentLevel: ['', Validators.required],
      batchName: ['', Validators.required],
      applicationFees: ['', Validators.required],
      internshipClassification: ['', Validators.required],
      batchEndDate: ['', Validators.required],
      stipendPerMonth: ['', Validators.required],
      registrationStartDate: ['', Validators.required],
      batchStartDate: ['', Validators.required],
      numberOfStudents: ['', Validators.required],
      batchStartTime: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      batchEndTime: ['', Validators.required],
      registrationEndDate: ['', Validators.required],
      batchDurationDays: ['', Validators.required],
      externalLink: [''],
      termsOfEngagement: ['', Validators.required],
      uploadDemoVideo: [''],
      whoCanApply: ['', Validators.required]
    });

    this.addTrainerForm = this.fb.group({
      trainerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get ROLEID from sessionStorage (same as header component - note: it's 'RoleId' not 'ROLEID')
    this.ROLEID = sessionStorage.getItem('RoleId') || '';
    
    // Load apprenticeships from API
    this.loadApprenticeships();
  }

  loadApprenticeships() {
    this.isLoading = true;
    this.commonService.getApprenticeshipsList().subscribe(
      (res: any) => {
        if (res?.status === true && res?.data) {
          this.scheduleList = res.data;
        } else {
          this.scheduleList = [];
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

  get filteredSchedules() {
    if (!this.searchTerm) {
      return this.scheduleList;
    }
    const search = this.searchTerm.toLowerCase();
    return this.scheduleList.filter(item =>
      item.apprenticeship_name?.toLowerCase().includes(search) ||
      item.company_name?.toLowerCase().includes(search) ||
      item.batch_details?.toLowerCase().includes(search)
    );
  }

  get paginatedSchedules() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredSchedules.slice(start, end);
  }

  get totalPages(): number[] {
    const pageCount = Math.ceil(this.filteredSchedules.length / this.entriesPerPage);
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

  getStatusClass(status: string): string {
    switch(status) {
      case 'In Progress':
        return 'status-in-progress';
      case 'Upcoming':
        return 'status-upcoming';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  openAddScheduleModal() {
    this.addScheduleForm.reset();
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addScheduleModal'));
    modal.show();
  }

  saveSchedule() {
    if (this.addScheduleForm.valid) {
      const payload = {
        meetingType: this.addScheduleForm.get('meetingType')?.value,
        internshipCategory: this.addScheduleForm.get('internshipCategory')?.value,
        internshipName: this.addScheduleForm.get('internshipName')?.value,
        studentLevel: this.addScheduleForm.get('studentLevel')?.value,
        batchName: this.addScheduleForm.get('batchName')?.value,
        applicationFees: this.addScheduleForm.get('applicationFees')?.value,
        internshipClassification: this.addScheduleForm.get('internshipClassification')?.value,
        batchEndDate: this.addScheduleForm.get('batchEndDate')?.value,
        stipendPerMonth: this.addScheduleForm.get('stipendPerMonth')?.value,
        registrationStartDate: this.addScheduleForm.get('registrationStartDate')?.value,
        batchStartDate: this.addScheduleForm.get('batchStartDate')?.value,
        numberOfStudents: this.addScheduleForm.get('numberOfStudents')?.value,
        batchStartTime: this.addScheduleForm.get('batchStartTime')?.value,
        paymentMethod: this.addScheduleForm.get('paymentMethod')?.value,
        batchEndTime: this.addScheduleForm.get('batchEndTime')?.value,
        registrationEndDate: this.addScheduleForm.get('registrationEndDate')?.value,
        batchDurationDays: this.addScheduleForm.get('batchDurationDays')?.value,
        externalLink: this.addScheduleForm.get('externalLink')?.value,
        termsOfEngagement: this.addScheduleForm.get('termsOfEngagement')?.value,
        whoCanApply: this.addScheduleForm.get('whoCanApply')?.value
      };

      this.commonService.createApprenticeshipSchedule(payload).subscribe(
        (res: any) => {
          if (res?.status === true) {
            this.toastr.success('Batch schedule created successfully!');
            this.loadApprenticeships();
            
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addScheduleModal'));
            modal?.hide();
            this.addScheduleForm.reset();
          } else {
            this.toastr.error(res?.message || 'Failed to create batch schedule');
          }
        },
        (err) => {
          console.error('Error creating batch schedule:', err);
          this.toastr.error('Failed to create batch schedule');
        }
      );
    }
  }

  viewScheduleDetails(schedule: any) {
    this.selectedSchedule = schedule;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('scheduleDetailsModal'));
    modal.show();
  }

  openEditScheduleModal(schedule: any) {
    this.selectedSchedule = schedule;
    this.editScheduleForm.patchValue({
      meetingType: schedule.meetingType || 'Daily Meeting',
      internshipCategory: schedule.category || '',
      internshipName: schedule.programName || '',
      studentLevel: schedule.studentLevel || '',
      batchName: schedule.batchName || '',
      applicationFees: schedule.applicationFees || '',
      internshipClassification: schedule.internshipClassification || '',
      batchEndDate: schedule.endDate || '',
      stipendPerMonth: schedule.stipendPerMonth || '',
      registrationStartDate: schedule.registrationStartDate || '',
      batchStartDate: schedule.startDate || '',
      numberOfStudents: schedule.numberOfStudents || '',
      batchStartTime: schedule.batchStartTime || '',
      paymentMethod: schedule.paymentMethod || '',
      batchEndTime: schedule.batchEndTime || '',
      registrationEndDate: schedule.registrationEndDate || '',
      batchDurationDays: schedule.batchDurationDays || '',
      externalLink: schedule.externalLink || '',
      termsOfEngagement: schedule.termsOfEngagement || '',
      uploadDemoVideo: '',
      whoCanApply: schedule.whoCanApply || ''
    });
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editScheduleModal'));
    modal.show();
  }

  saveEditSchedule() {
    if (this.editScheduleForm.valid && this.selectedSchedule) {
      this.selectedSchedule.meetingType = this.editScheduleForm.get('meetingType')?.value;
      this.selectedSchedule.category = this.editScheduleForm.get('internshipCategory')?.value;
      this.selectedSchedule.programName = this.editScheduleForm.get('internshipName')?.value;
      this.selectedSchedule.studentLevel = this.editScheduleForm.get('studentLevel')?.value;
      this.selectedSchedule.batchName = this.editScheduleForm.get('batchName')?.value;
      this.selectedSchedule.applicationFees = this.editScheduleForm.get('applicationFees')?.value;
      this.selectedSchedule.internshipClassification = this.editScheduleForm.get('internshipClassification')?.value;
      this.selectedSchedule.endDate = this.editScheduleForm.get('batchEndDate')?.value;
      this.selectedSchedule.stipendPerMonth = this.editScheduleForm.get('stipendPerMonth')?.value;
      this.selectedSchedule.registrationStartDate = this.editScheduleForm.get('registrationStartDate')?.value;
      this.selectedSchedule.startDate = this.editScheduleForm.get('batchStartDate')?.value;
      this.selectedSchedule.numberOfStudents = this.editScheduleForm.get('numberOfStudents')?.value;
      this.selectedSchedule.batchStartTime = this.editScheduleForm.get('batchStartTime')?.value;
      this.selectedSchedule.paymentMethod = this.editScheduleForm.get('paymentMethod')?.value;
      this.selectedSchedule.batchEndTime = this.editScheduleForm.get('batchEndTime')?.value;
      this.selectedSchedule.registrationEndDate = this.editScheduleForm.get('registrationEndDate')?.value;
      this.selectedSchedule.batchDurationDays = this.editScheduleForm.get('batchDurationDays')?.value;
      this.selectedSchedule.externalLink = this.editScheduleForm.get('externalLink')?.value;
      this.selectedSchedule.termsOfEngagement = this.editScheduleForm.get('termsOfEngagement')?.value;
      this.selectedSchedule.whoCanApply = this.editScheduleForm.get('whoCanApply')?.value;
      
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editScheduleModal'));
      modal?.hide();
    }
  }

  openAddTrainerModal(schedule: any) {
    this.selectedSchedule = schedule;
    this.addTrainerForm.reset();
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addTrainerModal'));
    modal.show();
  }

  saveTrainer() {
    if (this.addTrainerForm.valid && this.selectedSchedule) {
      if (!this.selectedSchedule.trainers) {
        this.selectedSchedule.trainers = [];
      }
      const newTrainer = {
        id: (this.selectedSchedule.trainers.length || 0) + 1,
        name: this.addTrainerForm.get('trainerName')?.value,
        email: this.addTrainerForm.get('email')?.value,
        phone: this.addTrainerForm.get('phone')?.value,
        specialization: this.addTrainerForm.get('specialization')?.value,
        experience: this.addTrainerForm.get('experience')?.value
      };
      this.selectedSchedule.trainers.push(newTrainer);
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addTrainerModal'));
      modal?.hide();
      this.addTrainerForm.reset();
    }
  }
}
