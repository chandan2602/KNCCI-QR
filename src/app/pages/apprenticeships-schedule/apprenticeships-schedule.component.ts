import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  scheduleList = [
    {
      id: 1,
      programName: 'Software Development Apprenticeship',
      company: 'Tech Solutions Kenya',
      startDate: '01-04-2026',
      endDate: '01-04-2027',
      phase: 'Phase 1: Foundation',
      duration: '3 months',
      location: 'Nairobi',
      mentor: 'John Kariuki',
      status: 'Upcoming',
      image: 'assets/kncci-img/img-1.png',
      category: 'Technology',
      description: 'Learn full-stack web development with hands-on projects and mentorship from experienced developers.'
    },
    {
      id: 2,
      programName: 'Digital Marketing Apprenticeship',
      company: 'Marketing Pro Ltd',
      startDate: '15-03-2026',
      endDate: '15-09-2026',
      phase: 'Phase 2: Advanced',
      duration: '6 months',
      location: 'Mombasa',
      mentor: 'Sarah Mwangi',
      status: 'In Progress',
      image: 'assets/kncci-img/img-2.png',
      category: 'Marketing',
      description: 'Gain practical experience in SEO, social media marketing, content creation, and digital advertising.'
    },
    {
      id: 3,
      programName: 'Electrical Engineering Apprenticeship',
      company: 'Power Systems Kenya',
      startDate: '01-05-2026',
      endDate: '01-11-2027',
      phase: 'Phase 1: Foundation',
      duration: '18 months',
      location: 'Kisumu',
      mentor: 'Peter Omondi',
      status: 'Upcoming',
      image: 'assets/kncci-img/img-3.png',
      category: 'Engineering',
      description: 'Work on real electrical installations and maintenance projects under the guidance of certified engineers.'
    },
    {
      id: 4,
      programName: 'Accounting & Finance Apprenticeship',
      company: 'Financial Services Group',
      startDate: '10-04-2026',
      endDate: '10-04-2027',
      phase: 'Phase 3: Specialization',
      duration: '12 months',
      location: 'Nairobi',
      mentor: 'Grace Kipchoge',
      status: 'Upcoming',
      image: 'assets/kncci-img/img-4.png',
      category: 'Finance',
      description: 'Learn bookkeeping, financial reporting, tax preparation, and auditing in a professional environment.'
    },
    {
      id: 5,
      programName: 'Mechanical Engineering Apprenticeship',
      company: 'Manufacturing Industries Ltd',
      startDate: '01-06-2026',
      endDate: '01-06-2028',
      phase: 'Phase 1: Foundation',
      duration: '24 months',
      location: 'Thika',
      mentor: 'David Kiplagat',
      status: 'Upcoming',
      image: 'assets/kncci-img/img-6.jpg',
      category: 'Engineering',
      description: 'Hands-on training in machine operation, maintenance, and manufacturing processes.'
    },
    {
      id: 6,
      programName: 'Data Analytics Apprenticeship',
      company: 'Data Insights Africa',
      startDate: '01-05-2026',
      endDate: '01-05-2027',
      phase: 'Phase 2: Advanced',
      duration: '12 months',
      location: 'Nairobi',
      mentor: 'Emily Njoroge',
      status: 'Upcoming',
      image: 'assets/kncci-img/img-7.png',
      category: 'Technology',
      description: 'Learn data collection, analysis, visualization, and reporting using industry-standard tools.'
    }
  ];

  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;

  constructor(private fb: FormBuilder) {
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
  }

  get filteredSchedules() {
    if (!this.searchTerm) {
      return this.scheduleList;
    }
    const search = this.searchTerm.toLowerCase();
    return this.scheduleList.filter(item =>
      item.programName?.toLowerCase().includes(search) ||
      item.company?.toLowerCase().includes(search) ||
      item.mentor?.toLowerCase().includes(search)
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
      const newSchedule = {
        id: this.scheduleList.length + 1,
        programName: this.addScheduleForm.get('internshipName')?.value,
        company: 'New Company',
        startDate: this.addScheduleForm.get('batchStartDate')?.value,
        endDate: this.addScheduleForm.get('batchEndDate')?.value,
        phase: 'Phase 1',
        duration: this.addScheduleForm.get('batchDurationDays')?.value + ' days',
        location: 'Location',
        mentor: 'Mentor',
        status: 'Upcoming',
        image: 'assets/kncci-img/img-1.png',
        category: 'Professional Development',
        description: 'New apprenticeship schedule'
      };
      this.scheduleList.push(newSchedule);
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addScheduleModal'));
      modal?.hide();
      this.addScheduleForm.reset();
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
