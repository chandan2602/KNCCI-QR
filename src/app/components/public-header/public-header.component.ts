import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css']
})
export class PublicHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onSignupTypeChange(userType: string): void {
    if (!userType) return;

    // Close the modal
    $('#cls').click();

    // Navigate based on user type
    switch(userType) {
      case '1': // Company
      case '2': // Job Seeker
        this.router.navigate(['/signup'], { queryParams: { type: userType === '1' ? 'company' : 'jobSeeker' } });
        break;
      case '3': // Founder
        this.router.navigate(['startsUpReg']);
        break;
      case '4': // Incubator
        this.router.navigate(['incubatorReg']);
        break;
      case '5': // Investor
        this.router.navigate(['investorReg']);
        break;
    }
  }
}
