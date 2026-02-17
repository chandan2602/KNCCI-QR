import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  @Input() isVisible: boolean = false;

  isShowCourseSche: any = 'false';

  constructor(private route: Router) { 
    if (sessionStorage.getItem('isShowCourseSche') != null) {
      this.isShowCourseSche = JSON.parse(<string>sessionStorage.getItem('isShowCourseSche')), sessionStorage.removeItem('isShowCourseSche')    
    };
  }

  ngOnInit(): void {
  }

  gotoSignUp() {
    this.route.navigate(['/signup']);
  }

}
