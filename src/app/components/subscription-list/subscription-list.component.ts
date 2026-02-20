import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../app/services/common.service';
import { BaseComponent } from 'src/app/pages/base.component';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent extends BaseComponent implements OnInit {

  roleId: any = sessionStorage.getItem('RoleId');
  USERTYPE: any = sessionStorage.getItem('USERTYPE');
  isAdmin: boolean = false; 
  listGrid: any[] = [];
  searchText: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  Math = Math;
  
  tooltipContent = `
    View all your subscription-related payment details, including subscription type, invoice, date, and amount. You can download invoices anytime using the<strong> Invoice</strong> button.
  `;

  constructor(CommonService: CommonService, public fb: FormBuilder, public router: Router, toastr: ToastrService) {
    super(CommonService, toastr)
    this.isAdmin = (+this.USERTYPE == 24);
  }

  ngOnInit(): void {
    this.LoadGrid()
  }

  LoadGrid() { // InternshipJobs/GetSubscribtionHistoryUserId
    this.CommonService.activateSpinner();
    this.CommonService.getCall(`InternshipJobs/GetSubscribtionHistoryUserId/${sessionStorage.UserId}`, '', false).subscribe(
      (res: any) => {
        if(res?.status == true) {
          this.deactivateSpinner();
          this.listGrid = res.data;
        } else {
          this.toastr.warning(res.message);
        }
      },
      err => {
        this.deactivateSpinner();
        this.toastr.warning(err.error ? err.error.text || err.error : 'Records not getting');
        // window.history.back()
      })
  }

  get filteredSubscriptions() {
    let subscriptions = this.listGrid;
    
    // Filter by search text
    if (this.searchText) {
      subscriptions = subscriptions.filter(s => 
        s.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.amount.toString().includes(this.searchText)
      );
    }
    
    return subscriptions;
  }

  get paginatedSubscriptions() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredSubscriptions.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredSubscriptions.length / this.entriesPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
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

  isActive(expiryDate: string): boolean {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry >= today;
  }

}
