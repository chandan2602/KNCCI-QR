import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-apprenticeship-details',
  templateUrl: './apprenticeship-details.component.html',
  styleUrls: ['./apprenticeship-details.component.css']
})
export class ApprenticeshipDetailsComponent implements OnInit {

  apprenticeship: any = null;
  sourceComponent: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
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
            this.router.navigate(['/HOME/apprenticeships']);
          }
        } else {
          this.router.navigate(['/HOME/apprenticeships']);
        }
        this.isLoading = false;
      },
      (err) => {
        console.error('Error loading apprenticeship details:', err);
        this.router.navigate(['/HOME/apprenticeships']);
        this.isLoading = false;
      }
    );
  }

  goBack() {
    this.router.navigate(['/HOME/apprenticeships']);
  }

  enrollNow() {
    alert('Enrollment functionality would be implemented here');
  }
}
