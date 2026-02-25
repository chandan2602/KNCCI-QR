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
      category: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['Uncertified'],
      certificateName: [''],
      status: ['Active', Validators.required]
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
    this.addApprenticeshipForm.reset({
      type: 'Uncertified',
      status: 'Active'
    });
    const modal = new bootstrap.Modal(document.getElementById('addApprenticeshipModal'));
    modal.show();
  }

  saveApprenticeship() {
    if (this.addApprenticeshipForm.valid) {
      const payload = {
        programName: this.addApprenticeshipForm.get('name')?.value,
        category: this.addApprenticeshipForm.get('category')?.value,
        description: this.addApprenticeshipForm.get('description')?.value,
        type: this.addApprenticeshipForm.get('type')?.value,
        certificateName: this.addApprenticeshipForm.get('certificateName')?.value,
        status: this.addApprenticeshipForm.get('status')?.value === 'Active' ? 'Open' : 'Closed'
      };

      this.commonService.addApprenticeship(payload).subscribe(
        (res: any) => {
          if (res?.status === true) {
            this.toastr.success('Apprenticeship added successfully!');
            this.loadApprenticeships();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addApprenticeshipModal'));
            modal?.hide();

            this.addApprenticeshipForm.reset({
              type: 'Uncertified',
              status: 'Active'
            });
          } else {
            this.toastr.error(res?.message || 'Failed to add apprenticeship');
          }
        },
        (err) => {
          console.error('Error adding apprenticeship:', err);
          this.toastr.error('Failed to add apprenticeship');
        }
      );
    }
  }
}
